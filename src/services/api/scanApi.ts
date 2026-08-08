import { httpClient } from './client';
import { ScanJob, Vulnerability } from '../../types';

export const scanApi = {
  getActiveScans: async () => {
    const res = await httpClient.get('/scans');
    return res.data?.data || res.data || [];
  },

  startTargetScan: async (targetId: string, options?: { scanType: string; customHeaders?: string; customCookies?: string }) => {
    const res = await httpClient.post(`/targets/${targetId}/scan`, options || {});
    return res.data?.data || res.data;
  },

  getVulnerabilities: async () => {
    const res = await httpClient.get('/vulnerabilities');
    return res.data?.data || res.data || [];
  },

  aiAnalyzeVulnerability: async (vulnId: string) => {
    const res = await httpClient.post(`/vulnerabilities/${vulnId}/ai-analyze`);
    return res.data?.data || res.data;
  },

  toggleVulnerabilityFalsePositive: async (vulnId: string) => {
    const res = await httpClient.post(`/vulnerabilities/${vulnId}/toggle-false-positive`);
    return res.data?.data || res.data;
  },

  getRemediations: async () => {
    const res = await httpClient.get('/remediations');
    return res.data?.data || res.data || [];
  },

  performRemediation: async (vulnId: string) => {
    const res = await httpClient.post(`/vulnerabilities/${vulnId}/remediate`);
    return res.data?.data || res.data;
  },

  getScanProfiles: async () => {
    const res = await httpClient.get('/scans/profiles');
    return res.data?.data || res.data || [];
  },

  getAssets: async (projectId?: string) => {
    const res = await httpClient.get('/assets', { params: { projectId } });
    return res.data?.data || res.data || [];
  },

  createAsset: async (assetData: { name: string; type?: string; projectId?: string }) => {
    const res = await httpClient.post('/assets', assetData);
    return res.data?.data || res.data;
  },

  getNotifications: async () => {
    const res = await httpClient.get('/notifications');
    return res.data?.data || res.data || [];
  },

  markNotificationRead: async (id: string) => {
    const res = await httpClient.post(`/notifications/${id}/read`);
    return res.data?.data || res.data;
  },

  getAIConsultations: async () => {
    const res = await httpClient.get('/ai-consultations');
    return res.data?.data || res.data || [];
  },
};
