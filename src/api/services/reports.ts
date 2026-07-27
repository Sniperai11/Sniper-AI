import { apiClient } from '../client';

export interface ReportWorkflow {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export const reportsService = {
  getReports: async (): Promise<ReportWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/reports/history');
      const data = response?.data || response;
      if (data && Array.isArray(data)) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name || r.title || 'تقرير أمني',
          type: r.type || 'عام',
          date: r.createdAt || new Date().toISOString(),
          size: r.size || '1.0 ميجابايت'
        }));
      }
      return [];
    } catch {
      return [];
    }
  }
};
