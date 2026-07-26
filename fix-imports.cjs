const fs = require('fs');
const glob = require('glob');

function fixFiles(pattern, importPath) {
  const files = glob.sync(pattern);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Logger.') && !content.includes('import { Logger }')) {
      content = `import { Logger } from "${importPath}";\n` + content;
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed', file);
    }
  }
}

fixFiles('backend/controllers/*.ts', '../utils/logger');
fixFiles('backend/services/*.ts', '../utils/logger');
fixFiles('backend/repositories/*.ts', '../utils/logger');
fixFiles('backend/security/scanners/*.ts', '../../utils/logger');
fixFiles('backend/security/*.ts', '../utils/logger');
