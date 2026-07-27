import React, { useState } from 'react';
import { Activity, Search, Filter, ShieldCheck, UserCheck, ShieldAlert, FileText, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuditLogs } from '../hooks/api/useAuditLogs';

export const AuditLogs = () => {
  const { data: auditLogs = [], isLoading } = useAuditLogs();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            سجل الأنشطة والعمليات الأمنية (Audit Logs)
          </h1>
          <p className="text-sm text-slate-400 mt-1">تتبع التغيرات والقرارات الأمنية وإجراءات الفحص حياً لجميع الأعضاء والوكلاء</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في سجل الأنشطة..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>
        </div>
      </div>

      {/* AUDIT LOGS TABLE */}
      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">التاريخ والوقت</th>
                <th className="px-4 py-4 font-medium text-right">الإجراء</th>
                <th className="px-4 py-4 font-medium text-right">المستخدم / الوكيل</th>
                <th className="px-4 py-4 font-medium text-right">التفاصيل</th>
                <th className="px-4 py-4 font-medium text-left">عنوان IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا توجد سجلات أنشطة مسجلة.</td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 text-xs font-mono text-cyan-400 whitespace-nowrap" dir="ltr">
                    {new Date(log.timestamp).toLocaleString('ar-SA')}
                  </td>
                  <td className="px-4 py-4 font-bold text-white whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-xs font-mono whitespace-nowrap" dir="ltr">
                    {log.userEmail}
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-xs">
                    {log.details}
                  </td>
                  <td className="px-4 py-4 text-left font-mono text-xs text-slate-500 whitespace-nowrap" dir="ltr">
                    {log.ipAddress || '192.168.1.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
