const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');

code = code.replace(/    const newMember = \{\n      id: `tm-\$\{Date\.now\(\)\}`,\n      name: name\.trim\(\) \|\| email\.split\('@'\)\[0\],\n      email: email\.trim\(\),\n      role,\n      joinedAt: new Date\(\)\.toISOString\(\)\n    \};\n    setTeamMembers\(\[\.\.\.teamMembers, newMember\]\);/m, `    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });`);

fs.writeFileSync('src/pages/TeamManagement.tsx', code);
