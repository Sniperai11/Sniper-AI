import { httpClient } from './client';
import { SecurityReport } from '../../types';

export const reportApi = {
  createReport: async (projectId: string, companyLogo?: string | null, titlePrefix?: string) => {
    const res = await httpClient.get(`/projects/${projectId}/report?logo=${encodeURIComponent(companyLogo || '')}&prefix=${encodeURIComponent(titlePrefix || '')}`);
    return res.data?.data || res.data;
  },

  getReportsHistory: async () => {
    const res = await httpClient.get('/reports/history');
    return res.data?.data || res.data || [];
  },

  getBountyData: async () => {
    const res = await httpClient.get('/bugbounty/data');
    return res.data?.data || res.data;
  },

  submitBountyReport: async (payload: any) => {
    const res = await httpClient.post('/bugbounty/submit', payload);
    return res.data?.data || res.data;
  },

  reviewBountyReport: async (submissionId: string, status: string, points: number, reward: number) => {
    const res = await httpClient.post(`/bugbounty/submissions/${submissionId}/review`, { status, points, reward });
    return res.data?.data || res.data;
  },

  aiGenerateBountyDraft: async (payload: any) => {
    const res = await httpClient.post('/bugbounty/generate-report', payload);
    return res.data;
  },
};

export const chatApi = {
  sendMessageToAdvisor: async (message: string, history: any[]) => {
    const res = await httpClient.post('/chat', { message, history });
    return res.data;
  },
};
