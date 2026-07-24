import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsService } from '../../api/services/assets';
import { AssetWorkflow } from '../../api/types/workflows';

export const useAssets = (params?: { search?: string; category?: string; risk?: string }) => {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => assetsService.getAssets(params),
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetsService.getAssetById(id),
    enabled: !!id,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetWorkflow>) => assetsService.createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<AssetWorkflow>) =>
      assetsService.updateAsset(id, updates),
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      await queryClient.cancelQueries({ queryKey: ['asset', id] });

      const previousAssets = queryClient.getQueryData<AssetWorkflow[]>(['assets']);
      const previousSingle = queryClient.getQueryData<AssetWorkflow>(['asset', id]);

      if (previousAssets) {
        queryClient.setQueriesData<AssetWorkflow[]>({ queryKey: ['assets'] }, (old) => {
          if (!old) return [];
          return old.map((a) => (a.id === id ? { ...a, ...updates } : a));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<AssetWorkflow>(['asset', id], {
          ...previousSingle,
          ...updates,
        });
      }

      return { previousAssets, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousAssets) {
        queryClient.setQueriesData({ queryKey: ['assets'] }, context.previousAssets);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['asset', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', id] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assetsService.deleteAsset(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      const previousAssets = queryClient.getQueryData<AssetWorkflow[]>(['assets']);

      if (previousAssets) {
        queryClient.setQueriesData<AssetWorkflow[]>({ queryKey: ['assets'] }, (old) => {
          if (!old) return [];
          return old.filter((a) => a.id !== id);
        });
      }

      return { previousAssets };
    },
    onError: (_err, _id, context) => {
      if (context?.previousAssets) {
        queryClient.setQueriesData({ queryKey: ['assets'] }, context.previousAssets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};
