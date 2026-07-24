import { create } from 'zustand';
import { Vulnerability } from '../types';
import { scanApi } from '../services/api/scanApi';
import { useUIStore } from './uiStore';

export interface FindingState {
  vulnerabilities: Vulnerability[];
  setVulnerabilities: (vulnerabilities: Vulnerability[]) => void;
  performSelfHealing: (vulnId: string) => Promise<void>;
}

export const useFindingStore = create<FindingState>((set, get) => ({
  vulnerabilities: [],
  setVulnerabilities: (vulnerabilities) => set({ vulnerabilities: Array.isArray(vulnerabilities) ? vulnerabilities : [] }),

  performSelfHealing: async (vulnId) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading(`healing-${vulnId}`);
    try {
      await scanApi.performRemediation(vulnId);
      addToast('تم تطبيق الشفاء الذاتي والأمان التلقائي وتصحيح الكود المصدر بنجاح!', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشلت عملية الترميم التلقائي', 'error');
    } finally {
      setActionLoading(null);
    }
  },
}));
