import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scanApi } from '../../services/api/scanApi';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => scanApi.getNotifications(),
    refetchInterval: 30000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scanApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
