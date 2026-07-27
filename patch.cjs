const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  'Logger.error("Global express exception captured", err);',
  `Logger.error("Global express exception captured", err);
  require("fs").appendFileSync("error.log", new Date().toISOString() + " ERROR: " + err.stack + "\\n");`
);
fs.writeFileSync('server.ts', code);
