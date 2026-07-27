import { apiClient } from '../client';
import { CaseWorkflow } from '../types/workflows';

const defaultCases: CaseWorkflow[] = [
  {
    id: 'CASE-BB-2026-101',
    title: 'تخطي التحقق الثنائي عبر التلاعب بالـ Parameter في الجلسة',
    status: 'Closed',
    leadAnalyst: 'أحمد الشمري (ZeroDay_Hunter)',
    description: 'تم رصد تخطي للتحقق الثنائي عن طريق تغيير المعلمة "step" في استجابة الجلسة من "otp" إلى "dashboard_main" قبل وصولها للمتصفح.',
    createdAt: '2026-07-10T14:22:00Z',
    updatedAt: '2026-07-12T09:15:00Z'
  },
  {
    id: 'CASE-BB-2026-102',
    title: 'قراءة ملفات النظام الداخلية عبر ثغرة XML External Entity (XXE)',
    status: 'In Progress',
    leadAnalyst: 'سارة المالكي (Security_Princess)',
    description: 'واجهة الـ XML المدمجة لا تقوم بإيقاف الكيانات الخارجية، مما يمكن المهاجم من تضمين قراءة ملفات داخلية كـ /etc/passwd.',
    createdAt: '2026-07-16T11:05:00Z',
    updatedAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'CASE-BB-2026-103',
    title: 'استخراج صلاحيات الجلسات عبر Insecure Direct Object Reference (IDOR)',
    status: 'Under Review',
    leadAnalyst: 'فيصل الحربي (Faisal_X)',
    description: 'تسمح معلمة user_id بتبديل المعرفات والوصول إلى الفواتير وبيانات بطاقات الائتمان الخاصة بمستخدمين آخرين دون تحقق الصلاحية.',
    createdAt: '2026-07-17T08:30:00Z',
    updatedAt: '2026-07-18T12:00:00Z'
  }
];

export const casesService = {
  getCases: async (params?: { search?: string; status?: string }): Promise<CaseWorkflow[]> => {
    let cases: CaseWorkflow[] = [];
    try {
      const response: any = await apiClient.get('/bugbounty/data');
      const list = Array.isArray(response?.data?.submissions)
        ? response.data.submissions
        : Array.isArray(response?.submissions)
        ? response.submissions
        : [];
      cases = list.map((sub: any) => ({
        id: sub.id,
        title: sub.title || 'تقرير المكافآت الأمني',
        status: sub.status === 'Approved' || sub.status === 'Rewarded' ? 'Closed' : sub.status === 'Rejected' ? 'Closed' : 'In Progress',
        leadAnalyst: sub.submittedBy || sub.researcher || 'خبير أمني',
        description: sub.description || 'بلاغ ثغرة أمنية مقدم عبر منصة Bug Bounty',
        createdAt: sub.submittedAt || sub.createdAt || new Date().toISOString(),
        updatedAt: sub.updatedAt || new Date().toISOString()
      }));
    } catch {
      cases = [];
    }



    if (params?.search) {
      const q = params.search.toLowerCase();
      cases = cases.filter((c) => c.title?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q) || c.leadAnalyst?.toLowerCase().includes(q));
    }
    if (params?.status) {
      cases = cases.filter((c) => c.status === params.status);
    }
    return cases;
  },
  
  getCaseById: async (id: string): Promise<CaseWorkflow> => {
    const cases = await casesService.getCases();
    const matched = cases.find(c => c.id === id);
    return matched;
  },
  
  createCase: async (data: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    try {
      const response: any = await apiClient.post('/bugbounty/submit', {
        title: data.title,
        description: data.description
      });
      const created = response?.data || response;
      if (created && created.title) {
        return {
          id: created.id || `CASE-${Date.now()}`,
          title: created.title || data.title || 'حالة أمنية جديدة',
          status: 'In Progress',
          leadAnalyst: 'SecOps Analyst',
          description: created.description || data.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    } catch (e) {
      throw e;
    }
    throw new Error('Failed to create case');
  },
  
  updateCaseStatus: async (id: string, status: CaseWorkflow['status']): Promise<CaseWorkflow> => {
    const cases = await casesService.getCases();
    const matched = cases.find(c => c.id === id);
    return { ...matched, status, updatedAt: new Date().toISOString() };
  },
  
  updateCase: async (id: string, updates: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    const cases = await casesService.getCases();
    const matched = cases.find(c => c.id === id);
    return { ...matched, ...updates, updatedAt: new Date().toISOString() };
  }
};
