import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  FileText, Download, Calendar, Settings, Plus,
  PieChart, Activity, ShieldCheck, Zap
} from 'lucide-react';
import { useReports } from '../hooks/api/useReports';

export const Reports = () => {
  const { data: reports, isLoading } = useReports();

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            استوديو التقارير الأمنية
          </h1>
          <p className="text-slate-400 text-sm mt-1">توليد واستخراج التقارير الأمنية التلقائية والتنفيذية</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">الإعدادات</span>
            <span className="sm:hidden">الإعدادات</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-indigo-600 hover:bg-indigo-500 text-white border-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">إنشاء تقرير جديد</span>
            <span className="sm:hidden">تقرير جديد</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/10 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
              <PieChart className="h-6 w-6 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">الملخص التنفيذي</h3>
              <p className="text-xs text-slate-500 mt-1">مؤشرات عالية المستوى للإدارة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/30 transition-colors">
              <Zap className="h-6 w-6 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">نتائج اختبار الاختراق</h3>
              <p className="text-xs text-slate-500 mt-1">تفاصيل ومسارات الاستغلال التقني</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
              <ShieldCheck className="h-6 w-6 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">تدقيق الامتثال</h3>
              <p className="text-xs text-slate-500 mt-1">مطابقة المعايير واللوائح</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-amber-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-amber-500/10 flex items-center justify-center border border-slate-700 group-hover:border-amber-500/30 transition-colors">
              <Activity className="h-6 w-6 text-slate-400 group-hover:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">التغير التشغيلي</h3>
              <p className="text-xs text-slate-500 mt-1">المتغيرات الأمنية الأسبوعية</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="border-b border-slate-800/60 pb-4">
          <CardTitle className="text-base font-medium">أرشيف التقارير الحديثة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-slate-800/60">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">جاري تحميل التقارير...</div>
            ) : !reports || reports.length === 0 ? (
              <div className="p-8 text-center text-slate-400">لا توجد تقارير متاحة.</div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                      <FileText className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{report.name}</span>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <Badge variant="outline" className="bg-slate-900/50">{report.type}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.date).toLocaleDateString('ar-SA')}
                        </span>
                        <span className="font-mono">{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
                    <Download className="h-4 w-4" />
                    تحميل ملف PDF
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
