import { apiClient } from '../client';
import { IncidentWorkflow, IncidentState } from '../types/workflows';

let mockIncidents: IncidentWorkflow[] = [
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
  },
  {
    id: 'INC-2024-080',
    title: 'Exfiltration Attempt via DNS Tunneling',
    state: 'New',
    severity: 'Critical',
    description: 'Abnormal TXT record queries towards unknown external domain.',
    owner: 'Unassigned',
    linkedAssets: ['api.production.corp'],
    linkedVulnerabilities: ['VULN-9021'],
    mitreAttack: ['T1071.004', 'T1041'],
    playbook: 'PB-Data-Exfiltration',
    aiAnalysis: {
      executiveSummary: 'Suspected command-and-control communication via DNS tunneling.',
      nextAction: 'Block outbound DNS to flag destination IP on perimeter firewall.',
      riskPrediction: 'Critical data loss risk.'
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  }
];

export const incidentsService = {
  getIncidents: async (params?: { search?: string; severity?: string; state?: string }): Promise<IncidentWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/incidents', { params });
      return Array.isArray(response) ? response : (response.data || mockIncidents);
    } catch {
      let filtered = [...mockIncidents];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
      }
      if (params?.severity) {
        filtered = filtered.filter(i => i.severity === params.severity);
      }
      if (params?.state) {
        filtered = filtered.filter(i => i.state === params.state);
      }
      return filtered;
    }
  },

  getIncidentById: async (id: string): Promise<IncidentWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/incidents/${id}`);
      return response.data || response;
    } catch {
      const found = mockIncidents.find(i => i.id === id);
      if (!found) throw new Error(`Incident ${id} not found`);
      return found;
    }
  },

  updateIncidentState: async (id: string, state: IncidentState): Promise<IncidentWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/incidents/${id}/state`, { state });
      return response.data || response;
    } catch {
      const index = mockIncidents.findIndex(i => i.id === id);
      if (index !== -1) {
        mockIncidents[index] = {
          ...mockIncidents[index],
          state,
          updatedAt: new Date().toISOString()
        };
        return mockIncidents[index];
      }
      throw new Error(`Incident ${id} not found`);
    }
  },

  updateIncidentOwner: async (id: string, owner: string): Promise<IncidentWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/incidents/${id}/owner`, { owner });
      return response.data || response;
    } catch {
      const index = mockIncidents.findIndex(i => i.id === id);
      if (index !== -1) {
        mockIncidents[index] = {
          ...mockIncidents[index],
          owner,
          updatedAt: new Date().toISOString()
        };
        return mockIncidents[index];
      }
      throw new Error(`Incident ${id} not found`);
    }
  },

  createIncident: async (data: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    try {
      const response = await apiClient.post<any>('/incidents', data);
      return response.data || response;
    } catch {
      const newIncident: IncidentWorkflow = {
        id: `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: data.title || 'New Security Incident',
        state: data.state || 'New',
        severity: data.severity || 'High',
        description: data.description || '',
        owner: data.owner || 'Unassigned',
        linkedAssets: data.linkedAssets || [],
        linkedVulnerabilities: data.linkedVulnerabilities || [],
        mitreAttack: data.mitreAttack || ['T1078'],
        playbook: data.playbook || 'PB-General-Incident',
        aiAnalysis: data.aiAnalysis || {
          executiveSummary: 'Newly declared incident awaiting initial investigation.',
          nextAction: 'Assign lead incident handler and review asset connections.',
          riskPrediction: 'Risk level depending on scope of affected systems.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockIncidents.unshift(newIncident);
      return newIncident;
    }
  }
};
