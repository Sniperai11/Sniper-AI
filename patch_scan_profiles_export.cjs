const fs = require('fs');
let code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

code = code.replace(/export const getActiveScans = scanController\.getActiveScans;/, 'export const getScanProfiles = scanController.getScanProfiles;\nexport const getActiveScans = scanController.getActiveScans;');

fs.writeFileSync('backend/controllers/scanController.ts', code);
