const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

code = code.replace("import { useSecurityStore } from '../store/useSecurityStore';", "import { useProfile } from '../hooks/api/useProfile';");

code = code.replace("  const { userProfile, companyProfile } = useSecurityStore();", `  const { data: profile } = useProfile();
  const userProfile = profile?.user || {};
  const companyProfile = profile?.company || { name: 'شركة قناص الأمن السيبراني' };`);

fs.writeFileSync('src/pages/Settings.tsx', code);
