import { useSecurityStore } from '../store/useSecurityStore';

export const useProjects = () => {
  const rawProjects = useSecurityStore((state) => state.projects);
  const projects = Array.isArray(rawProjects) ? rawProjects : [];
  const rawActiveScans = useSecurityStore((state) => state.activeScans);
  const activeScans = Array.isArray(rawActiveScans) ? rawActiveScans : [];
  const actionLoading = useSecurityStore((state) => state.actionLoading);
  const createProject = useSecurityStore((state) => state.createProject);
  const addTargetToProject = useSecurityStore((state) => state.addTargetToProject);
  const triggerScan = useSecurityStore((state) => state.triggerScan);

  const totalTargetsCount = projects.reduce((acc, p) => acc + (Array.isArray(p?.targets) ? p.targets.length : 0), 0);

  return {
    projects,
    activeScans,
    actionLoading,
    totalTargetsCount,
    createProject,
    addTargetToProject,
    triggerScan,
  };
};
