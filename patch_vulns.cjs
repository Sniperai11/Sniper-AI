const fs = require('fs');
let code = fs.readFileSync('src/api/services/vulnerabilities.ts', 'utf8');
code = code.replace(/    if \(\!vulns \|\| vulns\.length === 0\) \{\n      vulns = defaultVulnerabilities;\n    \}/g, '');
code = code.replace(/ \|\| defaultVulnerabilities\[0\]/g, '');
code = code.replace(/vulns = defaultVulnerabilities;/g, 'vulns = [];');
code = code.replace(/defaultVulnerabilities\.find/g, 'vulns.find');

fs.writeFileSync('src/api/services/vulnerabilities.ts', code);
