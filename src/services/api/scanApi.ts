import { ScanJob, Vulnerability } from '../../types';

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

export const scanApi = {
  getActiveScans: () => apiRequest<ScanJob[]>('/api/scans'),

  startTargetScan: (targetId: string, options?: { scanType: string; customHeaders?: string; customCookies?: string }) =>
    apiRequest<ScanJob>(`/api/targets/${targetId}/scan`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    }),

  getVulnerabilities: () => apiRequest<Vulnerability[]>('/api/vulnerabilities'),

  aiAnalyzeVulnerability: (vulnId: string) =>
    apiRequest<any>(`/api/vulnerabilities/${vulnId}/ai-analyze`, {
      method: 'POST',
    }),

  toggleVulnerabilityFalsePositive: (vulnId: string) =>
    apiRequest<any>(`/api/vulnerabilities/${vulnId}/toggle-false-positive`, {
      method: 'POST',
    }),

  getRemediations: () => apiRequest<any[]>('/api/remediations'),

  performRemediation: (vulnId: string) =>
    apiRequest<any>(`/api/vulnerabilities/${vulnId}/remediate`, {
      method: 'POST',
    }),
};
