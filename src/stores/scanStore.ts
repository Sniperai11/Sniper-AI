import { create } from 'zustand';
import { ActiveScan } from '../types';
import { scanApi } from '../services/api/scanApi';
import { useUIStore } from './uiStore';

export interface ScanState {
  activeScans: ActiveScan[];
  setActiveScans: (scans: ActiveScan[]) => void;
  triggerScan: (targetId: string, scannerType?: string) => Promise<void>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  activeScans: [],
  setActiveScans: (scans) => set({ activeScans: Array.isArray(scans) ? scans : [] }),

  triggerScan: async (targetId, scannerType) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading(`scan-${targetId}`);
    try {
      await scanApi.startTargetScan(targetId, { scanType: scannerType || 'FULL' });
      addToast('تم إطلاق فحص الأمان المتطور وحصل الاتصال بمحركات المسح المباشرة.', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل إطلاق الفحص الأمني', 'error');
    } finally {
      setActionLoading(null);
    }
  },
}));
