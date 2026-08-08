const fs = require('fs');
let code = fs.readFileSync('backend/routes/api.ts', 'utf8');

code = code.replace(
  /import \* as scanController from "\.\.\/controllers\/scanController";/,
  `import { scanController } from "../controllers/scanController";\nimport { vulnerabilityController } from "../controllers/vulnerabilityController";\nimport { scanProfileController } from "../controllers/scanProfileController";`
);

code = code.replace(/scanController\.getScanProfiles/g, 'scanProfileController.getScanProfiles');
code = code.replace(/scanController\.getVulnerabilities/g, 'vulnerabilityController.getVulnerabilities');
code = code.replace(/scanController\.getVulnerabilityById/g, 'vulnerabilityController.getVulnerabilityById');
code = code.replace(/scanController\.updateVulnerabilityOwner/g, 'vulnerabilityController.updateVulnerabilityOwner');
code = code.replace(/scanController\.aiAnalyzeVulnerability/g, 'vulnerabilityController.aiAnalyzeVulnerability');
code = code.replace(/scanController\.toggleVulnerabilityFalsePositive/g, 'vulnerabilityController.toggleVulnerabilityFalsePositive');

fs.writeFileSync('backend/routes/api.ts', code);
console.log("Updated api.ts");
