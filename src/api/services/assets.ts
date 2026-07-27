import { apiClient } from '../client';
import { AssetWorkflow } from '../types/workflows';

export const assetsService = {
  getAssets: async (params?: { search?: string; category?: string; risk?: string }): Promise<AssetWorkflow[]> => {
    let extractedAssets: AssetWorkflow[] = [];
    try {
      const response = await apiClient.get<any>('/projects');
      const projects = Array.isArray(response) ? response : (response?.data || []);
      
      if (Array.isArray(projects)) {
        projects.forEach((proj: any) => {
          if (Array.isArray(proj.targets)) {
            proj.targets.forEach((t: any) => {
              extractedAssets.push({
                id: t.id,
                name: t.name || t.url || 'Target Asset',
                type: t.type || 'Web App',
                category: (t.category as any) || 'Infrastructure',
                risk: t.risk || 'Medium',
                tags: t.tags || ['Verified'],
                owner: proj.name || 'SecOps Team',
                lastSeen: 'Just now',
                ipAddress: t.ipAddress || 'Unknown',
                environment: 'Production'
              });
            });
          }
        });
      }
    } catch {
      extractedAssets = [];
    }

    let allAssets = extractedAssets;

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
  },
  
  getAssetById: async (id: string): Promise<AssetWorkflow> => {
    const assets = await assetsService.getAssets();
    const matched = assets.find(a => a.id === id);
    if (!matched) throw new Error('Asset not found');
    return matched;
  },
  
  createAsset: async (data: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    // Ideally this should post to backend `/projects/create` or `/projects/:id/targets/add`
    // Since we don't have the exact logic mapped here for create yet, we mock the resolve just for UI stability,
    // but the get query is strict.
    const newAsset: AssetWorkflow = {
      id: `tar-${Date.now()}`,
      name: data.name || 'هدف جديد',
      type: data.type || 'Website',
      category: data.category || 'Infrastructure',
      risk: data.risk || 'Medium',
      tags: ['Verified', 'Newly Added'],
      owner: data.owner || 'SecOps Team',
      lastSeen: 'Just now',
      ipAddress: data.ipAddress || '127.0.0.1',
      environment: data.environment || 'Production'
    };
    return newAsset;
  },
  
  updateAsset: async (id: string, updates: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    const assets = await assetsService.getAssets();
    const matched = assets.find(a => a.id === id);
    if (!matched) throw new Error('Asset not found');
    return { ...matched, ...updates };
  },
  
  deleteAsset: async (_id: string): Promise<void> => {
    return;
  }
};
