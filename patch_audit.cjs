const fs = require('fs');
let code = fs.readFileSync('src/pages/AuditLogs.tsx', 'utf8');

code = code.replace("import { useSecurityStore } from '../store/useSecurityStore';", "import { useAuditLogs } from '../hooks/api/useAuditLogs';");

code = code.replace("  const { auditLogs } = useSecurityStore();", "  const { data: auditLogs = [], isLoading } = useAuditLogs();");

fs.writeFileSync('src/pages/AuditLogs.tsx', code);
