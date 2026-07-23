import React from 'react';
import { Shield, Check, AlertTriangle, Activity, Sliders, Globe } from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Badge } from '../shared/components/Badge';

export interface CompliancePageProps {
  userProfile: any;
  vulnerabilities: any[];
}

export const CompliancePage: React.FC<CompliancePageProps> = ({
  userProfile,
  vulnerabilities = []
}) => {
  const safeVulns = Array.isArray(vulnerabilities) ? vulnerabilities : [];
  const activeVulns = safeVulns.filter(v => !v?.isFalsePositive);
  
  // Compliance counts
  const owaspViolations = activeVulns.filter(v => v?.complianceMapping?.owasp);
  const isoViolations = activeVulns.filter(v => v?.complianceMapping?.iso27001);
  const pciViolations = activeVulns.filter(v => v?.complianceMapping?.pciDss);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white">إدارة الامتثال والمعايير الأمنية (Compliance)</h2>
        <p className="text-xs text-slate-400 mt-1">تتبع مدى توافق الأنظمة والمشاريع مع معايير الحماية الدولية الشهيرة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        
        {/* OWASP Top 10 */}
        <Card title="OWASP Top 10 Compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">حالة الامتثال:</span>
            <Badge variant={owaspViolations.length === 0 ? 'success' : 'danger'}>
              {owaspViolations.length === 0 ? 'مطابق بالكامل' : `${owaspViolations.length} مخالفات`}
            </Badge>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div className={`h-full ${owaspViolations.length === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.max(100 - owaspViolations.length * 10, 0)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">تتبع ثغرات السيطرة على الصلاحيات وحقن الأكواد الضارة والتصاميم غير الآمنة.</p>
        </Card>

        {/* ISO 27001 */}
        <Card title="ISO 27001 Security Standard" className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">حالة الامتثال:</span>
            <Badge variant={isoViolations.length === 0 ? 'success' : 'danger'}>
              {isoViolations.length === 0 ? 'مطابق بالكامل' : `${isoViolations.length} مخالفات`}
            </Badge>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div className={`h-full ${isoViolations.length === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.max(100 - isoViolations.length * 10, 0)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">ضوابط إدارة نقاط الضعف الفنية وحماية الأصول وسرية القنوات المشفرة.</p>
        </Card>

        {/* PCI DSS */}
        <Card title="PCI DSS Payment Gateway Standard" className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">حالة الامتثال:</span>
            <Badge variant={pciViolations.length === 0 ? 'success' : 'danger'}>
              {pciViolations.length === 0 ? 'مطابق بالكامل' : `${pciViolations.length} مخالفات`}
            </Badge>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div className={`h-full ${pciViolations.length === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.max(100 - pciViolations.length * 10, 0)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">تأمين قنوات معالجة البطاقات والتحقق المتبادل لمنع تسريب بيانات الدفع.</p>
        </Card>

      </div>

    </div>
  );
};
