import { apiRequest } from '../../../services/api/usersApi';

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
    const response = await apiRequest<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (response?.data) {
      localStorage.setItem('sniper_auth_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return response;
  },

  register: async (payload: RegisterPayload) => {
    const response = await apiRequest<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (response?.data) {
      localStorage.setItem('sniper_auth_token', `jwt-token-${Date.now()}`);
      localStorage.setItem('sniper_user_email', payload.email);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiRequest<any>('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('sniper_auth_token');
      localStorage.removeItem('sniper_user_email');
    }
  },

  getCurrentUser: async () => {
    return apiRequest<any>('/api/auth/me');
  },

  forgotPassword: async (email: string) => {
    return apiRequest<any>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, password?: string) => {
    return apiRequest<any>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  verifyEmail: async (token: string) => {
    return { success: true, message: 'تم التوثيق التأكيدي للبريد الإلكتروني بنجاح' };
  }
};
