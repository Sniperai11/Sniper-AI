import React from 'react';
import { Sparkles, Bot, ShieldAlert, Cpu, CheckCircle, Clock, Zap } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const SecurityAgentsPage: React.FC = () => {
  const agents = [
    { name: 'Recon Agent', status: 'Running', role: 'مسح واستكشاف النطاقات والأصول المستجدة', activeJobs: 3 },
    { name: 'Vulnerability Agent', status: 'Monitoring', role: 'فحص الشيفرات البرمجية والمنافذ باستمرار', activeJobs: 12 },
    { name: 'Threat Analyst Agent', status: 'Active', role: 'مقارنة الثغرات بقواعد بيانات CVE وسلوك المهاجمين', activeJobs: 5 },
    { name: 'Report Agent', status: 'Ready', role: 'توليد التقارير الأمنية والتحليلات التنفيذية', activeJobs: 0 },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-amber-400" />
          Sniper AI Security Agents (وكلاء الذكاء الاصطناعي الأمني المستقلين)
        </h2>
        <p className="text-xs text-slate-400 mt-1">منظومة الوكلاء المستقلين الذين يعملون على مدار الساعة للرصد والاستجابة التلقائية</p>
      </div>

      {/* AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {agents.map((agent, i) => (
          <Card key={i} variant="default" className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {agent.name}
              </span>
              <Badge variant={agent.status === 'Running' || agent.status === 'Active' ? 'warning' : 'success'}>
                {agent.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{agent.role}</p>
            <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-slate-800">
              Active Monitoring Jobs: {agent.activeJobs}
            </div>
          </Card>
        ))}
      </div>

      {/* AGENT FEATURED FINDING CARD */}
      <Card title="Latest Agent Autonomous Security Finding (اكتشاف أمني مستقل)" className="border-amber-500/30">
        <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/30 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>⚠ Security Finding Alert</span>
          </div>

          <p className="text-slate-200 text-sm leading-relaxed">
            I detected a risky API endpoint.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Asset / الأصل:</span>
              <span className="text-cyan-300 font-bold">api.company.com</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Impact / الأثر:</span>
              <span className="text-rose-400 font-bold">Customer data exposure</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Recommended Priority:</span>
              <span className="text-red-400 font-bold text-sm">P1 (Immediate)</span>
            </div>
          </div>

          <p className="text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
            <strong className="text-white">Reason / السبب: </strong>
            The endpoint is publicly accessible and lacks authorization validation on sensitive profile data route.
          </p>
        </div>
      </Card>

    </div>
  );
};
