import { apiClient } from '../client';
import { TaskWorkflow, TaskStatus } from '../types/workflows';

let mockTasks: TaskWorkflow[] = [
  {
    id: 'TSK-101',
    title: 'Patch Node.js on api.production.corp',
    status: 'In Progress',
    assignee: 'John Doe',
    linkedEntity: 'VULN-9021',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'TSK-102',
    title: 'Review False Positives from Weekend Scan',
    status: 'To Do',
    assignee: 'Sarah Jenkins',
    linkedEntity: 'CASE-2024-001',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'TSK-103',
    title: 'Update WAF Rules for Auth Endpoint',
    status: 'Done',
    assignee: 'SecOps Team',
    linkedEntity: 'INC-2024-080',
    dueDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const tasksService = {
  getTasks: async (params?: { search?: string; status?: string; assignee?: string }): Promise<TaskWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/tasks', { params });
      return Array.isArray(response) ? response : (response.data || mockTasks);
    } catch {
      let filtered = [...mockTasks];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || (t.linkedEntity && t.linkedEntity.toLowerCase().includes(q)));
      }
      if (params?.status) {
        filtered = filtered.filter(t => t.status === params.status);
      }
      if (params?.assignee) {
        filtered = filtered.filter(t => t.assignee === params.assignee);
      }
      return filtered;
    }
  },

  getTaskById: async (id: string): Promise<TaskWorkflow> => {
    try {
      const response = await apiClient.get<any>(`/tasks/${id}`);
      return response.data || response;
    } catch {
      const found = mockTasks.find(t => t.id === id);
      if (!found) throw new Error(`Task ${id} not found`);
      return found;
    }
  },

  createTask: async (data: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    try {
      const response = await apiClient.post<any>('/tasks', data);
      return response.data || response;
    } catch {
      const newTask: TaskWorkflow = {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        title: data.title || 'New Security Remediation Task',
        status: data.status || 'To Do',
        assignee: data.assignee || 'Unassigned',
        linkedEntity: data.linkedEntity,
        dueDate: data.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
        createdAt: new Date().toISOString()
      };
      mockTasks.unshift(newTask);
      return newTask;
    }
  },

  updateTaskStatus: async (id: string, status: TaskStatus): Promise<TaskWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/tasks/${id}/status`, { status });
      return response.data || response;
    } catch {
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], status };
        return mockTasks[index];
      }
      throw new Error(`Task ${id} not found`);
    }
  },

  updateTask: async (id: string, updates: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    try {
      const response = await apiClient.patch<any>(`/tasks/${id}`, updates);
      return response.data || response;
    } catch {
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...updates };
        return mockTasks[index];
      }
      throw new Error(`Task ${id} not found`);
    }
  }
};
