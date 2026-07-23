import React, { useState } from 'react';
import { FileText, Download, Play, Sliders, RefreshCw, CheckCircle, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';
import { Badge } from '../shared/components/Badge';

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

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeHistory = Array.isArray(reportsHistory) ? reportsHistory : [];

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white">مركز التقارير والتدقيق الأمني الاحترافي</h2>
        <p className="text-xs text-slate-400 mt-1">توليد تقارير تنفيذية وتقنية تفصيلية مطابقة لمعايير الامتثال العالمية (OWASP, ISO, PCI)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REPORT CONFIGURATION */}
        <Card title="إعداد وتوليد تقرير أمني" className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">المشروع المستهدف</label>
              <select 
                value={selectedProj}
                onChange={e => setSelectedProj(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">اختر مشروعاً...</option>
                {safeProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">شعار الشركة على التقرير (اختياري)</label>
              <input 
                type="text" 
                value={logoOption || ''}
                onChange={e => setLogoOption(e.target.value || null)}
                placeholder="رابط شعار الشركة المخصص SVG/PNG..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">بادئة عنوان التقرير (مثال: سري للغاية)</label>
              <input 
                type="text" 
                value={prefixOption}
                onChange={e => setPrefixOption(e.target.value)}
                placeholder="عناوين وتصنيفات خاصة بالشركة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-2" 
            disabled={!selectedProj || actionLoading === 'generating_report'}
            onClick={() => onCreateReport(selectedProj, logoOption, prefixOption)}
          >
            {actionLoading === 'generating_report' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> جاري توليد التقرير...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> إصدار تقرير أمني معتمد
              </>
            )}
          </Button>
        </Card>

        {/* ACTIVE REPORT PREVIEW */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <Card title={`معاينة التقرير: ${activeReport.projectName}`} className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <span className="text-xs text-slate-400">تاريخ الإصدار: {new Date(activeReport.generatedAt).toLocaleDateString('ar-EG')}</span>
                  <Badge variant="success">Risk Score: {activeReport.riskScore}%</Badge>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">الملخص التنفيذي (Executive Summary):</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeReport.executiveSummary}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="text-[9px] text-slate-500 block">مطابقة OWASP</span>
                    <span className="text-xs font-bold text-white">{activeReport.compliancePercentage?.owasp || 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="text-[9px] text-slate-500 block">مطابقة ISO 27001</span>
                    <span className="text-xs font-bold text-white">{activeReport.compliancePercentage?.iso27001 || 100}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <span className="text-[9px] text-slate-500 block">مطابقة PCI-DSS</span>
                    <span className="text-xs font-bold text-white">{activeReport.compliancePercentage?.pciDss || 100}%</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16 text-slate-500 text-xs">
              اختر مشروعاً وقم بتهيئة الإعدادات لإصدار التقرير الأمني الفوري.
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};
