const fs = require('fs');
let code = fs.readFileSync('src/api/services/tasks.ts', 'utf8');
code = code.replace(/    if \(\!tasks \|\| tasks\.length === 0\) \{\n      tasks = defaultTasks;\n    \}/g, '');
code = code.replace(/ \|\| defaultTasks\[0\]/g, '');
code = code.replace(/tasks = defaultTasks;/g, 'tasks = [];');
fs.writeFileSync('src/api/services/tasks.ts', code);
