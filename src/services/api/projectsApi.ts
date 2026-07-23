import { SecurityProject, SecurityTarget } from '../../types';

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

export const projectsApi = {
  getProjects: () => apiRequest<SecurityProject[]>('/api/projects'),

  createProject: (name: string, description: string) =>
    apiRequest<SecurityProject>('/api/projects/create', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),

  addTargetToProject: (projectId: string, name: string, url: string, type: string, bountyPlatform?: string) =>
    apiRequest<SecurityTarget>(`/api/projects/${projectId}/targets/add`, {
      method: 'POST',
      body: JSON.stringify({ name, url, type, bountyPlatform }),
    }),

  verifyTargetOwnership: (targetId: string, token: string) =>
    apiRequest<any>(`/api/targets/${targetId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  verifyBountyTarget: (targetId: string, proofUrl: string) =>
    apiRequest<any>(`/api/targets/${targetId}/verify-bounty`, {
      method: 'POST',
      body: JSON.stringify({ proofUrl }),
    }),
};
