const fs = require('fs');
let code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

code = code.replace(/  \};\n\nexport const scanController = new ScanController\(\);/, '  };\n}\nexport const scanController = new ScanController();');

fs.writeFileSync('backend/controllers/scanController.ts', code);
