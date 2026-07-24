import { useAuditStore } from '../../../stores/auditStore';

export const useCompliance = () => {
  const auditLogs = useAuditStore((state) => state.auditLogs);
  const clearAuditLogs = useAuditStore((state) => state.clearAuditLogs);

  return {
    auditLogs,
    clearAuditLogs,
  };
};
