const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const imports = `import express from "express";
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
`;

content = content.replace(/import express from "express";[\s\S]*?import { scanRepository } from "\.\/backend\/repositories\/ScanRepository";/, imports);

const middlewares = `const app = express();
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
app.use(traceMiddleware);`;

const oldMiddlewares = `const app = express();
const PORT = 3000;
app.use(express.json());

// Enable Request Tracing & Performance Profiling early
app.use(traceMiddleware);`;

content = content.replace(oldMiddlewares, middlewares);
content = content.replace(/app\.use\("\/api", apiRouter\);/, 'app.use("/api", apiLimiter, apiRouter);');

fs.writeFileSync('server.ts', content, 'utf8');
