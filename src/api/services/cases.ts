import { apiClient } from '../client';
import { CaseWorkflow } from '../types/workflows';

export const casesService = {
  getCases: async (params?: { search?: string; status?: string }): Promise<CaseWorkflow[]> => {
    const response: any = await apiClient.get('/bugbounty/data');
    const list = Array.isArray(response?.data?.submissions)
      ? response.data.submissions
      : Array.isArray(response?.submissions)
      ? response.submissions
      : [];
    let cases: CaseWorkflow[] = list.map((sub: any) => ({
      id: sub.id,
      title: sub.title || 'تقرير المكافآت الأمني',
      status: sub.status === 'Approved' ? 'Closed' : sub.status === 'Rejected' ? 'Closed' : 'In Progress',
      leadAnalyst: sub.researcher || 'خبير أمني',
      description: sub.description || 'بلاغ ثغرة أمنية مقدم عبر منصة Bug Bounty',
      createdAt: sub.createdAt || new Date().toISOString(),
      updatedAt: sub.updatedAt || new Date().toISOString()
    }));

    if (params?.search) {
      const q = params.search.toLowerCase();
      cases = cases.filter((c) => c.title?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q));
    }
    if (params?.status) {
      cases = cases.filter((c) => c.status === params.status);
    }
    return cases;
  },
  
  getCaseById: async (id: string): Promise<CaseWorkflow> => {
    const cases = await casesService.getCases();
    const matched = cases.find(c => c.id === id);
    if (!matched) {
      throw new Error('الحالة غير موجودة');
    }
    return matched;
  },
  
  createCase: async (data: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    const response: any = await apiClient.post('/bugbounty/submit', {
      title: data.title,
      description: data.description
    });
    const created = response?.data || response;
    return {
      id: created.id || `CASE-${Date.now()}`,
      title: created.title || data.title || 'حالة أمنية جديدة',
      status: 'In Progress',
      leadAnalyst: 'SecOps Analyst',
      description: created.description || data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  updateCaseStatus: async (_id: string, _status: CaseWorkflow['status']): Promise<CaseWorkflow> => {
    throw new Error('تحديث حالة البلاغ غير مدعوم مباشرة؛ يرجى المراجعة من لوحة Bug Bounty');
  },
  
  updateCase: async (_id: string, _updates: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    throw new Error('تحديث البلاغ غير مدعوم مباشرة في الخادم');
  }
};

