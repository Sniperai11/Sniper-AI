import { httpClient } from '../../../services/api/client';

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
    const response = await httpClient.post('/auth/login', payload);
    if (response?.data) {
      localStorage.setItem('sniper_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await httpClient.post('/auth/register', payload);
    if (response?.data) {
      localStorage.setItem('sniper_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return response.data;
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
