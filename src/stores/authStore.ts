import { create } from 'zustand';
import { UserProfile } from '../types';
import { usersApi } from '../services/api/usersApi';
import { useUIStore } from './uiStore';

export interface AuthState {
  userProfile: UserProfile | null;
  twoFactorEnabled: boolean;
  twoFactorType: 'app' | 'sms';
  twoFactorPhone: string;

  setUserProfile: (profile: UserProfile | null) => void;
  login: (email: string, password?: string, mode?: string) => Promise<void>;
  register: (payload: { name: string; email: string; companyName?: string; password?: string; mode?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  upgradeSubscription: (planName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userProfile: null,
  twoFactorEnabled: true,
  twoFactorType: 'app',
  twoFactorPhone: '+966501234567',

  setUserProfile: (profile) => set({ userProfile: profile }),

  login: async (email, password, mode) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('auth_login');
    try {
      await usersApi.login(email, password, mode);
      addToast('تم تسجيل الدخول وتوثيق الجلسة بنجاح!', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشلت عملية تسجيل الدخول', 'error');
      throw err;
    } finally {
      setActionLoading(null);
    }
  },

  register: async ({ name, email, companyName, password, mode, role }) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('auth_register');
    try {
      await usersApi.register(name, email, companyName, password, mode, role);
      addToast('تم إنشاء الحساب وتوثيق الجلسة بنجاح!', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل إنشاء الحساب الجديد', 'error');
      throw err;
    } finally {
      setActionLoading(null);
    }
  },

  logout: async () => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('auth_logout');
    try {
      await usersApi.logout();
      set({ userProfile: null });
      addToast('تم تسجيل الخروج بنجاح.', 'info');
    } catch (err: any) {
      set({ userProfile: null });
      addToast('تم إنهاء الجلسة.', 'info');
    } finally {
      setActionLoading(null);
    }
  },

  upgradeSubscription: async (planName) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('upgradeSubscription');
    try {
      await usersApi.upgradeSubscription(planName);
      addToast(`تم ترقية الاشتراك بنجاح إلى باقة ${planName}!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'فشلت عملية ترقية الاشتراك', 'error');
    } finally {
      setActionLoading(null);
    }
  },
}));
