import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../../api/services/tasks';
import { TaskWorkflow, TaskStatus } from '../../api/types/workflows';

export const useTasks = (params?: { search?: string; status?: string; assignee?: string }) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksService.getTasks(params),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksService.getTaskById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaskWorkflow>) => tasksService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      const previousTasks = queryClient.getQueryData<TaskWorkflow[]>(['tasks']);
      const previousSingle = queryClient.getQueryData<TaskWorkflow>(['task', id]);

      if (previousTasks) {
        queryClient.setQueriesData<TaskWorkflow[]>({ queryKey: ['tasks'] }, (old) => {
          if (!old) return [];
          return old.map((t) => (t.id === id ? { ...t, status } : t));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<TaskWorkflow>(['task', id], {
          ...previousSingle,
          status,
        });
      }

      return { previousTasks, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['task', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<TaskWorkflow>) =>
      tasksService.updateTask(id, updates),
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      const previousTasks = queryClient.getQueryData<TaskWorkflow[]>(['tasks']);
      const previousSingle = queryClient.getQueryData<TaskWorkflow>(['task', id]);

      if (previousTasks) {
        queryClient.setQueriesData<TaskWorkflow[]>({ queryKey: ['tasks'] }, (old) => {
          if (!old) return [];
          return old.map((t) => (t.id === id ? { ...t, ...updates } : t));
        });
      }

      if (previousSingle) {
        queryClient.setQueryData<TaskWorkflow>(['task', id], {
          ...previousSingle,
          ...updates,
        });
      }

      return { previousTasks, previousSingle };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['task', id], context.previousSingle);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });
};
