import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      try {
        const response: any = await apiClient.get('/audit-logs');
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (e) {
        return [];
      }
    },
  });
};
