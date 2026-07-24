import { apiClient } from '../client';
import { CaseWorkflow, CaseStatus } from '../types/workflows';

let mockCases: CaseWorkflow[] = [
  {
    id: 'CASE-2024-001',
    title: 'Data Exfiltration Investigation',
    status: 'In Progress',
    leadAnalyst: 'Sarah Jenkins',
    description: 'Investigating potential data exfiltration from customer database server.',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'CASE-2024-002',
    title: 'Compliance Audit: Q3 PCI-DSS',
    status: 'Planning',
    leadAnalyst: "Mike O'Connor",
    description: 'Quarterly PCI-DSS compliance verification and assessment.',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'CASE-2024-003',
    title: 'Insider Threat Red Team Simulation',
    status: 'Under Review',
    leadAnalyst: 'Alex Thorne',
    description: 'Post-simulation review of malicious insider detection capabilities.',
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export const casesService = {
  getCases: async (params?: { search?: string; status?: string }): Promise<CaseWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/cases', { params });
      return Array.isArray(response) ? response : (response.data || mockCases);
    } catch {
      let filtered = [...mockCases];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.leadAnalyst.toLowerCase().includes(q));
      }
      if (params?.status) {
        filtered = filtered.filter(c => c.status === params.status);
      }
      return filtered;
    }
  },

  getCaseById: async (id: string): Promise<CaseWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/cases/${id}`);
      return response.data || response;
    } catch {
      const found = mockCases.find(c => c.id === id);
      if (!found) throw new Error(`Case ${id} not found`);
      return found;
    }
  },

  createCase: async (data: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    try {
      const response = await apiClient.post<any>('/cases', data);
      return response.data || response;
    } catch {
      const newCase: CaseWorkflow = {
        id: `CASE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: data.title || 'New Security Investigation',
        status: data.status || 'Planning',
        leadAnalyst: data.leadAnalyst || 'Admin User',
        description: data.description || '',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      mockCases.unshift(newCase);
      return newCase;
    }
  },

  updateCaseStatus: async (id: string, status: CaseStatus): Promise<CaseWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/cases/${id}/status`, { status });
      return response.data || response;
    } catch {
      const index = mockCases.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCases[index] = {
          ...mockCases[index],
          status,
          updatedAt: new Date().toISOString()
        };
        return mockCases[index];
      }
      throw new Error(`Case ${id} not found`);
    }
  },

  updateCase: async (id: string, updates: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/cases/${id}`, updates);
      return response.data || response;
    } catch {
      const index = mockCases.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCases[index] = { ...mockCases[index], ...updates, updatedAt: new Date().toISOString() };
        return mockCases[index];
      }
      throw new Error(`Case ${id} not found`);
    }
  }
};
