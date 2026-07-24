import React, { useState } from 'react';
import { Globe, Server, Code, Smartphone, Cpu, ShieldAlert, Zap, Network, ArrowRight } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const AttackSurfacePage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('api-gateway');

  const nodes = [
    { id: 'web-app', label: 'Main Web Portal', type: 'Domain', status: 'Exposed', risk: 'Medium', ip: '104.21.45.12', detail: 'Public entry point with Cloudflare WAF protection.' },
    { id: 'api-gateway', label: 'CRM API Gateway', type: 'API', status: 'Vulnerable', risk: 'Critical', ip: '192.168.1.100', detail: 'Exposes 89 endpoints. Detected JWT signature bypass risk.' },
    { id: 'cloud-aws', label: 'AWS Prod Cluster', type: 'Cloud', status: 'Monitored', risk: 'Low', ip: '10.0.4.15', detail: 'EKS Cluster running 14 microservices.' },
    { id: 'mobile-api', label: 'Mobile App Auth', type: 'Mobile Endpoint', status: 'Secured', risk: 'Low', ip: '172.16.0.4', detail: 'OAuth 2.0 PKCE authentication server.' },
    { id: 'db-master', label: 'PostgreSQL DB Master', type: 'Database', status: 'Internal', risk: 'High', ip: '10.0.2.88', detail: 'Contains customer PII data. Protected by VPC security groups.' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            Attack Surface & Internet Exposure (خريطة السطح الهجومي والأصول)
          </h2>
          <p className="text-xs text-slate-400 mt-1">تتبع الاتصالات المسارات والمخاطر لجميع الأصول المكشوفة على شبكة إنترنت المؤسسة</p>
        </div>
      </div>

      {/* EXPOSURE COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Domains', count: 126, icon: Globe, color: 'text-cyan-400' },
          { label: 'Subdomains', count: 432, icon: Server, color: 'text-purple-400' },
          { label: 'APIs', count: 89, icon: Code, color: 'text-amber-400' },
          { label: 'Cloud Assets', count: 54, icon: Cpu, color: 'text-emerald-400' },
          { label: 'Mobile Apps', count: 12, icon: Smartphone, color: 'text-rose-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} variant="default" className="p-4 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-2xl font-black text-white font-mono">{item.count}</div>
            </Card>
          );
        })}
      </div>

      {/* INTERACTIVE ATTACK SURFACE NETWORK GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRAPH CANVAS (8 cols) */}
        <Card title="Topology Exposure Paths (مسارات التعرض والربط الأمني)" className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-[#070B14] rounded-xl border border-slate-800 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(#00a8ff15_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center gap-8 py-4">
              
              {/* Internet Exposure Node */}
              <div className="px-4 py-2 bg-red-950/80 border border-red-500/50 rounded-xl text-center space-y-0.5 animate-pulse shadow-lg shadow-red-500/10">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Public Internet Access</span>
                <span className="text-xs font-black text-white font-mono">0.0.0.0 / 0</span>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 via-amber-500 to-cyan-500"></div>

              {/* Interactive Target Nodes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {nodes.slice(0, 3).map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedNode === node.id 
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-xl shadow-cyan-500/20' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-cyan-400">{node.type}</span>
                      <Badge variant={node.risk === 'Critical' ? 'danger' : node.risk === 'High' ? 'warning' : 'info'}>
                        {node.risk}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2">{node.label}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">{node.ip}</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="relative z-10 flex justify-between items-center border-t border-slate-800/80 pt-3 text-[10px] text-slate-400 font-mono">
              <span>Path Validation: Active Real-Time Topology</span>
              <span className="text-cyan-400">Sniper Network Intelligence</span>
            </div>
          </div>
        </Card>

        {/* NODE INSPECTOR PANEL (4 cols) */}
        <Card title="Node Inspector (تفاصيل الأصل المباشرة)" className="lg:col-span-4 space-y-4">
          {selectedNode ? (() => {
            const node = nodes.find(n => n.id === selectedNode) || nodes[0];
            return (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{node.label}</span>
                    <Badge variant={node.risk === 'Critical' ? 'danger' : 'info'}>{node.status}</Badge>
                  </div>
                  <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                    <div><strong className="text-slate-400">Type: </strong>{node.type}</div>
                    <div><strong className="text-slate-400">IP: </strong>{node.ip}</div>
                    <div><strong className="text-slate-400">Risk Level: </strong><span className="text-red-400">{node.risk}</span></div>
                  </div>
                  <p className="text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                    {node.detail}
                  </p>
                </div>

                <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-purple-300 space-y-1">
                  <span className="font-bold text-white block">AI Exposure Analysis:</span>
                  <span>المنفذ 443 و 80 مفتوحان مع وجود مسار وصول مباشر لقاعدة البيانات دون وجود WAF على المستوى المحلي.</span>
                </div>
              </div>
            );
          })() : (
            <p className="text-xs text-slate-500 italic py-8 text-center">اضغط على أي عقدة شبكية لمعاينة التفاصيل ومسار التعرض.</p>
          )}
        </Card>

      </div>

    </div>
  );
};
