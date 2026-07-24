import { create } from 'zustand';
import { Project } from '../types';
import { projectsApi } from '../services/api/projectsApi';
import { useUIStore } from './uiStore';

export interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  createProject: (name: string, description: string) => Promise<void>;
  addTargetToProject: (projectId: string, name: string, url: string, type: any, bountyPlatform?: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  setProjects: (projects) => set({ projects: Array.isArray(projects) ? projects : [] }),

  createProject: async (name, description) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('createProject');
    try {
      const created = await projectsApi.createProject(name, description);
      addToast(`تم إنشاء المشروع "${created?.name || name}" بنجاح.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل إنشاء المشروع', 'error');
    } finally {
      setActionLoading(null);
    }
  },

  addTargetToProject: async (projectId, name, url, type, bountyPlatform) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('addTarget');
    try {
      const added = await projectsApi.addTargetToProject(projectId, name, url, type, bountyPlatform);
      addToast(`تم إضافة الهدف "${added?.name || name}" وهو الآن في انتظار تأكيد الملكية.`, 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل إضافة الهدف', 'error');
    } finally {
      setActionLoading(null);
    }
  },
}));
