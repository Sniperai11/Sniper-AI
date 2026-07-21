import { AsyncLocalStorage } from "async_hooks";
import { ENV } from "../config/env";

export enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  SECURITY = "SECURITY",
  AI = "AI",
  PERF = "PERF",
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  module?: string;
  scannerName?: string;
}

export const loggerContextStorage = new AsyncLocalStorage<LogContext>();

export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    meta?: any,
    error?: Error | any
  ): string {
    const timestamp = new Date().toISOString();
    const context = loggerContextStorage.getStore() || {};

    const structuredLog: Record<string, any> = {
      timestamp,
      level,
      message,
      requestId: context.requestId || undefined,
      userId: context.userId || undefined,
      module: context.module || undefined,
      scannerName: context.scannerName || undefined,
    };

    if (meta) {
      structuredLog.meta = meta;
    }

    if (error) {
      structuredLog.error =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error;
    }

    return `[${timestamp}] [${level}]${
      context.requestId ? ` [ReqID: ${context.requestId}]` : ""
    }${context.module ? ` [Mod: ${context.module}]` : ""} ${message}${
      meta ? ` | Meta: ${JSON.stringify(meta)}` : ""
    }${error ? ` | Error: ${JSON.stringify(structuredLog.error)}` : ""}`;
  }

  public static info(message: string, meta?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, meta));
  }

  public static warning(message: string, meta?: any) {
    console.warn(this.formatMessage(LogLevel.WARNING, message, meta));
  }

  public static error(message: string, error?: Error | any, meta?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, meta, error));
  }

  public static debug(message: string, meta?: any) {
    if (ENV.NODE_ENV !== "production") {
      console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  public static security(message: string, meta?: any) {
    console.log(
      `\x1b[31m${this.formatMessage(LogLevel.SECURITY, message, meta)}\x1b[0m`
    );
  }

  public static ai(message: string, meta?: any) {
    console.log(
      `\x1b[36m${this.formatMessage(LogLevel.AI, message, meta)}\x1b[0m`
    );
  }

  /**
   * Performance metrics logging helper
   */
  public static perf(operation: string, durationMs: number, meta?: any) {
    console.log(
      `\x1b[32m${this.formatMessage(
        LogLevel.PERF,
        `⚡ [PERF] Operation ${operation} completed in ${durationMs.toFixed(2)}ms`,
        { durationMs, ...meta }
      )}\x1b[0m`
    );
  }

  /**
   * Helper to execute a synchronous or asynchronous function with performance duration monitoring
   */
  public static async profile<T>(
    operation: string,
    fn: () => Promise<T> | T,
    meta?: any
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const elapsed = performance.now() - startTime;
      this.perf(operation, elapsed, meta);
      return result;
    } catch (err) {
      const elapsed = performance.now() - startTime;
      this.perf(`${operation} (FAILED)`, elapsed, { ...meta, error: String(err) });
      throw err;
    }
  }
}

