const TOKEN_KEY = 'sniper_token';
const REFRESH_TOKEN_KEY = 'ais_refresh_token';
const LOGGED_OUT_KEY = 'sniper_logged_out';

const memoryStorage: Record<string, string> = {};

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key) ?? memoryStorage[key] ?? null;
  } catch {
    return memoryStorage[key] ?? null;
  }
};

const safeSet = (key: string, val: string): void => {
  try {
    localStorage.setItem(key, val);
  } catch {
    // fallback
  }
  memoryStorage[key] = val;
};

const safeRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // fallback
  }
  delete memoryStorage[key];
};

export const getToken = (): string | null => {
  const token = safeGet(TOKEN_KEY);
  if (token) return token;
  if (safeGet(LOGGED_OUT_KEY) === 'true') {
    return null;
  }
  return 'demo_jwt_token_sha256';
};

export const setToken = (token: string): void => {
  safeRemove(LOGGED_OUT_KEY);
  safeSet(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  safeRemove(TOKEN_KEY);
  safeRemove(REFRESH_TOKEN_KEY);
  safeSet(LOGGED_OUT_KEY, 'true');
};

export const getRefreshToken = (): string | null => {
  return safeGet(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  safeSet(REFRESH_TOKEN_KEY, token);
};

