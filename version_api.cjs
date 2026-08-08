const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('app.use("/api/v1"')) {
  code = code.replace(
    'app.use("/api", apiLimiter, apiRouter);',
    'app.use("/api", apiLimiter, apiRouter);\napp.use("/api/v1", apiLimiter, apiRouter); // V1 versioning'
  );
  fs.writeFileSync('server.ts', code);
  console.log("Versioned API");
}
