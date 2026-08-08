const fs = require('fs');

let envCode = fs.readFileSync('backend/config/env.ts', 'utf8');
envCode = envCode.replace(/console\.warn/g, 'Logger.warning');
envCode = envCode.replace(/console\.log/g, 'Logger.info');
envCode = envCode.replace(/console\.error/g, 'Logger.error');
if (!envCode.includes('import { Logger }')) {
  envCode = 'import { Logger } from "../utils/logger";\n' + envCode;
}
fs.writeFileSync('backend/config/env.ts', envCode);

let dbCode = fs.readFileSync('backend/database/db.ts', 'utf8');
dbCode = dbCode.replace(/console\.log/g, 'Logger.info');
dbCode = dbCode.replace(/console\.error/g, 'Logger.error');
if (!dbCode.includes('import { Logger }')) {
  dbCode = 'import { Logger } from "../utils/logger";\n' + dbCode;
}
fs.writeFileSync('backend/database/db.ts', dbCode);

console.log("Fixed logs");
