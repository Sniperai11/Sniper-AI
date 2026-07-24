import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsService } from '../../api/services/incidents';
import { IncidentWorkflow, IncidentState } from '../../api/types/workflows';

export const useIncidents = (params?: { search?: string; severity?: string; state?: string }) => {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => incidentsService.getIncidents(params),
  });
};

export const useIncident = (id: string) => {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => incidentsService.getIncidentById(id),
    enabled: !!id,
  });
};

export const useUpdateIncidentState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: IncidentState }) =>
      incidentsService.updateIncidentState(id, state),
    onMutate: async ({ id, state }) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      await queryClient.cancelQueries({ queryKey: ['incident', id] });

      const previousIncidents = queryClient.getQueryData<IncidentWorkflow[]>(['incidents']);
      const previousSingle = queryClient.getQueryData<IncidentWorkflow>(['incident', id]);

      if (previousIncidents) {
        queryClient.setQueriesData<IncidentWorkflow[]>({ queryKey: ['incidents'] }, (old) => {
          if (!old) return [];
          return old.map((i) => (i.id === id ? { ...i, state, updatedAt: new Date().toISOString() } : i));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<IncidentWorkflow>(['incident', id], {
          ...previousSingle,
          state,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousIncidents, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousIncidents) {
        queryClient.setQueriesData({ queryKey: ['incidents'] }, context.previousIncidents);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['incident', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
    },
  });
};

export const useUpdateIncidentOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, owner }: { id: string; owner: string }) =>
      incidentsService.updateIncidentOwner(id, owner),
    onMutate: async ({ id, owner }) => {
      await queryClient.cancelQueries({ queryKey: ['incidents'] });
      await queryClient.cancelQueries({ queryKey: ['incident', id] });

      const previousIncidents = queryClient.getQueryData<IncidentWorkflow[]>(['incidents']);
      const previousSingle = queryClient.getQueryData<IncidentWorkflow>(['incident', id]);

      if (previousIncidents) {
        queryClient.setQueriesData<IncidentWorkflow[]>({ queryKey: ['incidents'] }, (old) => {
          if (!old) return [];
          return old.map((i) => (i.id === id ? { ...i, owner, updatedAt: new Date().toISOString() } : i));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<IncidentWorkflow>(['incident', id], {
          ...previousSingle,
          owner,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousIncidents, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousIncidents) {
        queryClient.setQueriesData({ queryKey: ['incidents'] }, context.previousIncidents);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['incident', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
    },
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IncidentWorkflow>) => incidentsService.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
