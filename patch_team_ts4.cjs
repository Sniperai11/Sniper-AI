const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');

const regex = /    const newMember = \{[\s\S]*?joinedAt: new Date\(\)\.toISOString\(\)\n    \};\n    setTeamMembers\(\[\.\.\.teamMembers, newMember\]\);\n/g;
code = code.replace(regex, `    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });\n`);

fs.writeFileSync('src/pages/TeamManagement.tsx', code);
