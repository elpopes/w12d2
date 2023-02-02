import csrfFetch from "./csrf";

export const SET_SESSION_USER = "SET_SESSION_USER";
export const REMOVE_SESSION_USER = "REMOVE_SESSION_USER";

export const setSessionUser = (user) => ({
  type: SET_SESSION_USER,
  user,
});

export const removeSessionUser = () => ({
  type: REMOVE_SESSION_USER,
});

const storeCSRFToken = (response) => {
  const csrfToken = response.headers.get("X-CSRF-Token");
  if (csrfToken) sessionStorage.setItem("X-CSRF-Token", csrfToken);
};

const storeCurrentUser = (user) => {
  if (user) sessionStorage.setItem("currentUser", JSON.stringify(user));
  else sessionStorage.removeItem("currentUser");
};

export const login =
  ({ credential, password }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    storeCurrentUser(data.user);
    dispatch(setSessionUser(data.user));
    return response;
  };

export const restoreSession = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  storeCSRFToken(response);
  const data = await response.json();
  storeCurrentUser(data.user);
  dispatch(setSessionUser(data.user));
  return response;
};

const initialState = {
  user: JSON.parse(sessionStorage.getItem("currentUser")),
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return {
        user: action.user,
      };
    case REMOVE_SESSION_USER:
      return {
        user: null,
      };
    default:
      return state;
  }
};

export default sessionReducer;
