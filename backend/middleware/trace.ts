import { Request, Response, NextFunction } from "express";
import { loggerContextStorage } from "../utils/logger";
import { Logger } from "../utils/logger";

export interface TracedRequest extends Request {
  id?: string;
  startTime?: number;
}

export function traceMiddleware(req: TracedRequest, res: Response, next: NextFunction) {
  const reqId = (req.headers["x-request-id"] as string) || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = reqId;
  req.startTime = performance.now();

  res.setHeader("X-Request-ID", reqId);

  const context = {
    requestId: reqId,
    userId: "anonymous",
    module: req.baseUrl || "ExpressRouter",
  };

  loggerContextStorage.run(context, () => {
    Logger.debug(`📥 Request received: ${req.method} ${req.originalUrl}`);

    res.on("finish", () => {
      const duration = performance.now() - (req.startTime || performance.now());
      Logger.perf(`Express HTTP ${req.method} ${req.originalUrl}`, duration, {
        statusCode: res.statusCode,
        userAgent: req.headers["user-agent"],
      });
    });

    next();
  });
}
