const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');
const target = `    const newMember = {
      id: \`tm-\${Date.now()}\`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role,
      joinedAt: new Date().toISOString()
    };
    setTeamMembers([...teamMembers, newMember]);
    setName('');`;

code = code.replace(target, `    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });
    setName('');`);
fs.writeFileSync('src/pages/TeamManagement.tsx', code);
