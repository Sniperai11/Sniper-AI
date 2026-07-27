import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, AlertTriangle, ShieldCheck, Activity, Search, Filter, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useIncidents } from '../hooks/api/useWorkflows';
import { IncidentWorkflow } from '../api/types/workflows';
import { IncidentDrawer } from '../components/workflows/IncidentDrawer';

export const Incidents = () => {
  const { data: incidents, isLoading } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<IncidentWorkflow | null>(null);

  const getSeverityBadge = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('crit') || s.includes('حرج')) return <Badge variant="destructive" className="border-0">حرج</Badge>;
    if (s.includes('high') || s.includes('عال')) return <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-0">عالي</Badge>;
    if (s.includes('med') || s.includes('متوسط')) return <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-0">متوسط</Badge>;
    if (s.includes('low') || s.includes('منخفض')) return <Badge variant="outline" className="border-slate-700 text-slate-400">منخفض</Badge>;
    return <Badge variant="outline" className="border-slate-700 text-slate-400">معلومات</Badge>;
  };

  const getStateBadge = (state: string) => {
    const s = (state || '').toLowerCase();
    if (s.includes('new') || s.includes('جديد')) return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30">جديد</Badge>;
    if (s.includes('investigat') || s.includes('تحقيق')) return <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">قيد التحقيق</Badge>;
    if (s.includes('contain') || s.includes('احتواء')) return <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">تم الاحتواء</Badge>;
    if (s.includes('resolv') || s.includes('معالج')) return <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">تمت الحل</Badge>;
    return <Badge variant="outline" className="border-slate-700 text-slate-400">{state}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">إدارة الحوادث الأمنية</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة وتحقيق ومعالجة الحوادث الأمنية النشطة فور وقوعها</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="ابحث في الحوادث..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>
          <Button variant="outline" className="h-10 border-slate-800 bg-slate-900/50 shrink-0">
            <Filter className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">تصفية</span>
          </Button>
          <Button className="h-10 bg-red-600 hover:bg-red-500 text-white shrink-0">
            الإعلان عن حادث أمني
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-20">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-red-400">حوادث نشطة</span>
          <span className="text-xl sm:text-3xl font-black text-red-500 mt-1">3</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <Activity className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">قيد التحقيق</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">5</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">متوسط زَمَن الاستجابة MTTR</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">1.2 ساعة</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">معالجة (30 يوم)</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">42</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">رقم الحادث / العنوان</th>
                <th className="px-4 py-4 font-medium text-right">مستوى الخطورة</th>
                <th className="px-4 py-4 font-medium text-right">الحالة</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">المدة</th>
                <th className="px-4 py-4 font-medium hidden md:table-cell text-right">المحلل المسؤول</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">جاري تحميل الحوادث...</td>
                </tr>
              ) : incidents?.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-mono text-slate-500 mb-0.5">{incident.id}</span>
                      <p className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors truncate max-w-[250px] sm:max-w-md">
                        {incident.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getSeverityBadge(incident.severity)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStateBadge(incident.state)}
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                    ساعة و24د
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Users className="h-3 w-3 text-slate-300" />
                      </div>
                      <span className="text-xs">{incident.owner || 'غير معين'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-left">
                    <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      التحقيق <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedIncident && (
        <IncidentDrawer 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      )}
    </div>
  );
};
