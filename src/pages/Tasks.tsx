import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckSquare, Search, Filter, Clock, Users, ArrowUpRight, CheckCircle, AlertTriangle, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTasks, useCreateTask, useUpdateTaskStatus } from '../hooks/api/useTasks';
import { TaskWorkflow, TaskStatus } from '../api/types/workflows';

export const Tasks = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newLinkedEntity, setNewLinkedEntity] = useState('');

  const { data: tasks, isLoading } = useTasks({ search, status: selectedStatus });
  const createTask = useCreateTask();
  const updateStatus = useUpdateTaskStatus();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    createTask.mutate(
      {
        title: newTitle,
        assignee: newAssignee || 'Unassigned',
        linkedEntity: newLinkedEntity || undefined,
        status: 'To Do',
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewTitle('');
          setNewAssignee('');
          setNewLinkedEntity('');
        },
      }
    );
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'In Progress':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">قيد التنفيذ</Badge>;
      case 'To Do':
        return <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-800">قيد الانتظار</Badge>;
      case 'Done':
        return <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">مكتملة</Badge>;
      case 'Overdue':
        return <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">متأخرة</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-700 text-slate-400">{status}</Badge>;
    }
  };

  const myTasksCount = tasks?.length || 0;
  const overdueCount = tasks?.filter(t => t.status === 'Overdue').length || 0;
  const dueThisWeekCount = tasks?.filter(t => t.status === 'In Progress' || t.status === 'To Do').length || 0;
  const completedCount = tasks?.filter(t => t.status === 'Done').length || 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">مهام المعالجة والتنفيذ</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة المهام الأمنية، إجراءات العلاج، والتعيينات الفردية والجماعية</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في المهام..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedStatus(selectedStatus ? '' : 'In Progress')}
            className={`h-10 border-slate-800 shrink-0 ${selectedStatus ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-900/50 text-slate-300'}`}
          >
            <Filter className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">{selectedStatus ? `تصفية: ${selectedStatus}` : 'تصفية'}</span>
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
          >
            <Plus className="h-4 w-4 ml-1" />
            مهمة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <CheckSquare className="w-16 h-16 text-cyan-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">إجمالي المهام</span>
          <span className="text-xl sm:text-3xl font-black text-cyan-400 mt-1">{myTasksCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">مهام متأخرة</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">{overdueCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">المهام النشطة</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">{dueThisWeekCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">المهام المكتملة</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">{completedCount}</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">عنوان المهمة</th>
                <th className="px-4 py-4 font-medium text-right">الحالة</th>
                <th className="px-4 py-4 font-medium text-right">المكلف بالمهمة</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">تاريخ الاستحقاق</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">جاري تحميل المهام...</td>
                </tr>
              ) : tasks?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا توجد مهام تطابق البحث.</td>
                </tr>
              ) : tasks?.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex flex-col min-w-0">
                      <p className="font-medium text-slate-200">{task.title}</p>
                      {task.linkedEntity && (
                        <span className="text-xs text-slate-500 mt-0.5">مرتبطة بـ {task.linkedEntity}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="h-3 w-3 text-slate-300" />
                      <span className="text-xs">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3"/> {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      {task.status !== 'Done' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateStatus.mutate({ id: task.id, status: 'Done' })}
                          className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs"
                        >
                          تحديد كمكتملة
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-right" dir="rtl">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">إنشاء مهمة أمنية جديدة</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">عنوان المهمة</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: تغيير مفاتيح API السرية" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">المكلف بالمهمة</label>
                <input 
                  type="text" 
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  placeholder="مثال: فريق العمليات الأمنية" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">الارتباط (رقم ثغرة / حادث / قضية)</label>
                <input 
                  type="text" 
                  value={newLinkedEntity}
                  onChange={(e) => setNewLinkedEntity(e.target.value)}
                  placeholder="مثال: VULN-9021" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-800">
                  إلغاء
                </Button>
                <Button type="submit" disabled={createTask.isPending} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  {createTask.isPending ? 'جاري الإنشاء...' : 'إنشاء المهمة'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
