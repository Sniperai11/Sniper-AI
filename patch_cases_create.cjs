const fs = require('fs');
let code = fs.readFileSync('src/api/services/cases.ts', 'utf8');

const regex = /\} catch \{\n      \/\/ fallback\n    \}\n    return \{\n      id: `CASE-BB-\$\{Math\.floor\(100 \+ Math\.random\(\) \* 900\)\}`,[\s\S]*?\};\n  \},/m;

code = code.replace(regex, `} catch (e) {\n      throw e;\n    }\n    throw new Error('Failed to create case');\n  },`);

fs.writeFileSync('src/api/services/cases.ts', code);
