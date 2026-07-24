import { useState, useCallback } from 'react';
import { useSecurityStore } from '../../../store/useSecurityStore';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

export const useAuth = () => {
  const { userProfile, fetchAllData, logout: storeLogout, addToast } = useSecurityStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      await fetchAllData();
      addToast('تم تسجيل الدخول بنجاح وتوثيق الجلسة الأمنية', 'success');
      return res;
    } catch (err: any) {
      const msg = err.message || 'فشلت عملية تسجيل الدخول. يرجى التحقق من بيانات الدخول.';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllData, addToast]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      await fetchAllData();
      addToast('تم إنشاء الحساب بنجاح وتوثيق الجلسة', 'success');
      return res;
    } catch (err: any) {
      const msg = err.message || 'فشلت عملية إنشاء الحساب.';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllData, addToast]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      await storeLogout();
      addToast('تم تسجيل الخروج بنجاح', 'info');
    } catch (err: any) {
      await storeLogout();
    } finally {
      setLoading(false);
    }
  }, [storeLogout, addToast]);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(email);
      addToast('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني', 'success');
      return res;
    } catch (err: any) {
      const msg = err.message || 'فشل إرسال طلب إعادة التعيين';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const resetPassword = useCallback(async (token: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.resetPassword(token, password);
      addToast('تمت إعادة تعيين كلمة المرور بنجاح', 'success');
      return res;
    } catch (err: any) {
      const msg = err.message || 'فشلت إعادة تعيين كلمة المرور';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return {
    userProfile,
    isAuthenticated: !!userProfile,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
};
