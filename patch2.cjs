const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  'legacyHeaders: false,',
  'legacyHeaders: false,\n  validate: false,'
);
fs.writeFileSync('server.ts', code);
