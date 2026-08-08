const fs = require('fs');
let code = fs.readFileSync('backend/routes/api.ts', 'utf8');

code = code.replace(
  /router\.post\("\/projects\/create", projectController\.createProject\);/,
  `router.post("/projects", projectController.createProject); // Standard REST
router.post("/projects/create", projectController.createProject); // Legacy compatibility`
);

code = code.replace(
  /router\.post\("\/projects\/:id\/targets\/add", projectController\.addTargetToProject\);/,
  `router.post("/projects/:id/targets", projectController.addTargetToProject); // Standard REST
router.post("/projects/:id/targets/add", projectController.addTargetToProject); // Legacy compatibility`
);

fs.writeFileSync('backend/routes/api.ts', code);
console.log("Standardized routes");
