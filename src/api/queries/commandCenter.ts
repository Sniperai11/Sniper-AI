import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { 
  getSystemStats, 
  getRiskTrend, 
  getAssetDistribution, 
  getRecentAlerts 
} from '../services/commandCenter';

export const useSystemStats = () => {
  return useQuery({
    queryKey: queryKeys.commandCenter.systemStats(),
    queryFn: getSystemStats,
  });
};

export const useRiskTrend = () => {
  return useQuery({
    queryKey: queryKeys.commandCenter.riskTrend(),
    queryFn: getRiskTrend,
  });
};

export const useAssetDistribution = () => {
  return useQuery({
    queryKey: queryKeys.commandCenter.assetDistribution(),
    queryFn: getAssetDistribution,
  });
};

export const useRecentAlerts = () => {
  return useQuery({
    queryKey: queryKeys.commandCenter.recentAlerts(),
    queryFn: getRecentAlerts,
  });
};
