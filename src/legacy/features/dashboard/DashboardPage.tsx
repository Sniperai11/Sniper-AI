import React from 'react';
import { 
  ShieldAlert, Activity, CheckCircle,
  Terminal, Lock, Globe, Server, AlertTriangle
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge, SeverityBadge } from '../../shared/components/Badge';

export interface DashboardPageProps {
  userProfile: any;
  userMode: 'enterprise' | 'hunter';
  projects: any[];
  vulnerabilities: any[];
  activeScans: any[];
  auditLogs: any[];
  onTriggerScan: (targetId: string, options?: any) => void;
  onOpenSelfHealing: (findingId: string) => void;
  onOpenAddProject: () => void;
  onOpenAddTarget: () => void;
  onVerifyOwnership: (target: any) => void;
  onOpenTerminal: (scanJobId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userMode,
  projects = [],
  vulnerabilities = [],
  activeScans = [],
  onOpenSelfHealing,
}) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeVulns = Array.isArray(vulnerabilities) ? vulnerabilities : [];
  const safeActiveScans = Array.isArray(activeScans) ? activeScans : [];

  const allTargets = safeProjects.reduce((acc: any[], p: any) => [...acc, ...(Array.isArray(p?.targets) ? p.targets : [])], []);
  const activeVulns = safeVulns.filter((v: any) => !v?.isFalsePositive);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* ENTERPRISE SECURITY POSTURE (TOP SECTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* POSTURE SCORE */}
        <Card className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900 border-slate-800">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white">Security Posture</h3>
            <span className="text-xs text-slate-400">Enterprise Risk Assessment</span>
          </div>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            {/* Circular Progress SVG */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" className="text-slate-800" strokeWidth="12" stroke="currentColor" fill="transparent" />
              <circle cx="80" cy="80" r="70" className="text-emerald-500" strokeWidth="12" strokeDasharray="440" strokeDashoffset="80" strokeLinecap="round" stroke="currentColor" fill="transparent" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white">82</span>
              <span className="text-xs font-bold text-emerald-400">/100 (GOOD)</span>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-xs p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Risk Level</span>
              <span className="text-amber-400 font-bold">Medium</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-500">Last Assessment</span>
              <span className="text-white font-bold">5 minutes ago</span>
            </div>
          </div>
        </Card>

        {/* ATTACK SURFACE OVERVIEW */}
        <Card className="lg:col-span-8 p-6 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Attack Surface Overview (السطح الهجومي)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Internet-facing infrastructure and digital footprint</p>
            </div>
            <Badge variant="warning">Internet Exposure: High</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-white font-mono">126</span>
              <span className="text-xs text-slate-400 font-bold">Domains</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-white font-mono">432</span>
              <span className="text-xs text-slate-400 font-bold">Subdomains</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-white font-mono">89</span>
              <span className="text-xs text-slate-400 font-bold">Active APIs</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-white font-mono">54</span>
              <span className="text-xs text-slate-400 font-bold">Cloud Assets</span>
            </div>
          </div>

          {/* Mini Graph Visualization */}
          <div className="h-24 w-full bg-[#080C16] border border-slate-800/50 rounded-xl relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(#00a8ff15_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
             <div className="relative z-10 flex items-center gap-8 text-cyan-500/30">
                {/* Visual nodes representing the network */}
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500/50 flex items-center justify-center bg-cyan-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
                <div className="w-16 h-0.5 bg-cyan-500/30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-purple-950 shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>
                <div className="w-16 h-0.5 bg-purple-500/30"></div>
                <div className="w-6 h-6 rounded-full border-2 border-rose-500/50 flex items-center justify-center bg-rose-950 shadow-[0_0_15px_rgba(244,63,94,0.3)]"></div>
             </div>
             <div className="absolute bottom-2 right-3 text-[9px] text-slate-500 font-mono">Exposure Paths Visualized</div>
          </div>
        </Card>
      </div>

      {/* RECENT VULNERABILITIES & ACTIVE INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card title="Critical Incidents (حوادث نشطة)" className="space-y-4">
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-3">
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-sm font-bold text-white">SQL Injection Detected</h4>
                 <p className="text-[10px] text-slate-400 mt-0.5">Affected Asset: CRM API (api.company.com/v1/users)</p>
               </div>
               <Badge variant="danger">9.8 CRITICAL</Badge>
             </div>
             
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                 <span className="text-slate-500 block mb-1">Business Impact</span>
                 <span className="text-rose-400 font-bold">Customer Database Exposure</span>
               </div>
               <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                 <span className="text-slate-500 block mb-1">Exploitability</span>
                 <span className="text-amber-400 font-bold">High (Active PoC)</span>
               </div>
             </div>

             <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
               <span className="text-xs text-slate-300 font-bold">AI Recommendation: Patch within 24h</span>
               <Button onClick={() => onOpenSelfHealing('vuln-1')} size="sm" variant="ghost" className="text-cyan-400 h-7 text-xs">
                 <Lock className="w-3 h-3 ml-1" /> Fix Vulnerability
               </Button>
             </div>
          </div>
        </Card>

        {/* AI SECURITY AGENTS STATUS */}
        <Card title="Sniper AI Agents (المحلل الآلي)" className="space-y-3">
           <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-950/40 text-emerald-400 rounded-lg border border-emerald-500/20"><Activity className="w-4 h-4" /></div>
               <div>
                 <h5 className="text-xs font-bold text-white">Recon Agent</h5>
                 <span className="text-[10px] text-slate-400">Discovering hidden assets</span>
               </div>
             </div>
             <span className="text-xs font-bold text-emerald-400 font-mono animate-pulse">Running</span>
           </div>

           <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-950/40 text-amber-400 rounded-lg border border-amber-500/20"><ShieldAlert className="w-4 h-4" /></div>
               <div>
                 <h5 className="text-xs font-bold text-white">Vulnerability Agent</h5>
                 <span className="text-[10px] text-slate-400">Scanning CRM endpoints</span>
               </div>
             </div>
             <span className="text-xs font-bold text-amber-400 font-mono">Monitoring</span>
           </div>

           <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-rose-950/40 text-rose-400 rounded-lg border border-rose-500/20"><AlertTriangle className="w-4 h-4" /></div>
               <div>
                 <h5 className="text-xs font-bold text-white">Threat Analyst</h5>
                 <span className="text-[10px] text-slate-400">Analyzing dark web intelligence</span>
               </div>
             </div>
             <span className="text-xs font-bold text-rose-400 font-mono">Active Threat</span>
           </div>
        </Card>

      </div>
    </div>
  );
};
