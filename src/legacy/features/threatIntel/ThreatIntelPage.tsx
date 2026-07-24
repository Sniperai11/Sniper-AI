import React from 'react';
import { ShieldAlert, AlertTriangle, Radio, TrendingUp, Cpu, Lock, ArrowUpRight } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const ThreatIntelPage: React.FC = () => {
  const alerts = [
    {
      id: 'CVE-2026-9041',
      title: 'New High Impact Zero-Day in Enterprise API Gateways',
      severity: 'Critical (9.8)',
      affected: '3 أصول مسجلة لديك (CRM API, Auth Service, Billing)',
      summary: 'تم اكتشاف ثغرة تجاوز مصادقة جديدة في بروتوكولات JWT تؤثر على بيئات Node.js و Laravel.',
      action: 'تطبيق الرقعة البرمجية فوراً وتحديث مكتبات المصادقة'
    },
    {
      id: 'DARKWEB-ALERT-89',
      title: 'Dark Web Intelligence: Leaked Credentials Leak Match',
      severity: 'High (8.4)',
      affected: 'نطاق company.com',
      summary: 'تم العثور على 14 اسم مستخدم وهاش كلمة مرور مسربة في منتديات الدارك ويب الخاصة بشركتك.',
      action: 'إعادة تعيين كلمات المرور القسرية وتفعيل الـ MFA'
    }
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
          Threat Intelligence Center (استخبارات التهديدات والأمن الاستباقي)
        </h2>
        <p className="text-xs text-slate-400 mt-1">تتبع التهديدات العالمية، اتجاهات الـ Exploits التابعة لأصولك، وتنبيهات تسريبات الدارك ويب المباشرة</p>
      </div>

      {/* THREAT ALERTS */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} variant="default" className="border-r-4 border-r-rose-500 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">{alert.title}</h3>
              </div>
              <Badge variant="danger">{alert.severity}</Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {alert.summary}
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs pt-2 border-t border-slate-800/80">
              <span className="text-amber-300 font-medium">الأصول المتأثرة: {alert.affected}</span>
              <span className="text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-500/20">
                إجراء موصى به: {alert.action}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* CVE EXPLORER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Exploit Trends (اتجاهات الثغرات المستغلة عالمياً)">
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">SQL Injection via ORM Bypass</span>
                <span className="text-[10px] text-slate-400">زيادة بنسبة 42% في المحاولات العالمية هذا الأسبوع</span>
              </div>
              <Badge variant="danger">High Activity</Badge>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">OAuth 2.0 PKCE Hijacking</span>
                <span className="text-[10px] text-slate-400">استهداف تطبيقات الهواتف الذكية الحديثة</span>
              </div>
              <Badge variant="warning">Moderate</Badge>
            </div>
          </div>
        </Card>

        <Card title="Dark Web Monitoring Status (حالة مراقبة التسريبات)">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-emerald-300 font-bold">
              <span>حالة المراقبة: نشطة (Realtime Pulse)</span>
              <Badge variant="success">Active Protection</Badge>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              يقوم Sniper AI بمسح المستودعات المفتوحة، ملفات .env المسربة، والمنتديات المغلقة للبحث عن أي نطاق أو مفاتيح API تابعة لشركتك.
            </p>
          </div>
        </Card>
      </div>

    </div>
  );
};
