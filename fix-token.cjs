const fs = require('fs');
let content = fs.readFileSync('src/api/auth/tokenManager.ts', 'utf8');
content = content.replace("const TOKEN_KEY = 'ais_access_token';", "const TOKEN_KEY = 'sniper_token';");
fs.writeFileSync('src/api/auth/tokenManager.ts', content, 'utf8');
