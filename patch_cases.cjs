const fs = require('fs');
let code = fs.readFileSync('src/api/services/cases.ts', 'utf8');
code = code.replace(/    if \(\!cases \|\| cases\.length === 0\) \{\n      cases = defaultCases;\n    \}/g, '');
code = code.replace(/ \|\| defaultCases\[0\]/g, '');
fs.writeFileSync('src/api/services/cases.ts', code);
