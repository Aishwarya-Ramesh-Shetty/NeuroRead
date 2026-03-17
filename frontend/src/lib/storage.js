const TOKEN_KEY = 'dyslexia_token';
const USER_KEY = 'dyslexia_user';
const LAST_RESULT_KEY = 'dyslexia_last_result';

export const storage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser() {
    const rawValue = localStorage.getItem(USER_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
  getLastResult() {
    const rawValue = localStorage.getItem(LAST_RESULT_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  },
  setLastResult(result) {
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
  },
  clearLastResult() {
    localStorage.removeItem(LAST_RESULT_KEY);
  },
  clearSession() {
    this.clearToken();
    this.clearUser();
    this.clearLastResult();
  }
};
