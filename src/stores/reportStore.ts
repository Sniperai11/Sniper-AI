import { create } from 'zustand';
import { ReportHistoryItem, SecurityReport } from '../types';
import { reportApi } from '../services/api/reportApi';
import { useUIStore } from './uiStore';

export interface ReportState {
  reportsHistory: ReportHistoryItem[];
  activeReport: SecurityReport | null;
  setReportsHistory: (reports: ReportHistoryItem[]) => void;
  setActiveReport: (report: SecurityReport | null) => void;
  generateReport: (projectId: string, logo?: string, prefix?: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reportsHistory: [],
  activeReport: null,

  setReportsHistory: (reports) => set({ reportsHistory: Array.isArray(reports) ? reports : [] }),
  setActiveReport: (report) => set({ activeReport: report }),

  generateReport: async (projectId, logo, prefix) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('generating_report');
    try {
      const report = await reportApi.createReport(projectId, logo, prefix);
      set({ activeReport: report });
      addToast('تم توليد التقرير الأمني المعتمد للشركة بنجاح!', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل توليد التقرير الأمني', 'error');
    } finally {
      setActionLoading(null);
    }
  },
}));
