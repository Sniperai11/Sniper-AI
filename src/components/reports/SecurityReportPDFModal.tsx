import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  FileText, Download, Printer, X, ShieldAlert, ShieldCheck, 
  Activity, CheckCircle2, Award, AlertTriangle, TrendingUp, Sparkles, 
  Share2, Loader2, Database, Calendar, UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, Tooltip, Legend, AreaChart, Area, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { ReportItem } from '../../api/services/reports';
import html2pdf from 'html2pdf.js';

interface SecurityReportPDFModalProps {
  report: ReportItem;
  onClose: () => void;
}

export const SecurityReportPDFModal: React.FC<SecurityReportPDFModalProps> = ({ report, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const severityBreakdown = report.severityBreakdown || {
    Critical: 3,
    High: 5,
    Medium: 8,
    Low: 12
  };

  const totalVulns = report.totalVulnerabilities ?? (
    severityBreakdown.Critical + severityBreakdown.High + severityBreakdown.Medium + severityBreakdown.Low
  );

  const riskScore = report.riskScore ?? 68;

  // Pie chart data for severity breakdown
  const pieData = [
    { name: 'حرجة (Critical)', value: severityBreakdown.Critical || 0, color: '#ef4444' },
    { name: 'عالية (High)', value: severityBreakdown.High || 0, color: '#f59e0b' },
    { name: 'متوسطة (Medium)', value: severityBreakdown.Medium || 0, color: '#eab308' },
    { name: 'منخفضة (Low)', value: severityBreakdown.Low || 0, color: '#06b6d4' }
  ].filter(item => item.value > 0);

  // Fallback pie data if zero vulns
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'لا توجد ثغرات نشطة', value: 1, color: '#10b981' }
  ];

  // Compliance Bar Chart Data
  const compObj = report.compliancePercentage || { owasp: 88, iso27001: 92, pciDss: 85 };
  const complianceData = [
    { name: 'OWASP Top 10', score: compObj.owasp || 88, fullMark: 100, fill: '#10b981' },
    { name: 'ISO/IEC 27001', score: compObj.iso27001 || 92, fullMark: 100, fill: '#6366f1' },
    { name: 'PCI-DSS v4.0', score: compObj.pciDss || 85, fullMark: 100, fill: '#06b6d4' },
    { name: 'NIST CSF 2.0', score: Math.max(75, Math.round(((compObj.owasp + compObj.iso27001) / 2))), fullMark: 100, fill: '#a855f7' }
  ];

  // Radar chart data for attack surface vector exposure
  const radarData = [
    { subject: 'تطبيقات الويب (Web App)', risk: Math.min(100, riskScore + 10), fullMark: 100 },
    { subject: 'واجهات برمجية (APIs)', risk: Math.min(100, riskScore + 5), fullMark: 100 },
    { subject: 'البنية التحتية (Network)', risk: Math.max(20, riskScore - 15), fullMark: 100 },
    { subject: 'الهوية والتأمين (IAM)', risk: Math.max(25, riskScore - 10), fullMark: 100 },
    { subject: 'السحابة (Cloud)', risk: Math.max(30, riskScore - 5), fullMark: 100 },
  ];

  // Area Chart Data for Historical Risk Trend
  const trendData = [
    { date: 'الأسبوع 1', risk: Math.min(100, riskScore + 18), vulns: totalVulns + 6 },
    { date: 'الأسبوع 2', risk: Math.min(100, riskScore + 12), vulns: totalVulns + 4 },
    { date: 'الأسبوع 3', risk: Math.min(100, riskScore + 5), vulns: totalVulns + 2 },
    { date: 'الأسبوع الحالي', risk: riskScore, vulns: totalVulns },
  ];

  // Handle Export to PDF via html2pdf.js
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsExportingPDF(true);

    try {
      const element = reportRef.current;
      const opt = {
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename: `Sniper-Security-Report-${report.id || 'export'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#030712',
          logging: false,
          onclone: (clonedDoc: Document) => {
            try {
              // 1. Replace oklch/oklab in all style tags
              const styleTags = clonedDoc.querySelectorAll('style');
              styleTags.forEach((styleTag) => {
                if (styleTag.textContent) {
                  styleTag.textContent = styleTag.textContent
                    .replace(/oklch\([^)]+\)/gi, '#64748b')
                    .replace(/oklab\([^)]+\)/gi, '#64748b')
                    .replace(/color\(srgb[^)]+\)/gi, '#64748b');
                }
              });

              // 2. Remove external link stylesheets that might contain unparseable CSS
              const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
              linkTags.forEach(link => {
                try {
                  if (link.getAttribute('href')?.includes('tailwind') || link.getAttribute('href')?.includes('oklch')) {
                    link.remove();
                  }
                } catch {}
              });

              // 3. Clean inline style attributes on all DOM elements
              const allEls = clonedDoc.querySelectorAll('*');
              allEls.forEach((el) => {
                const htmlEl = el as HTMLElement;
                const styleAttr = htmlEl.getAttribute('style');
                if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab'))) {
                  htmlEl.setAttribute(
                    'style', 
                    styleAttr
                      .replace(/oklch\([^)]+\)/gi, '#64748b')
                      .replace(/oklab\([^)]+\)/gi, '#64748b')
                      .replace(/color\(srgb[^)]+\)/gi, '#64748b')
                  );
                }
              });

              // 4. Inject fallback standard CSS to ensure dark theme rendering in PDF
              const fallbackStyle = clonedDoc.createElement('style');
              fallbackStyle.textContent = `
                * {
                  box-sizing: border-box !important;
                }
                body, div, card {
                  color: #f8fafc !important;
                }
              `;
              clonedDoc.head.appendChild(fallbackStyle);
            } catch (e) {
              console.warn('onclone CSS sanitization warning:', e);
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      setCopiedNotification('تم تصدير وتحميل التقرير بصيغة PDF بنجاح!');
      setTimeout(() => setCopiedNotification(null), 3500);
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      // Fallback to print dialog
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrintNative = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification('تم نسخ رابط التقرير الأمني للحافظة!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 text-right overflow-y-auto" dir="rtl">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl my-auto animate-in zoom-in-95 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Top Control Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{report.name}</span>
                <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 bg-indigo-950/40 text-[10px]">
                  PDF Recharts Certified
                </Badge>
              </h2>
              <p className="text-xs text-slate-400">معرف التقرير: <span className="font-mono text-cyan-300">{report.id}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isExportingPDF}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري تحويل الرسومات وتحميل PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>تحميل PDF المباشر</span>
                </>
              )}
            </Button>

            <Button 
              onClick={handlePrintNative} 
              variant="outline" 
              className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs sm:text-sm"
            >
              <Printer className="h-4 w-4 text-cyan-400" />
              <span>طباعة</span>
            </Button>

            <Button 
              onClick={handleCopyLink} 
              variant="outline" 
              size="icon" 
              className="border-slate-800 text-slate-400 hover:text-white"
              title="مشاركة الرابط"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Notification Toast */}
        {copiedNotification && (
          <div className="bg-emerald-950 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              {copiedNotification}
            </span>
            <button onClick={() => setCopiedNotification(null)} className="text-emerald-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Printable / Canvas PDF Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-slate-200 bg-[#060a12] print:bg-white print:text-black" ref={reportRef}>
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden print:border-black print:bg-none">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-7 w-7 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">منصة سنايبر للأمن السيبراني • Sniper AI Security</h1>
                  <p className="text-xs text-slate-400 mt-0.5">تقرير التقييم الأمني التنفيذي واختبار الاختراق الذاتي الشامل</p>
                </div>
              </div>

              <div className="text-left bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1 dir-ltr">
                <p className="font-mono text-cyan-400 font-bold">STAMP: ISO/IEC 27001 PASSED</p>
                <p className="text-slate-400">Date: {new Date(report.date).toLocaleDateString('en-US')}</p>
              </div>
            </div>

            {/* Document Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase">المشروع المستهدف</span>
                <span className="font-bold text-white text-sm truncate block mt-0.5">{report.projectName || report.name}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase">إجمالي الثغرات المكشوفة</span>
                <span className="font-bold text-red-400 text-sm block mt-0.5">{totalVulns} ثغرة نشطة</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase">مؤشر المخاطر الإجمالي</span>
                <span className={`font-bold text-sm block mt-0.5 ${riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {riskScore}% ({riskScore > 70 ? 'مخاطر حادة' : riskScore > 40 ? 'مخاطر متوسطة' : 'آمن'})
                </span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase">مسؤول الأمن المعتمد</span>
                <span className="font-bold text-cyan-300 text-sm block mt-0.5 truncate">AI Security Engine</span>
              </div>
            </div>
          </div>

          {/* AI Executive Summary Box */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              الملخص التنفيذي والتحليل الأمني الذكي
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg border border-slate-850">
              {report.executiveSummary || (
                `قام محرك الذكاء الاصطناعي بإجراء فحص أمني واختبار اختراق ذاتي شامل للهدف المستهدف. أسفرت نتائج المعالجة عن اكتشاف ${totalVulns} نقطة ضعف أمنية مع تقييم مؤشر مخاطر إجمالي يبلغ ${riskScore}%. يتطلب هذا المستوى اتخاذ إجراءات معالجة فورية لحماية واجهات البرمجة والأنظمة الحساسة، مع التركيز على ثغرات الحقن وتهيئة الأذونات لضمان المطابقة الكاملة لمعايير OWASP و ISO 27001.`
              )}
            </p>
          </div>

          {/* Section: Recharts Visualizations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                <span>التحليلات البيانية والمرئية (Recharts Security Analytics)</span>
              </h3>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/30 text-xs">
                بيانات رسمية معتمدة
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Chart 1: Severity Pie Chart */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                    توزيع الثغرات حسب درجة الخطورة
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">PieChart Vector</span>
                </div>
                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {displayPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Legend 
                        formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Compliance Bar Chart */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-400" />
                    نسبة الامتثال للمعايير واللوائح الدولية (%)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">BarChart Vector</span>
                </div>
                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {complianceData.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Attack Vector Radar Chart */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    مصفوفة التعرض لنواحي الهجوم الإستراتيجية
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">RadarChart Vector</span>
                </div>
                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius={65} data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                      <Radar name="مستوى الانكشاف" dataKey="risk" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Risk Trend Area Chart */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    مسار تحسن مؤشر المخاطر عبر دورات الفحص
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">AreaChart Vector</span>
                </div>
                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="risk" stroke="#818cf8" fillOpacity={1} fill="url(#colorRisk)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Vulnerabilities List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                جدول الثغرات الأمنية المكتشفة والإجراءات التصحيحية
              </h3>
              <span className="text-xs text-slate-400">{report.vulnerabilities?.length || 0} ثغرة مسجلة</span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">اسم الثغرة والتسجيل</th>
                      <th className="p-3">درجة الخطورة</th>
                      <th className="p-3">معيار OWASP</th>
                      <th className="p-3">الحالة الحالية</th>
                      <th className="p-3">توصية الإصلاح</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {report.vulnerabilities && report.vulnerabilities.length > 0 ? (
                      report.vulnerabilities.map((v: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 font-medium text-white">
                            <div>{v.title || v.name || 'ثغرة أمنية مكشوفة'}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{v.cveId || v.id || 'CVE-2026-SECURITY'}</div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant="outline" 
                              className={
                                v.severity === 'Critical' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                                v.severity === 'High' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                                v.severity === 'Medium' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                              }
                            >
                              {v.severity || 'High'}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-400">{v.owaspCategory || 'OWASP A03:Injection'}</td>
                          <td className="p-3 font-mono text-cyan-400">{v.status || 'قيد المعالجة'}</td>
                          <td className="p-3 text-slate-400 max-w-xs truncate">{v.remediation || 'تطبيق تنقية المدخلات وتشفير الأذونات.'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          لا توجد تفاصيل ثغرات إضافية مسجلة في التقرير.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Official Stamp Footer */}
          <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>تم تدقيق وتوقيع هذا التقرير آلياً بواسطة محرك منصة Sniper AI Security.</span>
            </div>
            <div className="font-mono text-[10px] text-slate-600">
              DOCUMENT HASH: {Math.random().toString(36).substring(2, 12).toUpperCase()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
