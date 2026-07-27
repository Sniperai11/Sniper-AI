const fs = require('fs');
let code = fs.readFileSync('src/pages/AssetIntelligence.tsx', 'utf8');

code = code.replace(/      \)\}\n  \);\n\};\n?/g, `      )}\n    </div>\n  );\n};\n`);
fs.writeFileSync('src/pages/AssetIntelligence.tsx', code);
