const fs = require('fs');
let code = fs.readFileSync('src/api/services/incidents.ts', 'utf8');

code = code.replace(/    \} catch \{\n      \/\/ fallback\n    \}\n    return incidents\.find\(i => i\.id === id\);\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Incident not found");\n  },');

code = code.replace(/    \} catch \{\n      \/\/ fallback\n    \}\n    const matched = incidents\.find\(i => i\.id === id\);\n    return \{ \.\.\.matched, state, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Incident not found");\n  },');

code = code.replace(/    const matched = incidents\.find\(i => i\.id === id\);\n    return \{ \.\.\.matched, owner, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \},/g, '    throw new Error("Incident not found");\n  },');

code = code.replace(/    const matched = incidents\.find\(i => i\.id === id\);\n    return \{ \.\.\.matched, \.\.\.updates, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \}/g, '    throw new Error("Incident not found");\n  }');

fs.writeFileSync('src/api/services/incidents.ts', code);
