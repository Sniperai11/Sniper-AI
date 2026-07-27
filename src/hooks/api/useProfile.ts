import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const response: any = await apiClient.get('/user/profile');
        return response?.data || response;
      } catch (e) {
        return null;
      }
    },
  });
};
