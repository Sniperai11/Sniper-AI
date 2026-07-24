import React, { useState } from 'react';
import { FileText, Download, Play, RefreshCw, Eye, CheckCircle, Award, ShieldAlert, Cpu, Code } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export interface ReportsPageProps {
  vulnerabilities: any[];
  userProfile: any;
  actionLoading: string | null;
  projects: any[];
  reportsHistory: any[];
  onCreateReport: (projectId: string, companyLogo: string | null, titlePrefix: string) => void;
  activeReport: any;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  vulnerabilities = [],
  userProfile,
  actionLoading,
  projects = [],
  reportsHistory = [],
  onCreateReport,
  activeReport
}) => {
  const [selectedProj, setSelectedProj] = useState('');
  const [logoOption, setLogoOption] = useState<string | null>(null);
  const [prefixOption, setPrefixOption] = useState('');
  const [viewingReportType, setViewingReportType] = useState<string>('Technical');

  const safeProjects = Array.isArray(projects) ? projects : [];

  const handleDownloadPdf = (type: string) => {
    const reportText = `SNIPER AI SECURITY PLATFORM - ${type.toUpperCase()} REPORT\nProject: ${selectedProj || 'Enterprise Core'}\nGenerated: Today\nRisk Score: 82%\nStatus: Compliant`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sniper_AI_${type}_Security_Report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          Reports Center (مركز التقارير والتدقيق الأمني)
        </h2>
        <p className="text-xs text-slate-400 mt-1">توليد واستعراض تقارير الأمان الفنية والإدارية والامتثال المعياري لكافة أصول المنظمة</p>
      </div>

      {/* REPORT TYPE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Technical Report */}
        <Card variant="cyber" className="p-5 space-y-4 border-cyan-500/30">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <Badge variant="info">للمطورين والفرق الفنية</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Technical Security Report</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              تقرير تقني مفصل يحوي جميع الحمضيات البرمجية، الثغرات، خطوات إعادة التكرار (PoC)، وأكواد الترقيع الفورية.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setViewingReportType('Technical')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> View (معاينة)
            </button>
            <button
              onClick={() => handleDownloadPdf('Technical')}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </Card>

        {/* Executive Report */}
        <Card variant="cyber" className="p-5 space-y-4 border-purple-500/30">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-950/80 border border-purple-500/30 rounded-xl text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <Badge variant="warning">للإدارة والتنفيذيين</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Executive Security Report</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              ملخص إداري رفيع المستوى لمجالس الإدارة والمدراء التنفيذيين يشرح مستويات المخاطر والأثر المالي والاستراتيجي.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setViewingReportType('Executive')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" /> View (معاينة)
            </button>
            <button
              onClick={() => handleDownloadPdf('Executive')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </Card>

        {/* Compliance Report */}
        <Card variant="cyber" className="p-5 space-y-4 border-emerald-500/30">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <Badge variant="success">ISO / PCI-DSS / OWASP</Badge>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Compliance Report</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              تقرير المطابقة مع المعايير السيبرانية القياسية ISO 27001، PCI-DSS، و OWASP Top 10 لجهات التدقيق الخارجي.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setViewingReportType('Compliance')}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" /> View (معاينة)
            </button>
            <button
              onClick={() => handleDownloadPdf('Compliance')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </Card>

      </div>

      {/* REPORT VIEWER / GENERATOR PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REPORT GENERATOR FORM */}
        <Card title="إصدار تقرير مخصص" className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">المشروع المستهدف</label>
              <select 
                value={selectedProj}
                onChange={e => setSelectedProj(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="">اختر مشروعاً...</option>
                {safeProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">بادئة عنوان التقرير (مثال: سري للغاية)</label>
              <input 
                type="text" 
                value={prefixOption}
                onChange={e => setPrefixOption(e.target.value)}
                placeholder="تصنيف التقرير وسريته..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 font-bold" 
            disabled={!selectedProj || actionLoading === 'generating_report'}
            onClick={() => onCreateReport(selectedProj, logoOption, prefixOption)}
          >
            {actionLoading === 'generating_report' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> جاري توليد التقرير...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> إصدار التقرير الفوري
              </>
            )}
          </Button>
        </Card>

        {/* ACTIVE REPORT PREVIEW */}
        <div className="lg:col-span-2">
          <Card title={`معاينة تقرير الأمان: ${viewingReportType} Report`} className="space-y-4">
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <span className="text-xs text-slate-400">Generated: Today</span>
                <Badge variant="success">Overall Score: 82%</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {viewingReportType === 'Technical' ? 'Technical Security Breakdown & PoC Details' :
                   viewingReportType === 'Executive' ? 'Executive Risk Assessment & Strategic Impact' :
                   'Compliance Auditing (ISO 27001, PCI-DSS, OWASP Top 10)'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {viewingReportType === 'Technical' ? 'تضمن هذا التقرير الفني فحص جميع النهايات البرمجية الخاصة بك وتدقيق الـ JWT tokens، حيث تم رصد ثغرات في POST /login وتوفير أكواد الترقيع الفورية.' :
                   viewingReportType === 'Executive' ? 'يوضح التقرير التنفيذي استقرار البنية التحتية بنسبة 82%، مع توصية بتوجيه فرق التطوير لتطبيق تدوير مفاتيح التشفير لتقليل مخاطر الوصول غير المصرح به.' :
                   'يؤكد التقرير توافق الأنظمة بنسبة 92% مع معايير ISO 27001، و 88% مع معيار PCI-DSS للمدفوعات، و 95% مع قائمة OWASP Top 10.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">OWASP Top 10</span>
                  <span className="text-sm font-bold text-cyan-400">95% Compliant</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">ISO 27001</span>
                  <span className="text-sm font-bold text-purple-400">92% Compliant</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">PCI-DSS</span>
                  <span className="text-sm font-bold text-emerald-400">88% Compliant</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => handleDownloadPdf(viewingReportType)} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold">
                  <Download className="w-3.5 h-3.5" /> تحميل التقرير بصيغة PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
