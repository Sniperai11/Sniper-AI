import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Search, Filter, 
  Shield, Info, ArrowUpRight, Sparkles, CheckSquare, Square, Layers, XCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useVulnerabilities } from '../hooks/api/useWorkflows';
import { VulnerabilityWorkflow } from '../api/types/workflows';
import { VulnerabilityDrawer } from '../components/workflows/VulnerabilityDrawer';
import { BulkRemediationModal } from '../components/workflows/BulkRemediationModal';

export const Vulnerabilities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityWorkflow | null>(null);
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const { data: vulnerabilities, isLoading, refetch } = useVulnerabilities({
    search: searchQuery,
    severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
  });

  const isCritical = (v: VulnerabilityWorkflow) => 
    (v.severity || '').toLowerCase().includes('crit') || (v.severity || '').includes('حرج');

  // Calculate dynamic stats from vulnerabilities list
  const criticalCount = vulnerabilities?.filter(isCritical).length || 0;
  const highCount = vulnerabilities?.filter(v => (v.severity || '').toLowerCase().includes('high') || (v.severity || '').includes('عال')).length || 0;
  const resolvedCount = vulnerabilities?.filter(v => v.state === 'Resolved' || v.state === 'Closed' || v.state === 'Mitigated').length || 0;
  const totalCount = vulnerabilities?.length || 0;

  const filteredVulns = vulnerabilities?.filter(vuln => {
    if (!vuln) return false;
    const title = vuln.title || '';
    const id = vuln.id || '';
    const cve = vuln.cve || '';
    const assets = vuln.affectedAssets || [];

    const matchesSearch = !searchQuery || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cve.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assets.some(a => (a || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity = selectedSeverity === 'all' || 
      (vuln.severity || '').toLowerCase().includes(selectedSeverity.toLowerCase());

    return matchesSearch && matchesSeverity;
  });

  const nonCriticalVulns = filteredVulns?.filter(v => !isCritical(v)) || [];
  const selectedNonCriticalVulns = (vulnerabilities || []).filter(v => selectedIds.includes(v.id) && !isCritical(v));

  // Toggle single item selection
  const handleToggleSelect = (vuln: VulnerabilityWorkflow, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCritical(vuln)) {
      setWarningMessage(`الثغرة "${vuln.title}" ذات خطورة حرجة (Critical). وفق دستور Volume XII تتطلب المعالجة المنفردة وتوقيع المسؤول الأمني ولا يمكن دمجها في المعالجة الجماعية.`);
      setTimeout(() => setWarningMessage(null), 5000);
      return;
    }

    setSelectedIds(prev => 
      prev.includes(vuln.id) ? prev.filter(id => id !== vuln.id) : [...prev, vuln.id]
    );
  };

  // Toggle select all non-critical
  const handleSelectAllNonCritical = () => {
    const nonCritIds = nonCriticalVulns.map(v => v.id);
    const allSelected = nonCritIds.length > 0 && nonCritIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !nonCritIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...nonCritIds])));
    }
  };

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
      
      {/* Warning Toast for Critical Item Selection */}
      {warningMessage && (
        <div className="bg-amber-950/90 border border-amber-500/50 p-3.5 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{warningMessage}</span>
          </div>
          <button onClick={() => setWarningMessage(null)} className="text-amber-400 hover:text-white">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>إدارة الثغرات الأمنية</span>
            {selectedNonCriticalVulns.length > 0 && (
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs">
                محدد: {selectedNonCriticalVulns.length}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">متابعة وتصنيف ومعالجة جميع الثغرات البرمجية المكتشفة من الباكند</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Remediate Trigger Button */}
          <Button
            onClick={() => setIsBulkModalOpen(true)}
            disabled={selectedNonCriticalVulns.length === 0}
            className={`gap-2 text-xs font-bold transition-all shadow-lg ${
              selectedNonCriticalVulns.length > 0 
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-900/30 ring-2 ring-cyan-500/30 animate-pulse' 
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>المعالجة الجماعية بالذكاء الاصطناعي (Bulk Remediate)</span>
            {selectedNonCriticalVulns.length > 0 && (
              <span className="bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded-full font-mono text-[10px]">
                {selectedNonCriticalVulns.length}
              </span>
            )}
          </Button>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الثغرة CVE، الأصل، IP..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pr-9 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none text-right"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-10 rounded-md border border-slate-800 bg-slate-900/50 px-3 text-xs text-slate-200 focus:border-cyan-500/50 focus:outline-none text-right cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">جميع المستويات</option>
            <option value="critical" className="bg-slate-900 text-slate-200">حرجة (Critical)</option>
            <option value="high" className="bg-slate-900 text-slate-200">عالية (High)</option>
            <option value="medium" className="bg-slate-900 text-slate-200">متوسطة (Medium)</option>
            <option value="low" className="bg-slate-900 text-slate-200">منخفضة (Low)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-10">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">ثغرات حرجة</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">{criticalCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-10">
            <AlertTriangle className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">خطورة عالية</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">{highCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">معالجة أو مغلقة</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">{resolvedCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -left-2 -top-2 opacity-5">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">إجمالي الثغرات المكتشفة</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">{totalCount}</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-3 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    title="تحديد كل الثغرات غير الحرجة"
                    checked={nonCriticalVulns.length > 0 && nonCriticalVulns.every(v => selectedIds.includes(v.id))}
                    onChange={handleSelectAllNonCritical}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer h-4 w-4"
                  />
                </th>
                <th className="px-4 py-4 font-medium text-right">الثغرة الأمنية</th>
                <th className="px-4 py-4 font-medium text-right">مستوى الخطورة</th>
                <th className="px-4 py-4 font-medium text-right">CVSS</th>
                <th className="px-4 py-4 font-medium text-right">الحالة</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell text-right">الأصل المتأثر</th>
                <th className="px-4 py-4 font-medium hidden md:table-cell text-right">تاريخ الاكتشاف</th>
                <th className="px-4 py-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">جاري تحميل قائمة الثغرات من الخادم...</td>
                </tr>
              ) : filteredVulns && filteredVulns.length > 0 ? (
                filteredVulns.map((vuln, idx) => {
                  const isSelected = selectedIds.includes(vuln.id);
                  const isCrit = isCritical(vuln);

                  return (
                    <tr 
                      key={`vuln-${vuln.id}-${idx}`} 
                      className={`hover:bg-slate-800/30 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-cyan-950/20' : ''
                      }`}
                      onClick={() => setSelectedVuln(vuln)}
                    >
                      <td className="px-3 py-4 text-center" onClick={(e) => handleToggleSelect(vuln, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isCrit}
                          readOnly
                          className={`rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20 h-4 w-4 ${
                            isCrit ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title={isCrit ? 'الثغرات الحرجة تتطلب توقيعاً وتدخلاً منفرداً' : 'تحديد للمعالجة الجماعية'}
                        />
                      </td>
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
                        <div className="truncate max-w-[150px]" title={(vuln.affectedAssets || []).join(', ')}>
                          {(vuln.affectedAssets && vuln.affectedAssets[0]) ? vuln.affectedAssets[0] : 'System Target'} {vuln.affectedAssets && vuln.affectedAssets.length > 1 ? `+${vuln.affectedAssets.length - 1}` : ''}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-400 hidden md:table-cell whitespace-nowrap text-xs">
                        {new Date(vuln.createdAt || Date.now()).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-4 py-4 text-left">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVuln(vuln);
                          }}
                        >
                          معالجة <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">لا توجد ثغرات مطابقة للبحث أو التصفية الحالية.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer Modal for Single Vulnerability */}
      {selectedVuln && (
        <VulnerabilityDrawer 
          vulnerability={selectedVuln} 
          onClose={() => setSelectedVuln(null)} 
        />
      )}

      {/* Bulk Remediation Modal */}
      {isBulkModalOpen && selectedNonCriticalVulns.length > 0 && (
        <BulkRemediationModal
          selectedVulnerabilities={selectedNonCriticalVulns}
          onClose={() => setIsBulkModalOpen(false)}
          onComplete={() => {
            setSelectedIds([]);
            refetch();
          }}
        />
      )}
    </div>
  );
};
