const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (value === undefined) {
    console.error(`CRITICAL: Environment variable ${key} is missing`);
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
};

export const env = {
  API_URL: getEnvVar('VITE_API_URL', '/api'),
  WS_URL: getEnvVar('VITE_WS_URL', 'ws://localhost:3000'),
  APP_ENV: getEnvVar('VITE_APP_ENV', 'development'),
};
