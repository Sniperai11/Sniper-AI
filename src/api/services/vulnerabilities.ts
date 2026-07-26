import { apiClient } from '../client';
import { VulnerabilityWorkflow, VulnerabilityState, AuditLog } from '../types/workflows';

export const vulnerabilitiesService = {
  getVulnerabilities: async (params?: { search?: string; severity?: string; state?: string }): Promise<VulnerabilityWorkflow[]> => {
    const response = await apiClient.get<any>('/vulnerabilities');
    let vulns = Array.isArray(response) ? response : (response?.data || []);
    
    vulns = vulns.map((v: any) => ({
      id: v.id,
      title: v.title,
      state: v.isFalsePositive ? 'Closed' : 'Triaged',
      severity: v.severity,
      cvss: v.cvssScore ? Number(v.cvssScore) : 0,
      cwe: v.cweId,
      cve: v.cveId,
      affectedAssets: [v.targetName || 'System Target'],
      owner: v.owner || 'SecOps',
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
  },

  getVulnerabilityById: async (id: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.get<any>(`/vulnerabilities/${id}`);
    const v = response.data || response;
    return {
      id: v.id || id,
      title: v.title || 'ثغرة أمنية',
      state: v.isFalsePositive ? 'Closed' : 'Triaged',
      severity: v.severity || 'High',
      cvss: v.cvssScore ? Number(v.cvssScore) : 7.5,
      affectedAssets: [v.targetName || 'System Target'],
      owner: v.owner || 'SecOps Analyst',
      description: v.description || '',
      aiAnalysis: null,
      createdAt: v.discoveredAt || new Date().toISOString(),
      updatedAt: v.discoveredAt || new Date().toISOString()
    };
  },

  updateVulnerabilityState: async (id: string, state: VulnerabilityState, _reason?: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.post<any>(`/vulnerabilities/${id}/toggle-false-positive`);
    const v = response.data || response;
    return {
      id: v.id || id,
      title: v.title || 'ثغرة أمنية',
      state,
      severity: v.severity || 'High',
      cvss: v.cvssScore ? Number(v.cvssScore) : 7.5,
      affectedAssets: [v.targetName || 'System Target'],
      owner: v.owner || 'SecOps Analyst',
      description: v.description || '',
      aiAnalysis: null,
      createdAt: v.discoveredAt || new Date().toISOString(),
      updatedAt: v.discoveredAt || new Date().toISOString()
    };
  },

  updateVulnerabilityOwner: async (id: string, owner: string): Promise<VulnerabilityWorkflow> => {
    const response = await apiClient.patch<any>(`/vulnerabilities/${id}/owner`, { owner });
    const v = response.data || response;
    return {
      id: v.id || id,
      title: v.title || 'ثغرة أمنية',
      state: v.isFalsePositive ? 'Closed' : 'Triaged',
      severity: v.severity || 'High',
      cvss: v.cvssScore ? Number(v.cvssScore) : 7.5,
      affectedAssets: [v.targetName || 'System Target'],
      owner: owner || v.owner || 'SecOps Analyst',
      description: v.description || '',
      aiAnalysis: null,
      createdAt: v.discoveredAt || new Date().toISOString(),
      updatedAt: v.discoveredAt || new Date().toISOString()
    };
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    const response = await apiClient.get<any>(`/audit-logs`);
    const logs = Array.isArray(response) ? response : (response?.data || []);
    return logs.filter((l: any) => l.details?.includes(entityId));
  }
};

