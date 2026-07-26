import { apiClient } from '../client';
import { AssetWorkflow } from '../types/workflows';

export const assetsService = {
  getAssets: async (params?: { search?: string; category?: string; risk?: string }): Promise<AssetWorkflow[]> => {
    const response = await apiClient.get<any>('/projects');
    const projects = Array.isArray(response) ? response : (response?.data || []);
    
    const extractedAssets: AssetWorkflow[] = [];
    if (Array.isArray(projects)) {
      projects.forEach((proj: any) => {
        if (Array.isArray(proj.targets)) {
          proj.targets.forEach((t: any) => {
            extractedAssets.push({
              id: t.id,
              name: t.name || t.url || 'Target Asset',
              type: t.type || 'Web App',
              category: t.category || 'Infrastructure',
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
    if (!matched) {
      throw new Error('الهدف الأمني غير موجود');
    }
    return matched;
  },
  
  createAsset: async (_data: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    throw new Error('إضافة الأصول تتطلب تحديد معرف المشروع الرئيسي');
  },
  
  updateAsset: async (_id: string, _updates: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    throw new Error('تعديل الأصول غير مدعوم حالياً في الخادم الرئيسي');
  },
  
  deleteAsset: async (_id: string): Promise<void> => {
    throw new Error('حذف الأصول غير مدعوم حالياً في الخادم الرئيسي');
  }
};

