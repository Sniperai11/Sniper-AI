import { apiClient } from '../client';
import { IncidentWorkflow } from '../types/workflows';

const defaultAiAnalysis = {
  executiveSummary: 'فحص أمني تلقائي منفذ بواسطة محرك Enterprise Scanner Engine.',
  nextAction: 'مراجعة الثغرات وتطبيق حلول المعالجة.',
  riskPrediction: 'مراقبة مستمرة'
};

export const incidentsService = {
  getIncidents: async (params?: { search?: string; state?: string; severity?: string }): Promise<IncidentWorkflow[]> => {
    const response = await apiClient.get<any>('/scans');
    const list = Array.isArray(response) ? response : (response?.data || []);
    let incidents: IncidentWorkflow[] = list.map((item: any) => ({
      id: item.id,
      title: item.targetName ? `فحص أمني: ${item.targetName}` : 'مهمة فحص أمني',
      state: item.status === 'Completed' ? 'Closed' : 'Investigating',
      severity: 'High',
      description: `جلسة فحص أمني نشطة للهدف: ${item.targetName || item.targetId}`,
      owner: 'فريق الأمان السيبراني',
      linkedAssets: [item.targetName || 'الهدف المحدد'],
      linkedVulnerabilities: [],
      mitreAttack: ['T1190', 'T1059'],
      playbook: 'PB-Automated-Audit',
      aiAnalysis: defaultAiAnalysis,
      createdAt: item.startedAt || new Date().toISOString(),
      updatedAt: item.completedAt || new Date().toISOString()
    }));
    
    if (params?.search) {
      const q = params.search.toLowerCase();
      incidents = incidents.filter((i) => i.title?.toLowerCase().includes(q) || i.id?.toLowerCase().includes(q));
    }
    if (params?.state) {
      incidents = incidents.filter((i) => i.state === params.state);
    }
    if (params?.severity) {
      incidents = incidents.filter((i) => i.severity === params.severity);
    }
    
    return incidents;
  },
  
  getIncidentById: async (id: string): Promise<IncidentWorkflow> => {
    const response = await apiClient.get<any>(`/scans/${id}`);
    const item = response.data || response;
    return {
      id: item.id || id,
      title: item.targetName ? `فحص أمني: ${item.targetName}` : 'مهمة فحص أمني',
      state: item.status === 'Completed' ? 'Closed' : 'Investigating',
      severity: 'High',
      description: `جلسة فحص أمني للهدف: ${item.targetName || item.targetId}`,
      owner: 'فريق الأمان السيبراني',
      linkedAssets: [item.targetName || 'الهدف المحدد'],
      linkedVulnerabilities: [],
      mitreAttack: ['T1190', 'T1059'],
      playbook: 'PB-Automated-Audit',
      aiAnalysis: defaultAiAnalysis,
      createdAt: item.startedAt || new Date().toISOString(),
      updatedAt: item.completedAt || new Date().toISOString()
    };
  },
  
  updateIncidentState: async (id: string, state: IncidentWorkflow['state'], _reason?: string): Promise<IncidentWorkflow> => {
    await apiClient.post(`/scans/${id}/stop`, {});
    return {
      id,
      title: 'مهمة فحص أمني',
      state: 'Closed',
      severity: 'High',
      description: 'تم إيقاف جلسة الفحص بناءً على الطلب',
      owner: 'فريق الأمان',
      linkedAssets: [],
      linkedVulnerabilities: [],
      mitreAttack: ['T1190'],
      playbook: 'PB-Automated-Audit',
      aiAnalysis: defaultAiAnalysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  updateIncidentOwner: async (_id: string, _owner: string): Promise<IncidentWorkflow> => {
    throw new Error('تحديث مسؤول الجلسة غير مدعوم حالياً في الخادم');
  },
  
  updateIncident: async (_id: string, _updates: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    throw new Error('تعديل بيانات الحادثة غير مدعوم حالياً في الخادم');
  },
  
  createIncident: async (_data: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    throw new Error('إنشاء الحوادث يدوي غير مدعوم؛ يجب بدء فحص أمني جديد عبر شاشة الفحص');
  }
};

