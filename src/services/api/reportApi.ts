import { SecurityReport } from '../../types';

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
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

export const reportApi = {
  createReport: (projectId: string, companyLogo?: string | null, titlePrefix?: string) =>
    apiRequest<SecurityReport>(`/api/projects/${projectId}/report?logo=${encodeURIComponent(companyLogo || '')}&prefix=${encodeURIComponent(titlePrefix || '')}`),

  getReportsHistory: () => apiRequest<any[]>('/api/reports/history'),

  getBountyData: () => apiRequest<any>('/api/bugbounty/data'),

  submitBountyReport: (payload: any) =>
    apiRequest<any>('/api/bugbounty/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  reviewBountyReport: (submissionId: string, status: string, points: number, reward: number) =>
    apiRequest<any>(`/api/bugbounty/submissions/${submissionId}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, points, reward }),
    }),

  aiGenerateBountyDraft: (payload: any) =>
    apiRequest<any>('/api/bugbounty/generate-report', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
export const chatApi = {
  sendMessageToAdvisor: (message: string, history: any[]) =>
    apiRequest<any>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
