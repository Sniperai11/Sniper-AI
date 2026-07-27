import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Search, Filter, Shield, Info, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useVulnerabilities } from '../hooks/api/useWorkflows';
import { VulnerabilityWorkflow } from '../api/types/workflows';
import { VulnerabilityDrawer } from '../components/workflows/VulnerabilityDrawer';

export const Vulnerabilities = () => {
  const { data: vulnerabilities, isLoading } = useVulnerabilities();
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityWorkflow | null>(null);

  const getSeverityBadge = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('crit') || s.includes('حرج')) return <Badge variant="destructive" className="border-0">حرج</Badge>;
    if (s.includes('high') || s.includes('عال')) return <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-0">عالي</Badge>;
    if (s.includes('med') || s.includes('متوسط')) return <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-0">متوسط</Badge>;
    if (s.includes('low') || s.includes('منخفض')) return <Badge variant="outline" className="border-slate-700 text-slate-400">منخفض</Badge>;
    return <Badge variant="outline" className="border-slate-700 text-slate-400">معلومات</Badge>;
  };

  const getSeverityIcon = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('crit') || s.includes('حرج')) return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (s.includes('high') || s.includes('عال')) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (s.includes('med') || s.includes('متوسط')) return <AlertCircle className="h-4 w-4 text-slate-400" />;
    if (s.includes('low') || s.includes('منخفض')) return <Shield className="h-4 w-4 text-slate-500" />;
    return <Info className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">إدارة الثغرات الأمنية</h1>
          <p className="text-sm text-slate-400 mt-1">متابعة وتصنيف ومعالجة جميع الثغرات البرمجية المكتشفة</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="ابحث برقم الثغرة CVE، الأصل، IP..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>
          <Button variant="outline" className="h-10 border-slate-800 bg-slate-900/50 shrink-0">
            <Filter className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">التصفية</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-10">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">ثغرات حرجة</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">12</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-10">
            <AlertTriangle className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">خطورة عالية</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">34</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">معالجة (30 يوم)</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">156</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">متوسط وقت الإصلاح</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">4.2 أيام</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium text-right">الثغرة الأمنية</th>
                <th className="px-4 py-4 font-medium text-right">مستوى الخطورة</th>
                <th className="px-4 py-4 font-medium text-right">CVSS</th>
                <th className="px-4 py-4 font-medium text-right">الحالة</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">الأصل التأثر</th>
                <th className="px-4 py-4 font-medium hidden md:table-cell text-right">تاريخ الاكتشاف</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">جاري تحميل قائمة الثغرات...</td>
                </tr>
              ) : vulnerabilities?.map((vuln) => (
                <tr 
                  key={vuln.id} 
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedVuln(vuln)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {getSeverityIcon(vuln.severity)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors truncate max-w-[200px] sm:max-w-xs">{vuln.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{vuln.cve || vuln.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getSeverityBadge(vuln.severity)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-mono text-slate-300">
                    {vuln.cvss}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="border-slate-700 bg-slate-900">{vuln.state}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell">
                    <div className="truncate max-w-[150px]" title={vuln.affectedAssets.join(', ')}>
                      {vuln.affectedAssets[0]} {vuln.affectedAssets.length > 1 && `+${vuln.affectedAssets.length - 1}`}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden md:table-cell whitespace-nowrap text-xs">
                    {new Date(vuln.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-4 py-4 text-left">
                    <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      معالجة <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedVuln && (
        <VulnerabilityDrawer 
          vulnerability={selectedVuln} 
          onClose={() => setSelectedVuln(null)} 
        />
      )}
    </div>
  );
};
