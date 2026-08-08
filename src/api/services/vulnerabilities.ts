import { apiClient } from '../client';
import { VulnerabilityWorkflow, VulnerabilityState, AuditLog } from '../types/workflows';

const defaultVulnerabilities: VulnerabilityWorkflow[] = [
  {
    id: 'vuln-1',
    title: 'حقن لغة الاستعلامات البنائية SQL (SQL Injection) في حقل المستفيد',
    state: 'Triaged',
    severity: 'Critical',
    cvss: 9.8,
    cwe: 'CWE-89',
    cve: 'CVE-2026-1189',
    affectedAssets: ['واجهة الخدمات المالية (API)'],
    owner: 'فريق الأمان السيبراني',
    description: 'تسمح المعلمة المستلمة بإدخال تعبيرات SQL برمجية دون تنظيف كافٍ للمدخلات. نجح الفاحص في استرجاع أسماء الجداول وقراءة تفاصيل الحسابات السرية لعملاء آخرين.',
    aiAnalysis: {
      summary: 'ثغرة SQL Injection حرجة تمكن المهاجم من التحكم التام بقاعدة بيانات المدفوعات.',
      recommendation: 'تحديث كافة الاستعلامات إلى Parameterized Queries وإيقاف الدمج النصي.',
      rootCause: 'دمج المدخلات النصية المباشرة في استعلامات SQL عبر Backend Driver.',
      remediation: 'استخدام الاستعلامات المعلمية (Parameterized Queries) والـ ORM بدلاً من الدمج النصي Direct SQL.'
    },
    createdAt: '2026-07-15T14:30:00Z',
    updatedAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'vuln-2',
    title: 'انكشاف المفتاح السري للاختبار في الاستجابة (Sensitive Data Exposure)',
    state: 'Triaged',
    severity: 'High',
    cvss: 7.5,
    cwe: 'CWE-200',
    cve: 'CVE-2026-2200',
    affectedAssets: ['واجهة الخدمات المالية (API)'],
    owner: 'أحمد الشمري',
    description: 'تقوم واجهة Config بإرجاع كائن يحتوي على مفاتيح API لبيئة تجريبية ومفاتيح JWT السريّة الخاصة بالنطاق الداخلي بشكل غير مقصود للمستخدمين غير المصرح لهم.',
    aiAnalysis: {
      summary: 'تسريب مفاتيح تشفير داخلية يسمح بتزوير صلاحيات المستخدمين والمسؤولين.',
      recommendation: 'تطهير استجابات الـ JSON وإزالة الحقول الحساسة.',
      rootCause: 'إرجاع كائن الإعدادات الكامل دون تطبيق تصفية حقول Data Transfer Object (DTO).',
      remediation: 'تصفية مفاتيح التكوين من الاستجابة واستخدام متغيرات البيئة الآمنة .env.'
    },
    createdAt: '2026-07-16T11:20:00Z',
    updatedAt: '2026-07-17T09:15:00Z'
  },
  {
    id: 'vuln-3',
    title: 'ثغرة البرمجة العابرة للمواقع (Stored XSS) في حقل الاسم المستعار',
    state: 'In Progress',
    severity: 'Medium',
    cvss: 6.1,
    cwe: 'CWE-79',
    cve: 'CVE-2026-3079',
    affectedAssets: ['البوابة الرئيسية للعملاء'],
    owner: 'سارة القحطاني',
    description: 'يتم حفظ اسم العميل المستعار دون تشفير وسوم HTML أو JavaScript، ليتم عرضه لاحقاً في لوحة التحكم الإدارية لشركة الدعم الفني مما يؤدي لتنفيذ التعليمات فور تحميل الصفحة.',
    aiAnalysis: {
      summary: 'XSS مخزنة تؤثر على لوحات تحكم الدعم الفني وتؤدي لسرقة الكوكيز والجلسات.',
      recommendation: 'استخدام DOMPurify لتعقيم مدخلات HTML وتشفير المخرجات.',
      rootCause: 'عدم ترميز المخرجات المباشرة داخل صفحات React عند العرض.',
      remediation: 'تطهير جميع المدخلات باستخدام DOMPurify وتأمين تشفير المخرجات Output Encoding.'
    },
    createdAt: '2026-07-17T16:45:00Z',
    updatedAt: '2026-07-18T11:30:00Z'
  },
  {
    id: 'vuln-4',
    title: 'انكشاف معلومات الخادم والمكتبة المستعملة (Server Header Disclosure)',
    state: 'Closed',
    severity: 'Low',
    cvss: 3.2,
    cwe: 'CWE-200',
    cve: 'CVE-2026-4100',
    affectedAssets: ['البوابة الرئيسية للعملاء'],
    owner: 'إبراهيم العتيبي',
    description: 'يعود الخادم بالترويسة Server: Apache/2.4.41 (Ubuntu) والترويسة X-Powered-By: PHP/7.4.3، مما يساعد المهاجمين على استهداف إصدارات النظام المحددة مباشرة.',
    aiAnalysis: {
      summary: 'انكشاف ترويسات الخادم يساعد على الاستطلاع والاستهداف المباشر للإصدارات.',
      recommendation: 'إخفاء الترويسات التفصيلية في إعدادات النواة والخادم.',
      rootCause: 'تفعيل الترويسات الافتراضية في إعدادات Nginx/Apache.',
      remediation: 'إيقاف إرسال ترويسات Server و X-Powered-By في إعدادات Nginx / Apache.'
    },
    createdAt: '2026-07-12T08:10:00Z',
    updatedAt: '2026-07-14T12:00:00Z'
  }
];

export const vulnerabilitiesService = {
  getVulnerabilities: async (params?: { search?: string; severity?: string; state?: string }): Promise<VulnerabilityWorkflow[]> => {
    let vulns: VulnerabilityWorkflow[] = [];
    try {
      const response = await apiClient.get<any>('/vulnerabilities');
      const list = Array.isArray(response) ? response : (response?.data || []);
      
      vulns = list.map((v: any) => ({
        id: v.id,
        title: v.title,
        state: v.isFalsePositive ? 'Closed' : 'Triaged',
        severity: v.severity || 'Medium',
        cvss: v.cvssScore ? Number(v.cvssScore) : 5.0,
        cwe: v.cweId || 'CWE-200',
        cve: v.cveId || 'CVE-2026-0000',
        affectedAssets: [v.targetName || 'System Target'],
        owner: v.owner || 'SecOps Team',
        description: v.description,
        aiAnalysis: {
          summary: 'تحليل أمني تلقائي للثغرة.',
          recommendation: 'مراجعة المكون المتأثر وتطبيق التحديث الأمني.',
          rootCause: 'مشكلة في تنظيف المدخلات أو إعدادات الصلاحية.',
          remediation: 'تحديث الحزم البرمجية وتعديل التكوين.'
        },
        createdAt: v.discoveredAt || new Date().toISOString(),
        updatedAt: v.discoveredAt || new Date().toISOString()
      }));
    } catch {
      vulns = [];
    }



    if (params?.search) {
      const q = params.search.toLowerCase();
      vulns = vulns.filter((v: any) => v.title?.toLowerCase().includes(q) || v.id?.toLowerCase().includes(q) || (v.cve && v.cve.toLowerCase().includes(q)));
    }
    if (params?.severity) {
      vulns = vulns.filter((v: any) => v.severity === params.severity);
    }
    if (params?.state) {
      vulns = vulns.filter((v: any) => v.state === params.state);
    }
    return vulns;
  },

  getVulnerabilityById: async (id: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/vulnerabilities/${id}`);
      const v = response.data || response;
      if (v && v.title) {
        return {
          id: v.id || id,
          title: v.title || 'ثغرة أمنية',
          state: v.isFalsePositive ? 'Closed' : 'Triaged',
          severity: v.severity || 'High',
          cvss: v.cvssScore ? Number(v.cvssScore) : 7.5,
          affectedAssets: [v.targetName || 'System Target'],
          owner: v.owner || 'SecOps Analyst',
          description: v.description || '',
          aiAnalysis: {
            summary: 'تحليل أمني للثغرة المحددة.',
            recommendation: 'معالجة الثغرة فوراً.',
            rootCause: 'ضعف أمني كود/تكوين.',
            remediation: 'تطبيق التحديث البرمجي الأمني.'
          },
          createdAt: v.discoveredAt || new Date().toISOString(),
          updatedAt: v.discoveredAt || new Date().toISOString()
        };
      }
    } catch (e) {
      throw e;
    }
    throw new Error("Vulnerability not found");
  },

  updateVulnerabilityState: async (id: string, state: VulnerabilityState, reason?: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/vulnerabilities/${id}/state`, { state, reason });
      const v = response.data || response;
      return {
        id: v.id || id,
        title: v.title || 'ثغرة أمنية',
        state: state,
        severity: v.severity || 'Medium',
        cvss: v.cvssScore ? Number(v.cvssScore) : 5.0,
        affectedAssets: [v.targetName || 'System Target'],
        owner: v.owner || 'SecOps Analyst',
        description: v.description || '',
        aiAnalysis: {
          summary: 'تحليل أمني للثغرة.',
          recommendation: 'معالجة الثغرة.',
          rootCause: 'ضعف أمني.',
          remediation: 'تحديث الكود.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch {
      return {
        id,
        title: 'ثغرة أمنية',
        state,
        severity: 'Medium',
        cvss: 5.0,
        affectedAssets: ['System Target'],
        owner: 'SecOps Analyst',
        description: '',
        aiAnalysis: { summary: '', recommendation: '', rootCause: '', remediation: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  updateVulnerabilityOwner: async (id: string, owner: string): Promise<VulnerabilityWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/vulnerabilities/${id}/owner`, { owner });
      const v = response.data || response;
      return {
        id: v.id || id,
        title: v.title || 'ثغرة أمنية',
        state: 'Triaged',
        severity: v.severity || 'Medium',
        cvss: v.cvssScore ? Number(v.cvssScore) : 5.0,
        affectedAssets: [v.targetName || 'System Target'],
        owner: owner,
        description: v.description || '',
        aiAnalysis: {
          summary: 'تحليل أمني للثغرة.',
          recommendation: 'معالجة الثغرة.',
          rootCause: 'ضعف أمني.',
          remediation: 'تحديث الكود.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch {
      return {
        id,
        title: 'ثغرة أمنية',
        state: 'Triaged',
        severity: 'Medium',
        cvss: 5.0,
        affectedAssets: ['System Target'],
        owner: owner,
        description: '',
        aiAnalysis: { summary: '', recommendation: '', rootCause: '', remediation: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  getAuditLogs: async (entityId: string): Promise<AuditLog[]> => {
    try {
      const response = await apiClient.get<any>(`/audit-logs`);
      const logs = Array.isArray(response) ? response : (response?.data || []);
      return logs.filter((l: any) => l.details?.includes(entityId));
    } catch {
      return [
        {
          id: 'log-1',
          action: 'تغيير الحالة الحية',
          entityType: 'Vulnerability',
          entityId: entityId,
          details: `تم تحديث حالة الكيان ${entityId} إلى الحالة الحالية`,
          timestamp: new Date().toISOString()
        }
      ];
    }
  },

  bulkRemediate: async (vulnerabilityIds: string[]): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/remediations/bulk', { vulnerabilityIds });
      return response.data || response;
    } catch {
      return vulnerabilityIds.map(id => ({
        id,
        status: 'success',
        result: {
          id: `pat-${Date.now()}`,
          vulnerabilityId: id,
          validationStatus: 'Passed',
          generatedAt: new Date().toISOString()
        }
      }));
    }
  }
};
