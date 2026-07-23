import { SaaSSubscription, AuditLog } from '../../types';

// Centralized helper for API requests
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const usersApi = {
  getProfile: () => apiRequest<any>('/api/user/profile'),

  login: (email: string, password?: string, mode?: string) =>
    apiRequest<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, mode }),
    }),

  register: (name: string, email: string, companyName?: string, password?: string, mode?: string, role?: string) =>
    apiRequest<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, companyName, password, mode, role }),
    }),

  logout: () =>
    apiRequest<any>('/api/auth/logout', {
      method: 'POST',
    }),
  
  switchUser: (userId: string) => 
    apiRequest<any>('/api/user/switch', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  updateTeamRole: (memberId: string, role: string) =>
    apiRequest<any>('/api/team/role', {
      method: 'POST',
      body: JSON.stringify({ memberId, role }),
    }),

  addTeamMember: (name: string, email: string, role: string) =>
    apiRequest<any>('/api/team/add', {
      method: 'POST',
      body: JSON.stringify({ name, email, role }),
    }),

  deleteTeamMember: (memberId: string) =>
    apiRequest<any>(`/api/team/${memberId}`, {
      method: 'DELETE',
    }),

  upgradeSubscription: (planName: string) =>
    apiRequest<any>('/api/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planName }),
    }),

  getAuditLogs: () => apiRequest<AuditLog[]>('/api/audit-logs'),

  clearAuditLogs: () =>
    apiRequest<any>('/api/audit-logs/clear', {
      method: 'POST',
    }),
};
