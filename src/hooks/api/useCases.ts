import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesService } from '../../api/services/cases';
import { CaseWorkflow, CaseStatus } from '../../api/types/workflows';

export const useCases = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => casesService.getCases(params),
  });
};

export const useCase = (id: string) => {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => casesService.getCaseById(id),
    enabled: !!id,
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CaseWorkflow>) => casesService.createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
};

export const useUpdateCaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CaseStatus }) =>
      casesService.updateCaseStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['cases'] });
      await queryClient.cancelQueries({ queryKey: ['case', id] });

      const previousCases = queryClient.getQueryData<CaseWorkflow[]>(['cases']);
      const previousSingle = queryClient.getQueryData<CaseWorkflow>(['case', id]);

      if (previousCases) {
        queryClient.setQueriesData<CaseWorkflow[]>({ queryKey: ['cases'] }, (old) => {
          if (!old) return [];
          return old.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<CaseWorkflow>(['case', id], {
          ...previousSingle,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousCases, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCases) {
        queryClient.setQueriesData({ queryKey: ['cases'] }, context.previousCases);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['case', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['case', id] });
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<CaseWorkflow>) =>
      casesService.updateCase(id, updates),
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ['cases'] });
      await queryClient.cancelQueries({ queryKey: ['case', id] });

      const previousCases = queryClient.getQueryData<CaseWorkflow[]>(['cases']);
      const previousSingle = queryClient.getQueryData<CaseWorkflow>(['case', id]);

      if (previousCases) {
        queryClient.setQueriesData<CaseWorkflow[]>({ queryKey: ['cases'] }, (old) => {
          if (!old) return [];
          return old.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<CaseWorkflow>(['case', id], {
          ...previousSingle,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousCases, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCases) {
        queryClient.setQueriesData({ queryKey: ['cases'] }, context.previousCases);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['case', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['case', id] });
    },
  });
};
