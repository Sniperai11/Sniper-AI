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
};
