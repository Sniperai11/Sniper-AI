import { useProjectStore } from '../../../stores/projectStore';
import { useScanStore } from '../../../stores/scanStore';
import { useUIStore } from '../../../stores/uiStore';

export const useProjects = () => {
  const rawProjects = useProjectStore((state) => state.projects);
  const projects = Array.isArray(rawProjects) ? rawProjects : [];
  const rawActiveScans = useScanStore((state) => state.activeScans);
  const activeScans = Array.isArray(rawActiveScans) ? rawActiveScans : [];
  const actionLoading = useUIStore((state) => state.actionLoading);
  const createProject = useProjectStore((state) => state.createProject);
  const addTargetToProject = useProjectStore((state) => state.addTargetToProject);
  const triggerScan = useScanStore((state) => state.triggerScan);

  const totalTargetsCount = projects.reduce(
    (acc, p) => acc + (Array.isArray(p?.targets) ? p.targets.length : 0),
    0
  );

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
