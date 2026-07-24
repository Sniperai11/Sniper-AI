import React from 'react';
import { Award, CheckCircle2, AlertCircle, ShieldCheck, FileCheck } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export interface CompliancePageProps {
  userProfile?: any;
  vulnerabilities?: any[];
}

export const CompliancePage: React.FC<CompliancePageProps> = ({ userProfile, vulnerabilities }) => {
  const frameworks = [
    { name: 'ISO 27001:2022', score: 78, missing: 14, status: 'In Progress', color: 'from-cyan-500 to-blue-500' },
    { name: 'OWASP ASVS v4.0', score: 85, missing: 8, status: 'Compliant', color: 'from-emerald-500 to-teal-500' },
    { name: 'PCI DSS v4.0', score: 62, missing: 22, status: 'Needs Review', color: 'from-amber-500 to-orange-500' },
    { name: 'SOC 2 Type II', score: 91, missing: 4, status: 'Compliant', color: 'from-purple-500 to-indigo-500' },
    { name: 'NIST Cybersecurity Framework (CSF)', score: 74, missing: 16, status: 'In Progress', color: 'from-rose-500 to-red-500' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          Enterprise Compliance Center (مركز الامتثال والمعايير الدولية)
        </h2>
        <p className="text-xs text-slate-400 mt-1">قياس التوافق مع المعايير الأمنية العالمية وتقييم الفجوات التنظيمية</p>
      </div>

      {/* FRAMEWORKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {frameworks.map((fw, i) => (
          <Card key={i} variant="default" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">{fw.name}</h3>
                <span className="text-xs text-slate-400">Missing Controls: <strong className="text-amber-400 font-mono">{fw.missing}</strong></span>
              </div>
              <Badge variant={fw.score >= 80 ? 'success' : fw.score >= 70 ? 'warning' : 'danger'}>
                {fw.status}
              </Badge>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Compliance Rate</span>
                <span className="text-white font-bold">{fw.score}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className={`bg-gradient-to-r ${fw.color} h-full`} style={{ width: `${fw.score}%` }}></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
              <span>توليد تقرير التوافق المدقق</span>
              <button className="text-cyan-400 font-bold hover:underline">تحميل PDF</button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
