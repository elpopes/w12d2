export function storeCSRFToken(response) {
  const csrfToken = response.headers.get("X-CSRF-Token");
  if (csrfToken) sessionStorage.setItem("X-CSRF-Token", csrfToken);
}

export async function restoreCSRF() {
  const response = await csrfFetch("/api/session");
  storeCSRFToken(response);
  return response;
}

async function csrfFetch(url, options = {}) {
  // sets dflt to "GET"
  options.method = options.method || "GET";
  // sets dflt headers to empty obj
  options.headers = options.headers || {};

  // if method's not 'GET', then set "Content-Type" header to "application/json"
  //   and sets CSRF token header to the value of the CSRF cookie
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["X-CSRF-Token"] = sessionStorage.getItem("X-CSRF-Token");
  }

  // fetches with url and updated options hash
  const res = await fetch(url, options);

  // throws an error as res if 400 or greater
  if (res.status >= 400) throw res;

  // if under 400 return res
  return res;
}

export default csrfFetch;
