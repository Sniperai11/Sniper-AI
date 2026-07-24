import { useReportStore } from '../../../stores/reportStore';
import { useUIStore } from '../../../stores/uiStore';

export const useReports = () => {
  const reportsHistory = useReportStore((state) => state.reportsHistory);
  const activeReport = useReportStore((state) => state.activeReport);
  const actionLoading = useUIStore((state) => state.actionLoading);
  const generateReport = useReportStore((state) => state.generateReport);
  const setActiveReport = useReportStore((state) => state.setActiveReport);

  return {
    reportsHistory,
    activeReport,
    actionLoading,
    generateReport,
    setActiveReport,
  };
};
