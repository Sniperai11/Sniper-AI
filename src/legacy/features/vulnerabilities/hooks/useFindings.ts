import { useFindingStore } from '../../../stores/findingStore';
import { useUIStore } from '../../../stores/uiStore';

export const useFindings = () => {
  const rawVulns = useFindingStore((state) => state.vulnerabilities);
  const vulnerabilities = Array.isArray(rawVulns) ? rawVulns : [];
  const actionLoading = useUIStore((state) => state.actionLoading);
  const performSelfHealing = useFindingStore((state) => state.performSelfHealing);

  const criticalCount = vulnerabilities.filter(
    (v) => (v?.severity as string)?.toUpperCase() === 'CRITICAL'
  ).length;
  const highCount = vulnerabilities.filter(
    (v) => (v?.severity as string)?.toUpperCase() === 'HIGH'
  ).length;
  const mediumCount = vulnerabilities.filter(
    (v) => (v?.severity as string)?.toUpperCase() === 'MEDIUM'
  ).length;
  const lowCount = vulnerabilities.filter(
    (v) => (v?.severity as string)?.toUpperCase() === 'LOW'
  ).length;

  return {
    vulnerabilities,
    actionLoading,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    totalCount: vulnerabilities.length,
    performSelfHealing,
  };
};
