import { httpClient } from './client';
import { AuditLog } from '../../types';

export const usersApi = {
  getProfile: async () => {
    const res = await httpClient.get('/user/profile');
    return res.data?.data || res.data;
  },

  login: async (email: string, password?: string, mode?: string) => {
    const res = await httpClient.post('/auth/login', { email, password, mode });
    return res.data?.data || res.data;
  },

  register: async (name: string, email: string, companyName?: string, password?: string, mode?: string, role?: string) => {
    const res = await httpClient.post('/auth/register', { name, email, companyName, password, mode, role });
    return res.data?.data || res.data;
  },

  logout: async () => {
    const res = await httpClient.post('/auth/logout');
    return res.data?.data || res.data;
  },

  switchUser: async (userId: string) => {
    const res = await httpClient.post('/user/switch', { userId });
    return res.data?.data || res.data;
  },

  updateTeamRole: async (memberId: string, role: string) => {
    const res = await httpClient.post('/team/role', { memberId, role });
    return res.data?.data || res.data;
  },

  addTeamMember: async (name: string, email: string, role: string) => {
    const res = await httpClient.post('/team/add', { name, email, role });
    return res.data?.data || res.data;
  },

  deleteTeamMember: async (memberId: string) => {
    const res = await httpClient.delete(`/team/${memberId}`);
    return res.data?.data || res.data;
  },

  upgradeSubscription: async (planName: string) => {
    const res = await httpClient.post('/subscription/upgrade', { planName });
    return res.data?.data || res.data;
  },

  getAuditLogs: async () => {
    const res = await httpClient.get('/audit-logs');
    return res.data?.data || res.data || [];
  },

  clearAuditLogs: async () => {
    const res = await httpClient.post('/audit-logs/clear');
    return res.data?.data || res.data;
  },
};
