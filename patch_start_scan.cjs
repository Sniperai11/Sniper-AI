const fs = require('fs');
let code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

code = code.replace(/const \{ id \} = req\.params;/, 'const id = req.params.id || req.body.targetId;');

fs.writeFileSync('backend/controllers/scanController.ts', code);
