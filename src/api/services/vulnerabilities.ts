import { apiClient } from '../client';
import { VulnerabilityWorkflow, VulnerabilityState, AuditLog } from '../types/workflows';
import { ApiResponse } from '../types';

let mockVulnerabilities: VulnerabilityWorkflow[] = [
  {
    id: 'VULN-9021',
    title: 'Unauthenticated RCE in Edge Gateway',
    state: 'Triaged',
    severity: 'Critical',
    cvss: 9.8,
    epss: 0.85,
    cwe: 'CWE-287',
    cve: 'CVE-2023-4432',
    affectedAssets: ['gateway.prod.corp'],
    owner: 'security-team',
    description: 'Improper authentication validation allows remote code execution.',
    aiAnalysis: {
      summary: 'Critical bypass in gateway auth module.',
      recommendation: 'Apply emergency patch KB-8832 immediately.',
      rootCause: 'Missing token verification on legacy /v1/auth endpoint.',
      remediation: 'Update edge-proxy to v2.4.1.'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'VULN-9022',
    title: 'SQL Injection in User Profile Service',
    state: 'Assigned',
    severity: 'High',
    cvss: 8.5,
    cwe: 'CWE-89',
    affectedAssets: ['profile-db.prod.corp', 'api.prod.corp'],
    owner: 'backend-team',
    description: 'Unsanitized input in user profile update query.',
    aiAnalysis: {
      summary: 'Standard SQLi in legacy profile update flow.',
      recommendation: 'Migrate to Prisma ORM parameterized queries.',
      rootCause: 'String concatenation in raw SQL query.',
      remediation: 'Use prepared statements or Prisma.'
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    userId: 'admin@corp.com',
    timestamp: new Date().toISOString(),
    action: 'STATE_CHANGED',
    entityType: 'VULNERABILITY',
    entityId: 'VULN-9021',
    previousValue: 'Discovered',
    newValue: 'Triaged',
    reason: 'Confirmed exploitability'
  }
];

export const vulnerabilitiesService = {
  getVulnerabilities: async (params?: { search?: string; severity?: string; state?: string }): Promise<VulnerabilityWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/vulnerabilities', { params });
      return Array.isArray(response) ? response : (response.data || mockVulnerabilities);
    } catch {
      let filtered = [...mockVulnerabilities];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(v => v.title.toLowerCase().includes(q) || v.id.toLowerCase().includes(q) || (v.cve && v.cve.toLowerCase().includes(q)));
      }
      if (params?.severity) {
        filtered = filtered.filter(v => v.severity === params.severity);
      }
      if (params?.state) {
        filtered = filtered.filter(v => v.state === params.state);
      }
      return filtered;
    }
  },

  getVulnerabilityById: async (id: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/vulnerabilities/${id}`);
      return response.data || response;
    } catch {
      const found = mockVulnerabilities.find(v => v.id === id);
      if (!found) throw new Error(`Vulnerability ${id} not found`);
      return found;
    }
  },

  updateVulnerabilityState: async (id: string, state: VulnerabilityState, reason?: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/vulnerabilities/${id}/state`, { state, reason });
      return response.data || response;
    } catch {
      const index = mockVulnerabilities.findIndex(v => v.id === id);
      if (index !== -1) {
        const previousState = mockVulnerabilities[index].state;
        mockVulnerabilities[index] = {
          ...mockVulnerabilities[index],
          state,
          updatedAt: new Date().toISOString()
        };
        mockAuditLogs.unshift({
          id: `AUD-${Date.now()}`,
          userId: 'admin@corp.com',
          timestamp: new Date().toISOString(),
          action: 'STATE_CHANGED',
          entityType: 'VULNERABILITY',
          entityId: id,
          previousValue: previousState,
          newValue: state,
          reason: reason || 'State updated via workflow'
        });
        return mockVulnerabilities[index];
      }
      throw new Error(`Vulnerability ${id} not found`);
    }
  },

  updateVulnerabilityOwner: async (id: string, owner: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/vulnerabilities/${id}/owner`, { owner });
      return response.data || response;
    } catch {
      const index = mockVulnerabilities.findIndex(v => v.id === id);
      if (index !== -1) {
        const previousOwner = mockVulnerabilities[index].owner;
        mockVulnerabilities[index] = {
          ...mockVulnerabilities[index],
          owner,
          updatedAt: new Date().toISOString()
        };
        mockAuditLogs.unshift({
          id: `AUD-${Date.now()}`,
          userId: 'admin@corp.com',
          timestamp: new Date().toISOString(),
          action: 'OWNER_ASSIGNED',
          entityType: 'VULNERABILITY',
          entityId: id,
          previousValue: previousOwner || 'Unassigned',
          newValue: owner,
          reason: 'Owner reassigned'
        });
        return mockVulnerabilities[index];
      }
      throw new Error(`Vulnerability ${id} not found`);
    }
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    try {
      const response = await apiClient.get<any>(`/audit-logs`, { params: { entityId } });
      return Array.isArray(response) ? response : (response.data || mockAuditLogs.filter(a => a.entityId === entityId));
    } catch {
      return mockAuditLogs.filter(a => a.entityId === entityId);
    }
  }
};
