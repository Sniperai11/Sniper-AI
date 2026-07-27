import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Briefcase, Search, Filter, FolderOpen, ArrowUpRight, Clock, Users, CheckCircle, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCases, useCreateCase, useUpdateCaseStatus } from '../hooks/api/useCases';
import { CaseWorkflow, CaseStatus } from '../api/types/workflows';

export const Cases = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLead, setNewLead] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const { data: cases, isLoading } = useCases({ search, status: selectedStatus });
  const createCase = useCreateCase();
  const updateStatus = useUpdateCaseStatus();

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    createCase.mutate(
      {
        title: newTitle,
        leadAnalyst: newLead || 'Admin Analyst',
        description: newDesc,
        status: 'Planning',
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewTitle('');
          setNewLead('');
          setNewDesc('');
        },
      }
    );
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'In Progress':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">قيد التنفيذ</Badge>;
      case 'Planning':
        return <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">التخطيط</Badge>;
      case 'Under Review':
        return <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">قيد المراجعة</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">مغلقة</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-700 text-slate-400">{status}</Badge>;
    }
  };

  const openCasesCount = cases?.filter(c => c.status !== 'Closed').length || 0;
  const inProgressCount = cases?.filter(c => c.status === 'In Progress').length || 0;
  const closedCount = cases?.filter(c => c.status === 'Closed').length || 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">إدارة القضايا والتحقيقات</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة التحقيقات الأمنية طويلة المدى وقضايا الامتثال</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في القضايا..." 
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
            قضية جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <Briefcase className="w-16 h-16 text-cyan-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">القضايا المفتوحة</span>
          <span className="text-xl sm:text-3xl font-black text-cyan-400 mt-1">{openCasesCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <FolderOpen className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">قيد التنفيذ</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">{inProgressCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <Users className="w-16 h-16 text-purple-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">المحللون النشطون</span>
          <span className="text-xl sm:text-3xl font-black text-purple-400 mt-1">8</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">مغلقة والمعالجة</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">{closedCount}</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">رقم القضية / العنوان</th>
                <th className="px-4 py-4 font-medium text-right">الحالة</th>
                <th className="px-4 py-4 font-medium text-right">المحلل الرئيسي</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">آخر تحديث</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">جاري تحميل القضايا...</td>
                </tr>
              ) : cases?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا توجد قضايا تطابق البحث.</td>
                </tr>
              ) : cases?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-mono text-slate-500 mb-0.5">{item.id}</span>
                      <p className="font-medium text-slate-200">{item.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="h-3 w-3 text-slate-300" />
                      <span className="text-xs">{item.leadAnalyst}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3"/> {new Date(item.updatedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      {item.status !== 'Closed' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => updateStatus.mutate({ id: item.id, status: 'Closed' })}
                          className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs"
                        >
                          إغلاق القضية
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

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-right" dir="rtl">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">إنشاء قضية جديدة</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">عنوان القضية</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: تدقيق برامج الفدية للربع الرابع" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">المحلل الرئيسي</label>
                <input 
                  type="text" 
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  placeholder="مثال: سارة أحمد" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">الوصف ونطاق العمل</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="أهداف القضية والنطاق المبدئي..." 
                  className="w-full rounded bg-slate-900 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none text-right"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-800">
                  إلغاء
                </Button>
                <Button type="submit" disabled={createCase.isPending} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  {createCase.isPending ? 'جاري الإنشاء...' : 'إنشاء القضية'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
