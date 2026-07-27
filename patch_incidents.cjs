const fs = require('fs');
let code = fs.readFileSync('src/api/services/incidents.ts', 'utf8');
code = code.replace(/    if \(\!incidents \|\| incidents\.length === 0\) \{\n      incidents = defaultIncidents;\n    \}/g, '');
code = code.replace(/ \|\| defaultIncidents\[0\]/g, '');
code = code.replace(/incidents = defaultIncidents;/g, 'incidents = [];');
code = code.replace(/defaultIncidents\.find/g, 'incidents.find');
fs.writeFileSync('src/api/services/incidents.ts', code);
