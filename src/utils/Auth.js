const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const value = localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = () => {
  removeToken();
  setRefreshToken();
  removeUser();
};
const REFRESH_KEY = 'refreshToken';

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY);
};