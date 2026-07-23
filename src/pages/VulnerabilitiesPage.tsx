import React, { useState } from 'react';
import { ShieldAlert, Search, RefreshCw, AlertTriangle, Check, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';
import { SeverityBadge } from '../shared/components/Badge';

export interface VulnerabilitiesPageProps {
  vulnerabilities: any[];
  userProfile: any;
  actionLoading: string | null;
  onOpenSelfHealing: (findingId: string) => void;
}

export const VulnerabilitiesPage: React.FC<VulnerabilitiesPageProps> = ({
  vulnerabilities = [],
  userProfile,
  actionLoading,
  onOpenSelfHealing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const safeVulns = Array.isArray(vulnerabilities) ? vulnerabilities : [];

  const filteredVulns = safeVulns.filter(vuln => {
    const matchesSearch = (vuln?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (vuln?.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (vuln?.targetName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || vuln?.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">مركز إدارة ومعالجة الثغرات الأمنية</h2>
          <p className="text-xs text-slate-400 mt-1">تتبع وتدقيق تفاصيل الثغرات المكتشفة، وتشغيل قنوات الترميم الذاتي بالذكاء الاصطناعي</p>
        </div>
        
        {/* FILTERS PANEL */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان أو نوع الثغرة..."
              className="bg-slate-900 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-550 focus:outline-none w-full sm:w-60"
            />
          </div>
          <select 
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="All">كل مستويات الخطورة</option>
            <option value="Critical">حرج (Critical)</option>
            <option value="High">عالٍ (High)</option>
            <option value="Medium">متوسط (Medium)</option>
            <option value="Low">منخفض (Low)</option>
          </select>
        </div>
      </div>

      {/* VULNERABILITIES LIST */}
      {filteredVulns.length === 0 ? (
        <Card className="text-center py-12 text-slate-500 text-xs">
          لم يتم العثور على أي ثغرات تطابق شروط البحث أو الفلترة الحالية.
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVulns.map((vuln) => (
            <Card key={vuln.id} className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{vuln.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{vuln.targetName} • {vuln.location}</p>
                  </div>
                </div>
                <SeverityBadge severity={vuln.severity} />
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
                  <span className="text-[10px] text-slate-500 block">وصف الثغرة:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{vuln.description}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
                  <span className="text-[10px] text-slate-500 block">الحل المقترح (Remediation):</span>
                  <p className="text-emerald-400 leading-relaxed text-[11px] font-mono">{vuln.remediation}</p>
                </div>
              </div>

              {/* COMPLIANCE FOOTER */}
              <div className="flex flex-wrap gap-1.5 border-t border-slate-850 pt-3 text-[9px] text-slate-500">
                <span className="bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">OWASP: {vuln?.complianceMapping?.owasp || 'N/A'}</span>
                <span className="bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">ISO 27001: {vuln?.complianceMapping?.iso27001 || 'N/A'}</span>
                <span className="bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">PCI-DSS: {vuln?.complianceMapping?.pciDss || 'N/A'}</span>
              </div>

              {/* REMEDIATION TRIGGER */}
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => onOpenSelfHealing(vuln.id)}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-cyan-500"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> الترميم الذاتي بالذكاء الاصطناعي (AI Self-Healing)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
