const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');

const target = `  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    const newMember = {
      id: \`tm-\${Date.now()}\`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role,
      joinedAt: new Date().toISOString()
    };
    setTeamMembers([...teamMembers, newMember]);
    setName('');
    setEmail('');
    setShowInviteModal(false);
  };`;

const replacement = `  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });
    setName('');
    setEmail('');
    setShowInviteModal(false);
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/TeamManagement.tsx', code);
