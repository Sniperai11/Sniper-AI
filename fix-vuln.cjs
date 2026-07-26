const fs = require('fs');
let content = `import { apiClient } from '../client';
import { VulnerabilityWorkflow, VulnerabilityState, AuditLog } from '../types/workflows';
import { ApiResponse } from '../types';

export const vulnerabilitiesService = {
  getVulnerabilities: async (params?: { search?: string; severity?: string; state?: string }): Promise<VulnerabilityWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/vulnerabilities');
      let vulns = Array.isArray(response) ? response : (response?.data || []);
      
      // We map the backend vulnerability format to VulnerabilityWorkflow if necessary
      vulns = vulns.map((v: any) => ({
        id: v.id,
        title: v.title,
        state: v.isFalsePositive ? 'Closed' : 'Triaged',
        severity: v.severity,
        cvss: v.cvssScore ? Number(v.cvssScore) : 0,
        cwe: v.cweId,
        cve: v.cveId,
        affectedAssets: [v.targetName || 'System Target'],
        owner: 'SecOps',
        description: v.description,
        aiAnalysis: null,
        createdAt: v.discoveredAt,
        updatedAt: v.discoveredAt
      }));

      if (params?.search) {
        const q = params.search.toLowerCase();
        vulns = vulns.filter((v: any) => v.title?.toLowerCase().includes(q) || v.id?.toLowerCase().includes(q) || (v.cve && v.cve.toLowerCase().includes(q)));
      }
      if (params?.severity) {
        vulns = vulns.filter((v: any) => v.severity === params.severity);
      }
      if (params?.state) {
        vulns = vulns.filter((v: any) => v.state === params.state);
      }
      return vulns;
    } catch (error) {
      return [];
    }
  },

  getVulnerabilityById: async (id: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.get<any>(\`/vulnerabilities/\${id}\`);
    return response.data || response;
  },

  updateVulnerabilityState: async (id: string, state: VulnerabilityState, reason?: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.post<any>(\`/vulnerabilities/\${id}/toggle-false-positive\`);
    return response.data || response;
  },

  updateVulnerabilityOwner: async (id: string, owner: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.patch<any>(\`/vulnerabilities/\${id}/owner\`, { owner });
    return response.data || response;
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    try {
      const response = await apiClient.get<any>(\`/audit-logs\`);
      const logs = Array.isArray(response) ? response : (response?.data || []);
      return logs.filter((l: any) => l.details?.includes(entityId));
    } catch {
      return [];
    }
  }
};
`;

fs.writeFileSync('src/api/services/vulnerabilities.ts', content, 'utf8');
