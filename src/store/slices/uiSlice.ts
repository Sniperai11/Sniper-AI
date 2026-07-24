export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface UiSlice {
  activeTab: string;
  twoFactorEnabled: boolean;
  twoFactorType: 'app' | 'sms';
  twoFactorPhone: string;
  isLoading: boolean;
  actionLoading: string | null;
  toasts: ToastItem[];

  setActiveTab: (tab: string) => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setActionLoading: (action: string | null) => void;
}
