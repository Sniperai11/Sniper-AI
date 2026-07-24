import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const log = (level: LogLevel, message: string, ...args: any[]) => {
  // Disable debug and info logs in production
  if (env.APP_ENV === 'production' && (level === 'debug' || level === 'info')) {
    return;
  }

  // Sanitize args to prevent logging sensitive data
  const sanitizedArgs = args.map(arg => {
    if (typeof arg === 'string' && (arg.startsWith('Bearer ') || arg.length > 200)) {
       return '[REDACTED]';
    }
    // Basic sanitization
    return arg;
  });

  switch (level) {
    case 'error':
      console.error(`[ERROR] ${message}`, ...sanitizedArgs);
      break;
    case 'warn':
      console.warn(`[WARN] ${message}`, ...sanitizedArgs);
      break;
    case 'info':
      console.info(`[INFO] ${message}`, ...sanitizedArgs);
      break;
    case 'debug':
      console.debug(`[DEBUG] ${message}`, ...sanitizedArgs);
      break;
  }
};

export const Logger = {
  info: (message: string, ...args: any[]) => log('info', message, ...args),
  warn: (message: string, ...args: any[]) => log('warn', message, ...args),
  error: (message: string, ...args: any[]) => log('error', message, ...args),
  debug: (message: string, ...args: any[]) => log('debug', message, ...args),
};
