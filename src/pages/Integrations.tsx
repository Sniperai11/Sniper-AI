import React, { useState } from 'react';
import { Layers, CheckCircle2, Plus, Zap, Shield, GitBranch, Terminal, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'int-1', name: 'Slack Security Alerts', type: 'تنبيهات', status: 'Connected', desc: 'إرسال تنبيهات الثغرات الحرجة والحوادث مباشرة إلى قنوات Slack' },
    { id: 'int-2', name: 'Jira Software / Security', type: 'تذاكر ودعم', status: 'Connected', desc: 'تحويل الثغرات المكتشفة تلقائياً إلى تذاكر معالجة في Jira' },
    { id: 'int-3', name: 'GitHub Actions / CI Pipeline', type: 'DevSecOps', status: 'Connected', desc: 'فحص الحزم والشيفرة المرفوعة تلقائياً قبل الدمج للـ Main Branch' },
    { id: 'int-4', name: 'SIEM / Splunk Integration', type: 'سجلات SIEM', status: 'Available', desc: 'تصدير سجلات الأمان والأحداث المباشرة لنظام SIEM المركزية' },
    { id: 'int-5', name: 'PagerDuty Incident Dispatch', type: 'إنذار طوارئ', status: 'Available', desc: 'استدعاء مناوبي فريق الاستجابة للحوادث عند اكتشاف هجوم فعال' },
    { id: 'int-6', name: 'WAF Auto-Mitigation (Cloudflare)', type: 'جدار ناري', status: 'Available', desc: 'تحديث قواعد حظر الـ IPs والجمل الخبيثة تلقائياً على خوادم WAF' },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Connected' ? 'Available' : 'Connected'
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            التكاملات والربط مع الأنظمة الخارجية
          </h1>
          <p className="text-sm text-slate-400 mt-1">ربط المنصة مع أدوات CI/CD، منصات إدارة التذاكر Jira/Slack، وأنظمة الاستجابة التلقائية</p>
        </div>
      </div>

      {/* INTEGRATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <Card key={item.id} className="bg-slate-900/40 border-slate-800/60 p-5 flex flex-col justify-between hover:border-slate-700/80 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <span className="text-xs text-slate-500">{item.type}</span>
                  </div>
                </div>
                <Badge variant={item.status === 'Connected' ? 'outline' : 'secondary'} className={item.status === 'Connected' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}>
                  {item.status === 'Connected' ? 'متصل' : 'متاح للربط'}
                </Badge>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleIntegration(item.id)}
                className={`h-8 text-xs font-bold ${item.status === 'Connected' ? 'text-red-400 hover:bg-red-500/10' : 'text-cyan-400 hover:bg-cyan-500/10'}`}
              >
                {item.status === 'Connected' ? 'إلغاء الربط' : 'تفعيل التكامل'}
              </Button>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
