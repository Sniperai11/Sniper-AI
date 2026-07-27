import { apiClient } from '../client';
import { TaskWorkflow } from '../types/workflows';

const defaultTasks: TaskWorkflow[] = [
  {
    id: 'TSK-REM-101',
    title: 'تطبيق التحقق من الاستعلامات المعلمية (Parameterized Queries) لحظر SQLi',
    status: 'In Progress',
    assignee: 'مطور الأنظمة - أحمد محمود',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    linkedEntity: 'vuln-1',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'TSK-REM-102',
    title: 'تغيير مفاتيح تشفير JWT واستبدال مفاتيح البيئة التجريبية',
    status: 'In Progress',
    assignee: 'مهندس DevOps - سارة خالد',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    linkedEntity: 'vuln-2',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'TSK-REM-103',
    title: 'تفعيل مكتبة DOMPurify لتعقيم مخرجات حقول المستخدم لمنع XSS',
    status: 'To Do',
    assignee: 'مطور الواجهة الأمامية',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    linkedEntity: 'vuln-3',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'TSK-REM-104',
    title: 'تحديث إعدادات Nginx لإخفاء Server Headers في بيئة الإنتاج',
    status: 'Done',
    assignee: 'إبراهيم العتيبي',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    linkedEntity: 'vuln-4',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export const tasksService = {
  getTasks: async (params?: { search?: string; status?: string }): Promise<TaskWorkflow[]> => {
    let tasks: TaskWorkflow[] = [];
    try {
      const response = await apiClient.get<any>('/remediations');
      const list = Array.isArray(response) ? response : (response?.data || []);
      tasks = list.map((item: any) => ({
        id: item.id || `TSK-REM-${Math.floor(100 + Math.random() * 900)}`,
        title: item.actionPlan || item.title || 'مهمة معالجة أمنية',
        status: item.status === 'Completed' ? 'Done' : 'In Progress',
        assignee: 'مطور الأنظمة',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        createdAt: new Date().toISOString()
      }));
    } catch {
      tasks = [];
    }



    if (params?.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter((t) => t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || t.assignee?.toLowerCase().includes(q));
    }
    if (params?.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }
    return tasks;
  },
  
  getTaskById: async (id: string): Promise<TaskWorkflow> => {
    const tasks = await tasksService.getTasks();
    const matched = tasks.find(t => t.id === id);
    if (!matched) throw new Error("Task not found");
    return matched;
  },
  
  createTask: async (data: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    const newTask: TaskWorkflow = {
      id: `TSK-REM-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title || 'مهمة معالجة أمنية جديدة',
      status: data.status || 'To Do',
      assignee: data.assignee || 'Unassigned',
      dueDate: data.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      linkedEntity: data.linkedEntity,
      createdAt: new Date().toISOString()
    };
    return newTask;
  },
  
  updateTaskStatus: async (id: string, status: TaskWorkflow['status']): Promise<TaskWorkflow> => {
    const tasks = await tasksService.getTasks();
    const matched = tasks.find(t => t.id === id);
    if (!matched) throw new Error("Task not found");
    return { ...matched, status };
  },
  
  updateTask: async (id: string, updates: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    const tasks = await tasksService.getTasks();
    const matched = tasks.find(t => t.id === id);
    if (!matched) throw new Error("Task not found");
    return { ...matched, ...updates };
  }
};
