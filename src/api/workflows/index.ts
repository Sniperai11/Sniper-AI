import { VulnerabilityWorkflow, IncidentWorkflow, AuditLog } from '../types/workflows';
import { vulnerabilitiesService } from '../services/vulnerabilities';
import { apiClient } from '../client';

export const workflowsApi = {
  getVulnerabilities: async (): Promise<VulnerabilityWorkflow[]> => {
    return await vulnerabilitiesService.getVulnerabilities();
  },
  
  updateVulnerabilityState: async (id: string, state: string, reason?: string): Promise<void> => {
    await vulnerabilitiesService.updateVulnerabilityState(id, state as any, reason);
  },

  getIncidents: async (): Promise<IncidentWorkflow[]> => {
    try {
      const res = await apiClient.get<any>('/scans');
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map((item: any) => ({
        id: item.id,
        title: item.targetName || 'Security Audit Mission',
        state: item.status === 'Completed' ? 'Closed' : 'Investigating',
        severity: 'High',
        description: `Active security scan mission on target: ${item.targetName || item.targetId}`,
        owner: 'SecOps Team',
        linkedAssets: [item.targetName || 'Target Asset'],
        linkedVulnerabilities: [],
        mitreAttack: ['T1190', 'T1059'],
        playbook: 'PB-Automated-Audit',
        aiAnalysis: {
          executiveSummary: 'Automated vulnerability scan executed by Enterprise Scanner Engine.',
          nextAction: 'Review vulnerability findings and apply remediation recommendations.',
          riskPrediction: 'Monitored continuously.'
        },
        createdAt: item.startedAt || new Date().toISOString(),
        updatedAt: item.completedAt || new Date().toISOString()
      }));
    } catch {
      return [];
    }
  },

  updateIncidentState: async (id: string, state: string): Promise<void> => {
    await apiClient.post(`/scans`, { id, status: state });
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    return await vulnerabilitiesService.getAuditLogs(entityId);
  }
};

