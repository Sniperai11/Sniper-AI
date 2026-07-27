const fs = require('fs');
let code = fs.readFileSync('src/api/services/vulnerabilities.ts', 'utf8');

code = code.replace(/    \} catch \{\n      \/\/ fallback\n    \}\n    const matched = vulns\.find\(v => v\.id === id\);\n    return matched;\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Vulnerability not found");\n  },');

code = code.replace(/    \} catch \{\n      \/\/ ignore\n    \}\n    const matched = vulns\.find\(v => v\.id === id\);\n    return \{ \.\.\.matched, state, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Vulnerability not found");\n  },');

code = code.replace(/    \} catch \{\n      \/\/ ignore\n    \}\n    const matched = vulns\.find\(v => v\.id === id\);\n    return \{ \.\.\.matched, owner, updatedAt: new Date\(\)\.toISOString\(\) \};\n  \},/g, '    } catch (e) {\n      throw e;\n    }\n    throw new Error("Vulnerability not found");\n  },');

fs.writeFileSync('src/api/services/vulnerabilities.ts', code);
