import React from 'react';
import { Activity, Clock, CheckCircle2, ShieldAlert, FileText, UserCheck } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const AuditLogsPage: React.FC = () => {
  const activities = [
    { time: '10:45', action: 'Developer fixed issue', detail: 'تم إغلاق ثغرة SQL Injection في CRM API برقم #VULN-8921', user: 'Eng. Ahmed', status: 'Success' },
    { time: '10:40', action: 'Report generated', detail: 'توليد تقرير أمني تنفيذي للربع الثالث بواسطة Report Agent', user: 'Report Agent (AI)', status: 'Info' },
    { time: '10:35', action: 'New vulnerability discovered', detail: 'اكتشاف ثغرةJWT Authentication Bypass على api.company.com', user: 'Scanner Agent (AI)', status: 'Warning' },
    { time: '10:32', action: 'AI Agent started scan', detail: 'بدء مهمة فحص الأصول التلقائي لمستودعات الإنتاج', user: 'System Worker', status: 'Info' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Activity & Audit Center (سجل الأنشطة والعمليات الأمنية)
        </h2>
        <p className="text-xs text-slate-400 mt-1">تتبع التغيرات، القرارات الأمنية، وإجراءات المعالجة الحية لجميع أعضاء الفريق والوكلاء</p>
      </div>

      {/* TIMELINE */}
      <Card variant="default">
        <div className="space-y-4">
          {activities.map((act, index) => (
            <div key={index} className="flex gap-4 items-start p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="font-mono text-xs text-cyan-400 font-bold px-2 py-1 bg-slate-900 rounded border border-slate-800">
                {act.time}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{act.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">By: {act.user}</span>
                </div>
                <p className="text-xs text-slate-300">{act.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
