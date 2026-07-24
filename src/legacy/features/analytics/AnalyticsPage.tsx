import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Activity, Globe, PieChart } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Security Analytics & Intelligence (تحليلات الأمان والمؤشرات)
        </h2>
        <p className="text-xs text-slate-400 mt-1">مؤشرات الأداء السيبراني، منحنيات اكتشاف معالجة الثغرات، وتحليلات الأصول الأكثر تعرضاً للمخاطر</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default">
          <span className="text-xs font-bold text-slate-400 block">Total Scans Run</span>
          <div className="text-2xl font-black text-white mt-1">1,248</div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">↑ +18% هذا الشهر</span>
        </Card>

        <Card variant="default">
          <span className="text-xs font-bold text-slate-400 block">Mean Time to Remediate (MTTR)</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">4.2 Hours</div>
          <span className="text-[10px] text-emerald-400 block mt-0.5">↓ -35% بفضل الذكاء الاصطناعي</span>
        </Card>

        <Card variant="default">
          <span className="text-xs font-bold text-slate-400 block">Vulnerabilities Patched</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">112</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">ثغرة معالجة تلقائياً</span>
        </Card>

        <Card variant="default">
          <span className="text-xs font-bold text-slate-400 block">Risk Score Trend</span>
          <div className="text-2xl font-black text-purple-400 mt-1">82 / 100</div>
          <span className="text-[10px] text-purple-300 block mt-0.5">تحسن مستمر في الأداء</span>
        </Card>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Security Trends Chart */}
        <Card title="Security Trends & Monthly Scans (اتجاهات الأمان والفحوصات الشهرية)">
          <div className="p-4 bg-[#070B14] rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span>الفحوصات المكتملة شهرياً</span>
              <span className="text-cyan-400 font-mono font-bold">Q1 - Q3 2026</span>
            </div>

            {/* Simulated Bar Visual */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { month: 'Jan', count: 45, height: '35%' },
                { month: 'Feb', count: 78, height: '55%' },
                { month: 'Mar', count: 120, height: '75%' },
                { month: 'Apr', count: 95, height: '60%' },
                { month: 'May', count: 160, height: '90%' },
                { month: 'Jun', count: 210, height: '100%' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[9px] text-slate-400 font-mono">{bar.count}</span>
                  <div className="w-full bg-slate-900 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t-lg transition-all duration-500 hover:brightness-125" 
                      style={{ height: bar.height }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Vulnerable Assets */}
        <Card title="Top Vulnerable Assets (أكثر الأصول تعرضاً للمخاطر)">
          <div className="p-4 bg-[#070B14] rounded-xl border border-slate-800 space-y-3">
            {[
              { name: 'api.banking-system.com', count: 5, risk: 'Critical', color: 'red' },
              { name: 'portal.company.com', count: 3, risk: 'High', color: 'orange' },
              { name: 'payment-gateway-service', count: 2, risk: 'Medium', color: 'amber' },
              { name: 'auth-identity-server', count: 1, risk: 'Low', color: 'slate' }
            ].map((asset, idx) => (
              <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{asset.name}</h4>
                  <span className="text-[10px] text-slate-400">{asset.count} ثغرة نشطة بحاجة لمعالجة</span>
                </div>
                <Badge variant={asset.risk === 'Critical' ? 'danger' : asset.risk === 'High' ? 'warning' : 'info'}>
                  {asset.risk}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};
