const fs = require('fs');
let code = fs.readFileSync('backend/routes/api.ts', 'utf8');

code = code.replace(/router\.get\("\/scans", scanController\.getActiveScans\);/, 'router.get("/scans", scanController.getActiveScans);\nrouter.get("/scans/profiles", scanController.getScanProfiles);\nrouter.post("/scans", scanController.startTargetScan);');

fs.writeFileSync('backend/routes/api.ts', code);
