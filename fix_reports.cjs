const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

code = code.replace(/    <\/div>\n  \);\n\};\s*                     <\/span>\n                      <span className="font-mono">\{report\.size\}<\/span>\n                    <\/div>\n                  <\/div>[\s\S]*?/m, '    </div>\n  );\n};\n');

fs.writeFileSync('src/pages/Reports.tsx', code);
