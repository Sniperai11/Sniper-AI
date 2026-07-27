const fs = require('fs');
let code = fs.readFileSync('src/api/services/incidents.ts', 'utf8');

code = code.replace(/    \} catch \(e\) \{\n      throw e;\n    \}\n    const matched = incidents\.find\(i => i\.id === id\);\n    return \{ \.\.\.matched, state, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Incident not found");\n  },');

fs.writeFileSync('src/api/services/incidents.ts', code);
