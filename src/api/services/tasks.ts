import { apiClient } from '../client';
import { TaskWorkflow } from '../types/workflows';

export const tasksService = {
  getTasks: async (params?: { search?: string; status?: string }): Promise<TaskWorkflow[]> => {
    const response = await apiClient.get<any>('/remediations');
    const list = Array.isArray(response) ? response : (response?.data || []);
    let tasks: TaskWorkflow[] = list.map((item: any) => ({
      id: item.id || `TSK-REM`,
      title: item.actionPlan || item.title || 'مهمة معالجة أمنية',
      status: item.status === 'Completed' ? 'Done' : 'In Progress',
      assignee: 'مطور الأنظمة',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));
    
    if (params?.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter((t) => t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q));
    }
    if (params?.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }
    return tasks;
  },
  
  getTaskById: async (id: string): Promise<TaskWorkflow> => {
    const tasks = await tasksService.getTasks();
    const matched = tasks.find(t => t.id === id);
    if (!matched) {
      throw new Error('المهمة غير موجودة');
    }
    return matched;
  },
  
  createTask: async (_data: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    throw new Error('إنشاء مهام المعالجة يتم تلقائياً عند طلب معالجة ثغرة أمنية');
  },
  
  updateTaskStatus: async (_id: string, _status: TaskWorkflow['status']): Promise<TaskWorkflow> => {
    throw new Error('تغيير حالة المهمة غير مدعوم مباشرة في الخادم');
  },
  
  updateTask: async (_id: string, _updates: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    throw new Error('تحديث تفاصيل المهمة غير مدعوم في الخادم');
  }
};

