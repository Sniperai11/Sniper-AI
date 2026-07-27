import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      try {
        const response: any = await apiClient.get('/user/profile');
        const data = response?.data || response;
        if (data && Array.isArray(data.teamMembers)) {
          return data.teamMembers;
        }
        return [];
      } catch (e) {
        return [];
      }
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await apiClient.post('/team/add', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    }
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    }
  });
};
