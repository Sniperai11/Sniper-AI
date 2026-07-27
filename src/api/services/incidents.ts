import { apiClient } from '../client';
import { IncidentWorkflow } from '../types/workflows';

const defaultAiAnalysis = {
  executiveSummary: 'فحص أمني تلقائي منفذ بواسطة محرك Enterprise Scanner Engine.',
  nextAction: 'مراجعة الثغرات وتطبيق حلول المعالجة السريعة.',
  riskPrediction: 'مراقبة مستمرة واستجابة تلقائية'
};

const defaultIncidents: IncidentWorkflow[] = [
  {
    id: 'INC-2026-089',
    title: 'محاولة استغلال ثغرة SQL Injection على واجهة الماليّة API',
    state: 'Investigating',
    severity: 'Critical',
    description: 'رصد هجوم تلقائي مكثف يهدف لاستغلال ثغرة SQL Injection واستخراج بيانات الجلسات والحسابات.',
    owner: 'أحمد الشمري',
    linkedAssets: ['api.digitaltech.sa/v2/payments'],
    linkedVulnerabilities: ['vuln-1'],
    mitreAttack: ['T1190 - Exploit Public-Facing Application', 'T1059 - Command and Scripting Interpreter'],
    playbook: 'PB-SQLi-Containment',
    aiAnalysis: {
      executiveSummary: 'هجوم نشط باستغلال SQL Injection على مسار المدفوعات الحساس.',
      nextAction: 'تفعيل حاجز الحماية WAF وقفل الـ IP المهاجم فوراً.',
      riskPrediction: 'مخاطر اختراق حرجة عالية'
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INC-2026-084',
    title: 'انكشاف المفتاح التجريبي للنظام في استجابة Config Endpoint',
    state: 'Contained',
    severity: 'High',
    description: 'تسريب مفتاح اختبار حساس في استجابة الـ GET Endpoint مما سمح بدخول صائد الثغرات.',
    owner: 'سارة القحطاني',
    linkedAssets: ['api.digitaltech.sa/v2/payments/config'],
    linkedVulnerabilities: ['vuln-2'],
    mitreAttack: ['T1552 - Unsecured Credentials'],
    playbook: 'PB-Credential-Revocation',
    aiAnalysis: {
      executiveSummary: 'تم إبطال المفتاح المسرب وتغيير الرمز السري للجلسات الداخليّة.',
      nextAction: 'إعادة فحص واجهة الإعدادات للتأكد من خلوها من المفاتيح المسربة.',
      riskPrediction: 'مستقرة وتحت التحكم'
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'INC-2026-071',
    title: 'نشاط استطلاع ومسح بورتات مكثف على سيرفرات الموارد ERP',
    state: 'Resolved',
    severity: 'Medium',
    description: 'تم رصد حركة دخول مشبوهة ومسح منافذ HTTP/HTTPS مكثف من قبل عناوين خارجية.',
    owner: 'إبراهيم العتيبي',
    linkedAssets: ['git@github.com:digitaltech-sa/erp-backend.git'],
    linkedVulnerabilities: [],
    mitreAttack: ['T1595 - Active Scanning'],
    playbook: 'PB-PortScan-Mitigation',
    aiAnalysis: defaultAiAnalysis,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const incidentsService = {
  getIncidents: async (params?: { search?: string; state?: string; severity?: string }): Promise<IncidentWorkflow[]> => {
    let incidents: IncidentWorkflow[] = [];
    try {
      const response = await apiClient.get<any>('/scans');
      const list = Array.isArray(response) ? response : (response?.data || []);
      incidents = list.map((item: any) => ({
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
    } catch {
      incidents = [];
    }



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
    try {
      const response = await apiClient.get<any>(`/scans/${id}`);
      const item = response.data || response;
      if (item && (item.id || item.targetName)) {
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
      }
    } catch (e) {
      throw e;
    }
    throw new Error("Incident not found");
  },
  
  updateIncidentState: async (id: string, state: IncidentWorkflow['state'], _reason?: string): Promise<IncidentWorkflow> => {
    try {
      await apiClient.post(`/scans/${id}/stop`, {});
    } catch {
      // ignore
    }
    throw new Error("Incident not found");
  },
  
  updateIncidentOwner: async (id: string, owner: string): Promise<IncidentWorkflow> => {
    throw new Error("Incident not found");
  },
  
  updateIncident: async (id: string, updates: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    throw new Error("Incident not found");
  },
  
  createIncident: async (data: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    const newInc: IncidentWorkflow = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title || 'حادثة أمنية جديدة',
      state: 'New',
      severity: data.severity || 'High',
      description: data.description || 'تفاصيل الحادثة الأمنية المعروضة في النظام.',
      owner: data.owner || 'SecOps Team',
      linkedAssets: data.linkedAssets || ['النظام الرئيسي'],
      linkedVulnerabilities: [],
      mitreAttack: ['T1190'],
      playbook: 'PB-Incident-Response',
      aiAnalysis: defaultAiAnalysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newInc;
  }
};
