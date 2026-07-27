const fs = require('fs');
let code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

const regex = /\}[\s]*public getScanProfiles/;
if (regex.test(code)) {
    code = code.replace(regex, `
  public getScanProfiles`);
}
fs.writeFileSync('backend/controllers/scanController.ts', code);
