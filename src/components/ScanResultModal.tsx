import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  X, ShieldAlert, Terminal, Radar, CheckCircle2, AlertTriangle, 
  Copy, Download, ExternalLink, FileText, ArrowUpRight, Search,
  ShieldCheck, Clock, Zap, Cpu, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

interface ScanResultModalProps {
  scanId: string | null;
  onClose: () => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({ scanId, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scanData, setScanData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'vulns' | 'logs' | 'overview'>('vulns');
  const [vulnSearch, setVulnSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);

  useEffect(() => {
    if (!scanId) return;
    let isMounted = true;

    const fetchScanData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res: any = await apiClient.get(`/scans/${scanId}`);
        const data = res?.data?.data || res?.data || res;
        if (isMounted) {
          setScanData(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'فشل جلب تفاصيل ونتائج الفحص الأمني.');
          setLoading(false);
        }
      }
    };

    fetchScanData();
    const interval = setInterval(fetchScanData, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [scanId]);

  if (!scanId) return null;

  const handleCopyLogs = () => {
    const logsText = (scanData?.scannerLogs || []).join('\n');
    navigator.clipboard.writeText(logsText);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const handleDownloadLogs = () => {
    const logsText = (scanData?.scannerLogs || []).join('\n');
    const blob = new Blob([logsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scan-logs-${scanId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const vulnsList: any[] = scanData?.vulnerabilities || [];

  const filteredVulns = vulnsList.filter((v: any) => {
    const matchesSearch = !vulnSearch.trim() || 
      (v.title && v.title.toLowerCase().includes(vulnSearch.toLowerCase())) ||
      (v.location && v.location.toLowerCase().includes(vulnSearch.toLowerCase())) ||
      (v.description && v.description.toLowerCase().includes(vulnSearch.toLowerCase()));

    const sevUpper = (v.severity || 'Medium').toUpperCase();
    const matchesSeverity = severityFilter === 'ALL' || sevUpper === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('crit') || s.includes('حرج')) return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">حرج (Critical)</Badge>;
    if (s.includes('high') || s.includes('عال')) return <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-amber-500/30">عالي (High)</Badge>;
    if (s.includes('med') || s.includes('متوسط')) return <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">متوسط (Medium)</Badge>;
    return <Badge variant="outline" className="text-slate-400 border-slate-700">منخفض (Low)</Badge>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 text-right overflow-y-auto" dir="rtl">
      <div className="bg-[#0a0f1c] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Radar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  نتائج وتقرير الفحص الأمني - {scanData?.targetName || 'الهدف المحدد'}
                </h2>
                {scanData?.status === 'Completed' || scanData?.status === 'مكتمل' ? (
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> مكتمل بنجاح
                  </Badge>
                ) : scanData?.status === 'Scanning' || scanData?.status === 'Analyzing' ? (
                  <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 gap-1 animate-pulse">
                    <Zap className="h-3.5 w-3.5" /> جاري الفحص المباشر ({scanData?.progress || 0}%)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-500/40 text-slate-400 bg-slate-500/10">
                    متوقف / ملغى
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3">
                <span className="font-mono text-cyan-400">{scanId}</span>
                <span>•</span>
                <span>تاريخ البدء: {scanData?.startedAt ? new Date(scanData.startedAt).toLocaleString('ar-SA') : 'مؤخراً'}</span>
              </p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading && !scanData ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
              <div className="h-8 w-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
              <p className="text-sm">جاري تحليل جلب واستخراج كافة مخرجات ونتائج الفحص الأمني...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Summary Score Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-xs font-medium text-slate-400 mb-1">إجمالي المكتشفات</span>
                  <span className="text-2xl font-black text-white">
                    {vulnsList.length || 0}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-red-500/30 rounded-xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-xs font-medium text-red-400 mb-1">حرجة (Critical)</span>
                  <span className="text-2xl font-black text-red-400">
                    {vulnsList.filter(v => (v.severity || '').toLowerCase().includes('crit')).length}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-xs font-medium text-amber-400 mb-1">عالية (High)</span>
                  <span className="text-2xl font-black text-amber-400">
                    {vulnsList.filter(v => (v.severity || '').toLowerCase().includes('high')).length}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-xs font-medium text-slate-400 mb-1">متوسطة (Medium)</span>
                  <span className="text-2xl font-black text-slate-300">
                    {vulnsList.filter(v => (v.severity || '').toLowerCase().includes('med')).length}
                  </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center text-center col-span-2 sm:col-span-1">
                  <span className="text-xs font-medium text-emerald-400 mb-1">نسبة إنجاز الفحص</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    {scanData?.progress || 100}%
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('vulns')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === 'vulns' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>الثغرات المكتشفة ({vulnsList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === 'logs' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  <span>سجل الطرفية المحاكي (Terminal Logs)</span>
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Radar className="h-4 w-4" />
                  <span>محركات الفحص والأصل</span>
                </button>
              </div>

              {/* TAB 1: Vulnerabilities List */}
              {activeTab === 'vulns' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="ابحث داخل ثغرات هذا الفحص..." 
                        value={vulnSearch}
                        onChange={(e) => setVulnSearch(e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-800 bg-slate-900/60 pr-9 pl-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
                      />
                    </div>
                    
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                      {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                            severityFilter === sev 
                              ? 'bg-cyan-600 text-white' 
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {sev === 'ALL' ? 'الكل' : sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredVulns.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center space-y-3">
                      <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto opacity-80" />
                      <h4 className="text-base font-bold text-slate-200">لم يتم العثور على ثغرات مطابقة للبحث أو التصفية</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        الهدف محمي ولم تسجل محركات الفحص ثغرات إضافية في هذا المرشح، أو أن الفحص لا يزال يجري الفحوصات العميقة.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredVulns.map((v: any, idx: number) => (
                        <Card key={`vuln-detail-${v.id}-${idx}`} className="bg-slate-900/50 border-slate-800/80 hover:border-slate-700 transition-all overflow-hidden">
                          <CardHeader className="p-4 bg-slate-950/40 border-b border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 shrink-0">
                                {getSeverityBadge(v.severity)}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-100 text-sm sm:text-base">{v.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">{v.location || 'نقطة النهاية'}</span>
                                  {v.cvssScore && (
                                    <span className="font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">CVSS: {v.cvssScore}</span>
                                  )}
                                  {v.complianceMapping?.owasp && (
                                    <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded text-[11px]">{v.complianceMapping.owasp}</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const res: any = await apiClient.post(`/vulnerabilities/${v.id}/ai-analyze`);
                                    const analysisText = res?.data?.data || res?.data || res;
                                    alert(`تحليل الذكاء الاصطناعي لمشكلة (${v.title}):\n\n${typeof analysisText === 'string' ? analysisText : JSON.stringify(analysisText, null, 2)}`);
                                  } catch (err: any) {
                                    alert(err?.message || 'فشل تشغيل تحليل الذكاء الاصطناعي للثغرة');
                                  }
                                }}
                                className="h-8 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-950/30 gap-1"
                              >
                                <span>تحليل بـ Gemini</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const res: any = await apiClient.post(`/vulnerabilities/${v.id}/remediate`);
                                    const data = res?.data?.data || res?.data || res;
                                    alert(`تم الشفاء الذاتي بالذكاء الاصطناعي للثغرة (${v.title})!\nالكود المصحح والآمن:\n\n${data?.patchedCodeSnippet || 'تم إصلاح الكود وتوليد طلب المعالجة بنجاح'}`);
                                    window.location.reload();
                                  } catch (err: any) {
                                    alert(err?.message || 'فشل تنفيذ الشفاء الذاتي بالذكاء الاصطناعي');
                                  }
                                }}
                                className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30 gap-1"
                              >
                                <span>شفاء ذاتي بالـ AI</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate('/vulnerabilities')}
                                className="h-8 text-xs text-slate-400 hover:text-white"
                              >
                                معالجة في الثغرات <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                              </Button>
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 space-y-3 text-xs sm:text-sm text-slate-300">
                            <div>
                              <strong className="text-slate-400 block mb-1">وصف الثغرة وطريقة الاستغلال:</strong>
                              <p className="leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-slate-300">
                                {v.description}
                              </p>
                            </div>

                            {v.impact && (
                              <div>
                                <strong className="text-amber-400 block mb-1">الأثر والتداعيات الأمنية:</strong>
                                <p className="leading-relaxed text-slate-400">
                                  {v.impact}
                                </p>
                              </div>
                            )}

                            {v.remediation && (
                              <div>
                                <strong className="text-emerald-400 block mb-1">التوصية البرمجية وحل المعالجة:</strong>
                                <div className="bg-[#030712] p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap ltr text-left" dir="ltr">
                                  {v.remediation}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Terminal Logs */}
              {activeTab === 'logs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">سجل أحداث مخرجات المحرك المباشرة (Scanner Engine Console Output):</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleCopyLogs}
                        className="h-8 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedLogs ? 'تم النسخ!' : 'نسخ السجل'}</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleDownloadLogs}
                        className="h-8 text-xs border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>تحميل TXT</span>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#030712] rounded-xl p-4 font-mono text-xs text-slate-300 h-96 overflow-y-auto border border-slate-800 leading-relaxed flex flex-col text-left ltr space-y-1 shadow-inner" dir="ltr">
                    {(scanData?.scannerLogs || []).length === 0 ? (
                      <span className="text-slate-500 italic">[SYSTEM] No terminal execution logs captured yet...</span>
                    ) : (
                      (scanData?.scannerLogs || []).map((log: string, i: number) => (
                        <div key={i} className={
                          log.includes('CRITICAL') || log.includes('ERR') || log.includes('!]') ? 'text-red-400 font-bold' : 
                          log.includes('Completed') || log.includes('FOUND') || log.includes('OK') ? 'text-emerald-400' : 
                          log.includes('Starting') || log.includes('Running') ? 'text-cyan-300' : 'text-slate-400'
                        }>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="p-4 border-b border-slate-800">
                      <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <Radar className="h-4 w-4 text-cyan-400" />
                        بيانات الهدف ونطاق التدقيق
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between border-b border-slate-800/60 pb-2">
                        <span className="text-slate-400">اسم الهدف:</span>
                        <span className="font-bold text-white">{scanData?.targetName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-2">
                        <span className="text-slate-400">معرف الهدف الداخلي:</span>
                        <span className="font-mono text-slate-300">{scanData?.targetId}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/60 pb-2">
                        <span className="text-slate-400">حالة الفحص الحالية:</span>
                        <span className="font-medium text-cyan-400">{scanData?.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">التقدم الإجمالي:</span>
                        <span className="font-mono text-emerald-400 font-bold">{scanData?.progress}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="p-4 border-b border-slate-800">
                      <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-indigo-400" />
                        محركات الفحص المشغلة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2 p-2 bg-slate-950/60 rounded border border-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-slate-200 block">Nmap Infrastructure Scanner</strong>
                          <span className="text-slate-400 text-[11px]">فحص المنافذ المفتوحة وبنية الخدمات TCP/UDP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-950/60 rounded border border-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-slate-200 block">Nuclei Vulnerability Engine</strong>
                          <span className="text-slate-400 text-[11px]">4,300+ قالب ثغرات أمنية وCVEs محدثة</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-950/60 rounded border border-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-slate-200 block">OWASP ZAP Active Auditor</strong>
                          <span className="text-slate-400 text-[11px]">اختبار حقن مدخلات الويب وثغرات XSS / CSRF</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => {
                onClose();
                navigate('/reports');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 text-xs sm:text-sm flex-1 sm:flex-none justify-center"
            >
              <FileText className="h-4 w-4" />
              <span>استوديو التقارير (Reports Studio)</span>
            </Button>
            <Button 
              onClick={() => {
                onClose();
                navigate('/vulnerabilities');
              }}
              variant="outline" 
              className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2 text-xs sm:text-sm flex-1 sm:flex-none justify-center"
            >
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              <span>إدارة كافة الثغرات</span>
            </Button>
          </div>

          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-slate-800 text-xs sm:text-sm"
          >
            إغلاق النافذة
          </Button>
        </div>

      </div>
    </div>
  );
};
