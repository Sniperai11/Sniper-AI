import { ReportHistoryItem, SecurityReport } from '../../types';

export interface ReportSlice {
  reportsHistory: ReportHistoryItem[];
  activeReport: SecurityReport | null;
  setReportsHistory: (reports: ReportHistoryItem[]) => void;
  setActiveReport: (report: SecurityReport | null) => void;
}
