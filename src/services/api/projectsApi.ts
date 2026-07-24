import { httpClient } from './client';
import { SecurityProject, SecurityTarget } from '../../types';

export const projectsApi = {
  getProjects: async () => {
    const res = await httpClient.get('/projects');
    return res.data?.data || res.data || [];
  },

  createProject: async (name: string, description: string) => {
    const res = await httpClient.post('/projects/create', { name, description });
    return res.data?.data || res.data;
  },

  addTargetToProject: async (projectId: string, name: string, url: string, type: string, bountyPlatform?: string) => {
    const res = await httpClient.post(`/projects/${projectId}/targets/add`, { name, url, type, bountyPlatform });
    return res.data?.data || res.data;
  },

  verifyTargetOwnership: async (targetId: string, token: string) => {
    const res = await httpClient.post(`/targets/${targetId}/verify`, { token });
    return res.data?.data || res.data;
  },

  verifyBountyTarget: async (targetId: string, proofUrl: string) => {
    const res = await httpClient.post(`/targets/${targetId}/verify-bounty`, { proofUrl });
    return res.data?.data || res.data;
  },
};
