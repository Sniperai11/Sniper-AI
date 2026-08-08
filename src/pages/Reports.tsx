import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  FileText, Download, Calendar, Settings, Plus,
  PieChart, Activity, ShieldCheck, Zap, X, Eye, Loader2, AlertTriangle, CheckCircle2,
  Printer
} from 'lucide-react';
import { useReports, useGenerateReport, useReportProjects } from '../hooks/api/useReports';
import { ReportItem } from '../api/services/reports';
import { SecurityReportPDFModal } from '../components/reports/SecurityReportPDFModal';

export const Reports = () => {
  const { data: reports, isLoading } = useReports();
  const { data: projects } = useReportProjects();
  const generateMutation = useGenerateReport();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null);

  useEffect(() => {
    if (projects && projects.length > 0 && !projects.some(p => p.id === selectedProjectId)) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newReport = await generateMutation.mutateAsync(selectedProjectId);
      setIsCreateModalOpen(false);
      setActiveReport(newReport);
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء توليد التقرير الأمني');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            استوديو التقارير الأمنية
          </h1>
          <p className="text-slate-400 text-sm mt-1">توليد واستخراج التقارير الأمنية التلقائية والتنفيذية المصممة بمحرك الذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 flex-1 sm:flex-none justify-center bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء تقرير أمني جديد</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/50 transition-all cursor-pointer group hover:bg-indigo-950/10"
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/40 transition-colors">
              <PieChart className="h-6 w-6 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white">الملخص التنفيذي</h3>
              <p className="text-xs text-slate-500 mt-1">مؤشرات عالية المستوى للقيادة</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/50 transition-all cursor-pointer group hover:bg-cyan-950/10"
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/40 transition-colors">
              <Zap className="h-6 w-6 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white">نتائج اختبار الاختراق</h3>
              <p className="text-xs text-slate-500 mt-1">تفاصيل الثغرات ومسارات الاستغلال</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/50 transition-all cursor-pointer group hover:bg-emerald-950/10"
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/40 transition-colors">
              <ShieldCheck className="h-6 w-6 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white">تدقيق الامتثال</h3>
              <p className="text-xs text-slate-500 mt-1">مطابقة لوائح OWASP & ISO</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900/40 border-slate-800/60 hover:border-amber-500/50 transition-all cursor-pointer group hover:bg-amber-950/10"
        >
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-amber-500/20 flex items-center justify-center border border-slate-700 group-hover:border-amber-500/40 transition-colors">
              <Activity className="h-6 w-6 text-slate-400 group-hover:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 group-hover:text-white">التغير التشغيلي</h3>
              <p className="text-xs text-slate-500 mt-1">سجل التطور الأمني الأسبوعي</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="border-b border-slate-800/60 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            أرشيف التقارير الأمنية المصدرة
          </CardTitle>
          <Badge variant="outline" className="border-slate-700 text-slate-400">
            {reports ? `${reports.length} تقرير` : 'جاري الجلب...'}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-slate-800/60">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                <span>جاري تحميل سجل التقارير الأمنية من الباكند...</span>
              </div>
            ) : !reports || reports.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <FileText className="h-8 w-8 text-slate-600" />
                <span>لا توجد تقارير أمنية سابقة في الأرشيف.</span>
                <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white mt-2">
                  إنشاء أول تقرير أمني
                </Button>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{report.name}</span>
                        {report.riskScore !== undefined && (
                          <Badge 
                            variant="outline" 
                            className={
                              report.riskScore > 70 
                                ? 'border-red-500/40 text-red-400 bg-red-500/10' 
                                : report.riskScore > 40 
                                ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' 
                                : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                            }
                          >
                            مخاطر: {report.riskScore}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <Badge variant="outline" className="bg-slate-900/50 border-slate-700">{report.type}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(report.date).toLocaleDateString('ar-SA')}
                        </span>
                        <span className="font-mono text-slate-400">{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => setActiveReport(report)}
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500/50"
                    >
                      <Eye className="h-4 w-4 text-indigo-400" />
                      عرض التقرير
                    </Button>
                    <Button 
                      onClick={() => {
                        setActiveReport(report);
                        setTimeout(() => window.print(), 300);
                      }}
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 border-slate-700 text-indigo-400 hover:bg-indigo-950/30 hover:border-indigo-500"
                    >
                      <Download className="h-4 w-4" />
                      تحميل PDF
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Report Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-right" dir="rtl">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                توليد تقرير أمني جديد
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)}>
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">اختر المشروع المستهدف</label>
                <select 
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none text-right"
                >
                  {projects && projects.length > 0 ? (
                    projects.map((p, idx) => (
                      <option key={`proj-opt-${p.id}-${idx}`} value={p.id}>{p.name}</option>
                    ))
                  ) : (
                    <option value="proj-1">مشروع النطاقات الرئيسية</option>
                  )}
                </select>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-xs text-indigo-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  معالجة التقرير بواسطة الذكاء الاصطناعي:
                </p>
                <p className="text-slate-400">سيقوم محرك التقرير بتحليل جميع ثغرات المشروعات وحساب نسبة المخاطر والامتثال التلقائي لوائح OWASP و ISO 27001.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="border-slate-800">
                  إلغاء
                </Button>
                <Button type="submit" disabled={generateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري توليد التقرير...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      إصدار التقرير الآن
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Download Report Detail Modal */}
      {activeReport && (
        <SecurityReportPDFModal 
          report={activeReport} 
          onClose={() => setActiveReport(null)} 
        />
      )}
    </div>
  );
};

