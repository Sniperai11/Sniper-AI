import { apiClient } from '../client';
import { AssetWorkflow } from '../types/workflows';

let mockAssets: AssetWorkflow[] = [
  { id: 'AST-1042', name: 'api.production.corp', type: 'API Gateway', category: 'Infrastructure', risk: 'Medium', tags: ['PCI-DSS', 'External'], owner: 'Platform Team', lastSeen: '2 hours ago', ipAddress: '192.168.1.10', environment: 'Production' },
  { id: 'AST-1043', name: 'auth.internal.corp', type: 'Identity Provider', category: 'Security', risk: 'High', tags: ['Core', 'Internal'], owner: 'SecOps', lastSeen: '10 mins ago', ipAddress: '10.0.0.5', environment: 'Production' },
  { id: 'AST-1044', name: 'customer-db-primary', type: 'Database', category: 'Data Storage', risk: 'Critical', tags: ['PII', 'Production'], owner: 'DBA Team', lastSeen: 'Just now', ipAddress: '10.0.2.14', environment: 'Production' },
  { id: 'AST-1045', name: 'payment-processor-svc', type: 'Microservice', category: 'Application', risk: 'Low', tags: ['PCI-DSS', 'Internal'], owner: 'Payments Team', lastSeen: '1 hour ago', ipAddress: '10.0.1.88', environment: 'Production' },
  { id: 'AST-1046', name: 'cdn-assets.corp', type: 'CDN', category: 'Infrastructure', risk: 'Low', tags: ['External', 'Static'], owner: 'Web Team', lastSeen: '5 hours ago', ipAddress: '151.101.1.69', environment: 'Production' },
  { id: 'AST-1047', name: 'vpn-gateway-eu', type: 'VPN Gateway', category: 'Network', risk: 'Medium', tags: ['External', 'Remote Access'], owner: 'NetOps', lastSeen: '1 day ago', ipAddress: '185.220.101.4', environment: 'Production' },
  { id: 'AST-1048', name: 'legacy-admin-panel', type: 'Web App', category: 'Application', risk: 'Critical', tags: ['Deprecated', 'Internal'], owner: 'Unknown', lastSeen: '2 weeks ago', ipAddress: '10.0.9.12', environment: 'Staging' }
];

export const assetsService = {
  getAssets: async (params?: { search?: string; category?: string; risk?: string }): Promise<AssetWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/projects');
      const projects = Array.isArray(response) ? response : (response?.data || []);
      const extractedAssets: AssetWorkflow[] = [];

      if (Array.isArray(projects)) {
        projects.forEach((proj: any) => {
          if (Array.isArray(proj.targets)) {
            proj.targets.forEach((t: any) => {
              extractedAssets.push({
                id: t.id || `AST-${t.name}`,
                name: t.name || t.url || 'Target Asset',
                type: t.type || 'Web App',
                category: t.category || 'Infrastructure',
                risk: t.risk || 'Medium',
                tags: t.tags || ['Verified', 'Project Scope'],
                owner: proj.name || 'SecOps Team',
                lastSeen: 'Just now',
                ipAddress: t.ipAddress || '10.0.0.1',
                environment: 'Production'
              });
            });
          }
        });
      }

      let allAssets = extractedAssets.length > 0 ? [...extractedAssets, ...mockAssets] : mockAssets;
      if (params?.search) {
        const q = params.search.toLowerCase();
        allAssets = allAssets.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
      }
      if (params?.category) {
        allAssets = allAssets.filter(a => a.category === params.category);
      }
      if (params?.risk) {
        allAssets = allAssets.filter(a => a.risk === params.risk);
      }
      return allAssets;
    } catch {
      let filtered = [...mockAssets];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
      }
      if (params?.category) {
        filtered = filtered.filter(a => a.category === params.category);
      }
      if (params?.risk) {
        filtered = filtered.filter(a => a.risk === params.risk);
      }
      return filtered;
    }
  },

  getAssetById: async (id: string): Promise<AssetWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/assets/${id}`);
      return response.data || response;
    } catch {
      const found = mockAssets.find(a => a.id === id);
      if (!found) throw new Error(`Asset ${id} not found`);
      return found;
    }
  },

  createAsset: async (data: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    try {
      const response = await apiClient.post<any>('/assets', data);
      return response.data || response;
    } catch {
      const newAsset: AssetWorkflow = {
        id: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name || 'new-asset.corp',
        type: data.type || 'Server',
        category: data.category || 'Infrastructure',
        risk: data.risk || 'Low',
        tags: data.tags || ['Uncategorized'],
        owner: data.owner || 'SecOps',
        lastSeen: 'Just now',
        ipAddress: data.ipAddress || '10.0.0.1',
        environment: data.environment || 'Production'
      };
      mockAssets.unshift(newAsset);
      return newAsset;
    }
  },

  updateAsset: async (id: string, updates: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/assets/${id}`, updates);
      return response.data || response;
    } catch {
      const index = mockAssets.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssets[index] = { ...mockAssets[index], ...updates };
        return mockAssets[index];
      }
      throw new Error(`Asset ${id} not found`);
    }
  },

  deleteAsset: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/assets/${id}`);
    } catch {
      mockAssets = mockAssets.filter(a => a.id !== id);
    }
  }
};
