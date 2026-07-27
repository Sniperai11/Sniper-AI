const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');

const regex = /    const newMember = \{[\s\S]*?setTeamMembers\(\[\.\.\.teamMembers, newMember\]\);/g;
code = code.replace(regex, `    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });`);

fs.writeFileSync('src/pages/TeamManagement.tsx', code);
