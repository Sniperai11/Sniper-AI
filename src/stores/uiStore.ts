import { create } from 'zustand';
import { UserMode } from '../types';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface UIState {
  activeTab: string;
  userMode: UserMode;
  isLoading: boolean;
  actionLoading: string | null;
  toasts: ToastItem[];

  setActiveTab: (tab: string) => void;
  setUserMode: (mode: UserMode) => void;
  setIsLoading: (loading: boolean) => void;
  setActionLoading: (action: string | null) => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeTab: 'dashboard',
  userMode: 'company',
  isLoading: false,
  actionLoading: null,
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setUserMode: (mode) => set({ userMode: mode }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActionLoading: (action) => set({ actionLoading: action }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({ toasts: [...(Array.isArray(state.toasts) ? state.toasts : []), { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: (Array.isArray(state.toasts) ? state.toasts : []).filter((t) => t.id !== id) }));
  },
}));
