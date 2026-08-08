import { apiClient } from '../client';

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  projectId?: string;
  projectName?: string;
  riskScore?: number;
  totalVulnerabilities?: number;
  severityBreakdown?: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  executiveSummary?: string;
  compliancePercentage?: {
    owasp: number;
    iso27001: number;
    pciDss: number;
  };
  vulnerabilities?: any[];
}

export interface ProjectOption {
  id: string;
  name: string;
  description?: string;
}

export const reportsService = {
  getReports: async (): Promise<ReportItem[]> => {
    try {
      const response = await apiClient.get<any>('/reports/history');
      const data = response?.data || response;
      if (data && Array.isArray(data)) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.projectName ? `تقرير أمني - ${r.projectName}` : (r.name || r.title || 'تقرير أمني أسبوعي'),
          type: r.type || (r.riskScore !== undefined ? `مخاطر: ${r.riskScore}%` : 'تقرير شامل'),
          date: r.generatedAt || r.createdAt || new Date().toISOString(),
          size: r.size || '2.4 ميجابايت',
          projectId: r.projectId,
          projectName: r.projectName,
          riskScore: r.riskScore,
          totalVulnerabilities: r.totalVulnerabilities,
          severityBreakdown: r.severityBreakdown,
          executiveSummary: r.executiveSummary,
          compliancePercentage: r.compliancePercentage,
          vulnerabilities: r.vulnerabilities || []
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  generateReport: async (projectId: string = 'proj-1'): Promise<ReportItem> => {
    const response = await apiClient.post<any>('/reports/generate', { projectId });
    const r = response?.data || response;
    return {
      id: r.id || `rep-${Date.now()}`,
      name: r.projectName ? `تقرير أمني - ${r.projectName}` : 'تقرير أمني شامل',
      type: `مخاطر: ${r.riskScore || 0}%`,
      date: r.generatedAt || new Date().toISOString(),
      size: '2.8 ميجابايت',
      projectId: r.projectId,
      projectName: r.projectName,
      riskScore: r.riskScore,
      totalVulnerabilities: r.totalVulnerabilities,
      severityBreakdown: r.severityBreakdown,
      executiveSummary: r.executiveSummary,
      compliancePercentage: r.compliancePercentage,
      vulnerabilities: r.vulnerabilities || []
    };
  },

  getProjects: async (): Promise<ProjectOption[]> => {
    try {
      const response = await apiClient.get<any>('/projects');
      const data = response?.data || response;
      if (data && Array.isArray(data)) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description
        }));
      }
      return [{ id: 'proj-1', name: 'مشروع النطاقات الرئيسية' }];
    } catch {
      return [{ id: 'proj-1', name: 'مشروع النطاقات الرئيسية' }];
    }
  }
};
