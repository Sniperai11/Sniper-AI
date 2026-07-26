const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldErr = `// Global API Exception middleware
app.use((err: any, req: any, res: any, next: any) => {
  Logger.error("Global express exception captured", err);
  const timestamp = new Date().toISOString();
  const statusCode = err.statusCode || err.status || 500;
  const validStatus = typeof statusCode === "number" && statusCode >= 100 && statusCode < 600 ? statusCode : 500;
  res.status(validStatus);
  res.json({
    success: false,
    message: err.message || "حدث خطأ غير متوقع في الخادم",
    data: null,
    errors: err.errors || [err.toString()],
    timestamp
  });
});`;

const newErr = `// Global API Exception middleware
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
});`;

content = content.replace(oldErr, newErr);
fs.writeFileSync('server.ts', content, 'utf8');
