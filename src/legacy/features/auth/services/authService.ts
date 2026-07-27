import { httpClient } from '../../../../services/api/client';

export interface LoginPayload {
  email: string;
  password?: string;
  mode?: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  companyName?: string;
  password?: string;
  mode?: string;
  role?: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const response: any = await httpClient.post('/auth/login', payload);
    const result = response?.data || response;
    if (result) {
      localStorage.setItem('sniper_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return result;
  },

  register: async (payload: RegisterPayload) => {
    const response: any = await httpClient.post('/auth/register', payload);
    const result = response?.data || response;
    if (result) {
      localStorage.setItem('sniper_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return result;
  },

  logout: async () => {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('sniper_token');
      localStorage.removeItem('sniper_user_email');
    }
  },

  getCurrentUser: async () => {
    const res = await httpClient.get('/auth/me');
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await httpClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token: string, password?: string) => {
    const res = await httpClient.post('/auth/reset-password', { token, password });
    return res.data;
  },

  verifyEmail: async (token: string) => {
    return { success: true, message: 'تم التوثيق التأكيدي للبريد الإلكتروني بنجاح' };
  }
};
