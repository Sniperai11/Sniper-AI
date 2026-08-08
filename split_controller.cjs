const fs = require('fs');

const code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

const methods = [
  'getActiveScans', 'startTargetScan', 'getVulnerabilities', 'aiAnalyzeVulnerability',
  'toggleVulnerabilityFalsePositive', 'getScanById', 'stopScan', 'getVulnerabilityById',
  'updateVulnerabilityOwner', 'getScanProfiles'
];

function extractMethod(methodName) {
  const regex = new RegExp(`(\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?public ${methodName} = async \\(.*?\\) => \\{[\\s\\S]*?\\n  };`, 'g');
  const match = code.match(regex);
  return match ? match[0] : '';
}

const imports = code.match(/import .*?;/g).join('\n');

function createController(className, methodNames, exportsCode) {
  let content = imports + '\n\n';
  content += `export class ${className} {\n`;
  content += `  private scanRepo: ScanRepository;\n`;
  content += `  constructor(repo: ScanRepository = scanRepository) {\n    this.scanRepo = repo;\n  }\n\n`;
  
  for (const m of methodNames) {
    content += extractMethod(m) + '\n\n';
  }
  content += `}\n\n`;
  content += exportsCode;
  return content;
}

const vulnCode = createController('VulnerabilityController', 
  ['getVulnerabilities', 'aiAnalyzeVulnerability', 'toggleVulnerabilityFalsePositive', 'getVulnerabilityById', 'updateVulnerabilityOwner'],
  `export const vulnerabilityController = new VulnerabilityController();\n`
);

const profileCode = createController('ScanProfileController', 
  ['getScanProfiles'],
  `export const scanProfileController = new ScanProfileController();\n`
);

const scanCode = createController('ScanController', 
  ['getActiveScans', 'startTargetScan', 'getScanById', 'stopScan'],
  `export const scanController = new ScanController();\n`
);

fs.writeFileSync('backend/controllers/vulnerabilityController.ts', vulnCode);
fs.writeFileSync('backend/controllers/scanProfileController.ts', profileCode);
fs.writeFileSync('backend/controllers/scanController.ts', scanCode);

console.log("Split complete.");
