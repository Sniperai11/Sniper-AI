const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  'require("fs").appendFileSync("error.log", new Date().toISOString() + " ERROR: " + err.stack + "\\n");',
  ''
);
fs.writeFileSync('server.ts', code);
