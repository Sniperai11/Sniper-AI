import { VulnerabilityWorkflow, IncidentWorkflow, AuditLog } from '../types/workflows';

// Mocking the API calls to avoid backend dependency for now
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowsApi = {
  getVulnerabilities: async (): Promise<VulnerabilityWorkflow[]> => {
    await delay(500);
    return [
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
  },
  
  updateVulnerabilityState: async (id: string, state: string, reason?: string): Promise<void> => {
    await delay(300);
    console.log(`Updated vulnerability ${id} to ${state} with reason: ${reason}`);
  },

  getIncidents: async (): Promise<IncidentWorkflow[]> => {
    await delay(500);
    return [
      {
        id: 'INC-2024-081',
        title: 'Multiple Failed Logins & Suspicious IP',
        state: 'Investigating',
        severity: 'High',
        description: 'Detected brute force attempts followed by successful login from an unknown ASN.',
        owner: 'SOC-L2',
        linkedAssets: ['vpn.corp.local'],
        linkedVulnerabilities: [],
        mitreAttack: ['T1110', 'T1078'],
        playbook: 'PB-Compromised-Credential',
        aiAnalysis: {
          executiveSummary: 'Potential credential compromise of an employee account via brute force, originating from a suspicious IP.',
          nextAction: 'Isolate user session and force MFA reset.',
          riskPrediction: 'High likelihood of lateral movement if not contained within 1 hour.'
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  },

  updateIncidentState: async (id: string, state: string): Promise<void> => {
    await delay(300);
    console.log(`Updated incident ${id} to ${state}`);
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    await delay(300);
    return [
      {
        id: 'AUD-001',
        userId: 'admin@corp.com',
        timestamp: new Date().toISOString(),
        action: 'STATE_CHANGED',
        entityType: 'VULNERABILITY',
        entityId,
        previousValue: 'Discovered',
        newValue: 'Triaged',
        reason: 'Confirmed exploitability'
      }
    ];
  }
};
