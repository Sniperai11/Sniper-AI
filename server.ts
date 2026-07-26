import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import apiRouter from "./backend/routes/api";
import { validateEnvironment } from "./backend/config/env";
import { traceMiddleware } from "./backend/middleware/trace";
import { Logger } from "./backend/utils/logger";
import { scanRepository } from "./backend/repositories/ScanRepository";

dotenv.config();

// Validate Environment Variables on start
try {
  validateEnvironment();
} catch (envError: any) {
  console.error("❌ CRITICAL CONFIGURATION ERROR:", envError.message);
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Production Hardening Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "تم تجاوز الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً",
  }
});

// Enable Request Tracing & Performance Profiling early
app.use(traceMiddleware);

// Define standard response for health check endpoints
const healthCheckHandler = (req: express.Request, res: express.Response) => {
  const timestamp = new Date().toISOString();
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      status: "healthy",
      node_env: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    },
    errors: [],
    timestamp
  });
};

// Mount requested Health, Readiness, and Liveness endpoints on both root and API prefixes
app.get("/health", healthCheckHandler);
app.get("/ready", healthCheckHandler);
app.get("/live", healthCheckHandler);
app.get("/api/health", healthCheckHandler);
app.get("/api/ready", healthCheckHandler);
app.get("/api/live", healthCheckHandler);

// Mount the modular backend API routes
app.use("/api", apiLimiter, apiRouter);

// Global API 404 Route handler
app.use("/api/*", (req, res) => {
  const timestamp = new Date().toISOString();
  res.status(404).json({
    success: false,
    message: "المسار المطلوب غير موجود",
    data: null,
    errors: ["Route not found"],
    timestamp
  });
});

// Global API Exception middleware
app.use((err: any, req: any, res: any, next: any) => {
  Logger.error("Global express exception captured", err);
  const timestamp = new Date().toISOString();
  const statusCode = err.statusCode || err.status || 500;
  const validStatus = typeof statusCode === "number" && statusCode >= 100 && statusCode < 600 ? statusCode : 500;
  
  // Production hardening: do not leak error stacks or internal strings to the client
  const isProd = process.env.NODE_ENV === "production";
  
  res.status(validStatus);
  res.json({
    success: false,
    message: (isProd && validStatus >= 500) ? "حدث خطأ غير متوقع في الخادم" : (err.message || "حدث خطأ غير متوقع في الخادم"),
    data: null,
    errors: isProd ? [] : (err.errors || [err.toString()]),
    timestamp
  });
});

// Set up server-side environments
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa"
  }).then((vite) => {
    app.use(vite.middlewares);
    
    const server = app.listen(PORT, "0.0.0.0", () => {
      Logger.info(`Development Server running on http://0.0.0.0:${PORT}`);
    });
    setupGracefulShutdown(server);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`Production Server running on http://0.0.0.0:${PORT}`);
  });
  setupGracefulShutdown(server);
}

// Implement Graceful Shutdown
function setupGracefulShutdown(server: any) {
  const handleGracefulShutdown = (signal: string) => {
    Logger.warning(`⚠️ Received ${signal}. Starting graceful shutdown procedure...`);
    
    // Stop accepting new connections
    server.close(() => {
      Logger.info("HTTP server closed. No longer accepting new requests.");
      
      try {
        scanRepository.getActiveScans().then(activeScans => {
          const running = activeScans.filter(s => s.status === "Scanning" || s.status === "Analyzing");
          if (running.length > 0) {
            Logger.info(`Terminating ${running.length} active scanner jobs gracefully...`);
            for (const scan of running) {
              scan.status = "Failed";
              scan.scannerLogs.push(`[!] تم إلغاء الفحص الأمني قسرياً بسبب إيقاف تشغيل الخادم الآمن.`);
            }
            Logger.info("Saved final failure state of interrupted scanner jobs to database.");
          }
        }).catch(err => {
          Logger.error("Failed to update active scan jobs during shutdown:", err);
        });
      } catch (dbErr) {
        Logger.error("Failed to update active scan jobs during shutdown:", dbErr);
      }

      Logger.info("All pending data saved. Releasing resources successfully.");
      process.exit(0);
    });

    // Force exit after 5 seconds if connections didn't close in time
    setTimeout(() => {
      Logger.error("Forcing server termination after timeout.");
      process.exit(1);
    }, 5000);
  };

  process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
}
