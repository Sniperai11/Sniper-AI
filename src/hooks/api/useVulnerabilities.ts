import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vulnerabilitiesService } from '../../api/services/vulnerabilities';
import { VulnerabilityWorkflow, VulnerabilityState, AuditLog } from '../../api/types/workflows';

export const useVulnerabilities = (params?: { search?: string; severity?: string; state?: string }) => {
  return useQuery({
    queryKey: ['vulnerabilities', params],
    queryFn: () => vulnerabilitiesService.getVulnerabilities(params),
  });
};

export const useVulnerability = (id: string) => {
  return useQuery({
    queryKey: ['vulnerability', id],
    queryFn: () => vulnerabilitiesService.getVulnerabilityById(id),
    enabled: !!id,
  });
};

export const useUpdateVulnerabilityState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, state, reason }: { id: string; state: VulnerabilityState; reason?: string }) =>
      vulnerabilitiesService.updateVulnerabilityState(id, state, reason),
    onMutate: async ({ id, state }) => {
      await queryClient.cancelQueries({ queryKey: ['vulnerabilities'] });
      await queryClient.cancelQueries({ queryKey: ['vulnerability', id] });

      const previousVulnerabilities = queryClient.getQueryData<VulnerabilityWorkflow[]>(['vulnerabilities']);
      const previousSingle = queryClient.getQueryData<VulnerabilityWorkflow>(['vulnerability', id]);

      if (previousVulnerabilities) {
        queryClient.setQueriesData<VulnerabilityWorkflow[]>({ queryKey: ['vulnerabilities'] }, (old) => {
          if (!old) return [];
          return old.map((v) => (v.id === id ? { ...v, state, updatedAt: new Date().toISOString() } : v));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<VulnerabilityWorkflow>(['vulnerability', id], {
          ...previousSingle,
          state,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousVulnerabilities, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousVulnerabilities) {
        queryClient.setQueriesData({ queryKey: ['vulnerabilities'] }, context.previousVulnerabilities);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['vulnerability', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
      queryClient.invalidateQueries({ queryKey: ['vulnerability', id] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs', id] });
    },
  });
};

export const useUpdateVulnerabilityOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, owner }: { id: string; owner: string }) =>
      vulnerabilitiesService.updateVulnerabilityOwner(id, owner),
    onMutate: async ({ id, owner }) => {
      await queryClient.cancelQueries({ queryKey: ['vulnerabilities'] });
      await queryClient.cancelQueries({ queryKey: ['vulnerability', id] });

      const previousVulnerabilities = queryClient.getQueryData<VulnerabilityWorkflow[]>(['vulnerabilities']);
      const previousSingle = queryClient.getQueryData<VulnerabilityWorkflow>(['vulnerability', id]);

      if (previousVulnerabilities) {
        queryClient.setQueriesData<VulnerabilityWorkflow[]>({ queryKey: ['vulnerabilities'] }, (old) => {
          if (!old) return [];
          return old.map((v) => (v.id === id ? { ...v, owner, updatedAt: new Date().toISOString() } : v));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<VulnerabilityWorkflow>(['vulnerability', id], {
          ...previousSingle,
          owner,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousVulnerabilities, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousVulnerabilities) {
        queryClient.setQueriesData({ queryKey: ['vulnerabilities'] }, context.previousVulnerabilities);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['vulnerability', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
      queryClient.invalidateQueries({ queryKey: ['vulnerability', id] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs', id] });
    },
  });
};

export const useAuditLogs = (entityId: string) => {
  return useQuery({
    queryKey: ['audit-logs', entityId],
    queryFn: () => vulnerabilitiesService.getAuditLogs(entityId),
    enabled: !!entityId,
  });
};
