const fs = require('fs');
let code = fs.readFileSync('src/pages/TeamManagement.tsx', 'utf8');

code = code.replace("import { useSecurityStore } from '../store/useSecurityStore';", "import { useTeamMembers, useAddTeamMember, useDeleteTeamMember } from '../hooks/api/useTeam';");

code = code.replace("  const { teamMembers, setTeamMembers } = useSecurityStore();", `  const { data: teamMembers = [], isLoading } = useTeamMembers();
  const { mutate: addMember } = useAddTeamMember();
  const { mutate: removeMember } = useDeleteTeamMember();`);

code = code.replace(/    const newMember = \{[\s\S]*?joinedAt: new Date\(\)\.toISOString\(\)\n    \};\n    setTeamMembers\(\[\.\.\.teamMembers, newMember\]\);\n/m, `    addMember({ name: name.trim() || email.split('@')[0], email: email.trim(), role });\n`);

code = code.replace(/  const handleRemoveMember = \(id: string\) => \{\n    setTeamMembers\(teamMembers\.filter\(m => m\.id !== id\)\);\n  \};\n/m, `  const handleRemoveMember = (id: string) => {\n    removeMember(id);\n  };\n`);

fs.writeFileSync('src/pages/TeamManagement.tsx', code);
