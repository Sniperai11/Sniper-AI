import { create } from 'zustand';
import { AuditLog } from '../types';
import { usersApi } from '../services/api/usersApi';
import { useUIStore } from './uiStore';

export interface AuditState {
  auditLogs: AuditLog[];
  setAuditLogs: (logs: AuditLog[]) => void;
  clearAuditLogs: () => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  auditLogs: [],
  setAuditLogs: (logs) => set({ auditLogs: Array.isArray(logs) ? logs : [] }),

  clearAuditLogs: async () => {
    const { addToast } = useUIStore.getState();
    try {
      await usersApi.clearAuditLogs();
      addToast('تم تصفير سجلات التدقيق بنجاح.', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل تصفير السجلات', 'error');
    }
  }
}));
