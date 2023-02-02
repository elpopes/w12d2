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

const initialState = {
  user: null,
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

export const login = (credential, password) => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const user = await response.json();
    dispatch(setSessionUser(user));
  }
};

export default sessionReducer;
