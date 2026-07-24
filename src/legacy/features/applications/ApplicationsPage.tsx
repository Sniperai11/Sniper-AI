import React from 'react';
import { Server, ShieldAlert, Cpu, Database, Globe, UserCheck, ArrowUpRight, Lock, Activity } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const ApplicationsPage: React.FC = () => {
  const applications = [
    {
      id: 'crm',
      name: 'CRM System (Enterprise Digital Twin)',
      riskScore: 74,
      status: 'High Risk',
      owner: 'Mohammed Al-Ghamdi (DevSecOps Lead)',
      tech: ['Laravel 10.x', 'MySQL 8.0', 'AWS EC2 / RDS'],
      vulnCounts: { critical: 2, high: 4, medium: 6 },
      lastScan: 'قبل 12 دقيقة'
    },
    {
      id: 'billing',
      name: 'Payment & Billing Portal',
      riskScore: 18,
      status: 'Secured',
      owner: 'Sara Ahmed (Fintech Lead)',
      tech: ['Node.js Express', 'PostgreSQL', 'Stripe API'],
      vulnCounts: { critical: 0, high: 1, medium: 2 },
      lastScan: 'قبل ساعتين'
    },
    {
      id: 'hr-app',
      name: 'Employee HR Management',
      riskScore: 45,
      status: 'Moderate Risk',
      owner: 'Khaled Hassan (System Admin)',
      tech: ['React Single Page', 'Python Django', 'AWS S3'],
      vulnCounts: { critical: 0, high: 2, medium: 5 },
      lastScan: 'أمس'
    }
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Server className="w-6 h-6 text-cyan-400" />
          Asset Intelligence & Digital Twin Infrastructure (التوأم الرقمي للأصول والتطبيقات)
        </h2>
        <p className="text-xs text-slate-400 mt-1">خرائط المكونات التقنية، الملكية، ومعدلات المخاطر البرمجية المباشرة لكل تطبيق مؤسسي</p>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <Card key={app.id} variant="default" className="space-y-4">
            
            {/* Header / Title */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">{app.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">Owner: {app.owner}</span>
              </div>
              <Badge variant={app.riskScore > 50 ? 'danger' : 'success'}>
                Risk: {app.riskScore}%
              </Badge>
            </div>

            {/* Architecture Map visual */}
            <div className="p-3 bg-[#080C16] border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Infrastructure Topology:</span>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px] flex-wrap">
                {app.tech.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Vulnerability Counts */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-red-950/40 border border-red-500/20 rounded-lg">
                <span className="text-red-400 font-bold block">{app.vulnCounts.critical}</span>
                <span className="text-[10px] text-slate-400">حرج (Critical)</span>
              </div>
              <div className="p-2 bg-amber-950/40 border border-amber-500/20 rounded-lg">
                <span className="text-amber-400 font-bold block">{app.vulnCounts.high}</span>
                <span className="text-[10px] text-slate-400">عالي (High)</span>
              </div>
              <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-lg">
                <span className="text-cyan-400 font-bold block">{app.vulnCounts.medium}</span>
                <span className="text-[10px] text-slate-400">متوسط (Med)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>آخر فحص تلقائي: {app.lastScan}</span>
              <button className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                عرض التقرير البرمجي <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};
