import { useProjectStore } from '../../../stores/projectStore';
import { useFindingStore } from '../../../stores/findingStore';
import { useScanStore } from '../../../stores/scanStore';
import { useAuthStore } from '../../../stores/authStore';

export const useDashboard = () => {
  const userProfile = useAuthStore((state) => state.userProfile);
  const projects = useProjectStore((state) => state.projects);
  const vulnerabilities = useFindingStore((state) => state.vulnerabilities);
  const activeScans = useScanStore((state) => state.activeScans);

  const totalProjects = (projects || []).length;
  const totalVulns = (vulnerabilities || []).length;
  const criticalVulns = (vulnerabilities || []).filter(
    (v) => String(v?.severity).toUpperCase() === 'CRITICAL'
  ).length;
  const activeScansCount = (activeScans || []).filter(
    (s) => String(s?.status).toUpperCase() === 'RUNNING'
  ).length;

  return {
    userProfile,
    projects,
    vulnerabilities,
    activeScans,
    stats: {
      totalProjects,
      totalVulns,
      criticalVulns,
      activeScansCount,
    },
  };
};
