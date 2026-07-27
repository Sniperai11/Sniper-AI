const TOKEN_KEY = 'sniper_token';
const REFRESH_TOKEN_KEY = 'ais_refresh_token';
const LOGGED_OUT_KEY = 'sniper_logged_out';

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  if (localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
    return null;
  }
  return 'demo_jwt_token_sha256';
};

export const setToken = (token: string): void => {
  localStorage.removeItem(LOGGED_OUT_KEY);
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.setItem(LOGGED_OUT_KEY, 'true');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};
