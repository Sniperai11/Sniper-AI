const fs = require('fs');
let code = fs.readFileSync('src/api/services/tasks.ts', 'utf8');
code = code.replace(/    const matched = tasks\.find\(t => t\.id === id\);\n    return matched;\n  \},/g, '    const matched = tasks.find(t => t.id === id);\n    if (!matched) throw new Error("Task not found");\n    return matched;\n  },');

code = code.replace(/    const matched = tasks\.find\(t => t\.id === id\);\n    return \{ \.\.\.matched, status \};\n  \},/g, '    const matched = tasks.find(t => t.id === id);\n    if (!matched) throw new Error("Task not found");\n    return { ...matched, status };\n  },');

code = code.replace(/    const matched = tasks\.find\(t => t\.id === id\);\n    return \{ \.\.\.matched, \.\.\.updates \};\n  \}/g, '    const matched = tasks.find(t => t.id === id);\n    if (!matched) throw new Error("Task not found");\n    return { ...matched, ...updates };\n  }');
fs.writeFileSync('src/api/services/tasks.ts', code);
