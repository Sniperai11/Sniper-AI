import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Bot, Search, Filter, MoreVertical, 
  Activity, Zap, Shield, Play, Pause, Code,
  CheckCircle, Clock, Cpu, Network
} from 'lucide-react';
import { useAgentStream } from '../hooks/realtime';

// Base static agents to merge with live data
const baseAgents = [
  { id: 'AGT-01', name: 'Reconnaissance Agent', type: 'Discovery', tasks: 124, lastActive: 'Just now', description: 'Continuously monitors subdomains, open ports, and new digital footprint.' },
  { id: 'AGT-02', name: 'Auto-Triage Agent', type: 'Analysis', tasks: 342, lastActive: '2 mins ago', description: 'Filters out false positives and verifies vulnerabilities via safe exploitation.' },
  { id: 'AGT-03', name: 'Remediation Bot', type: 'Response', tasks: 45, lastActive: '1 hour ago', description: 'Generates patch code (AST) and PRs for verified vulnerabilities.' },
  { id: 'AGT-04', name: 'Threat Intel Scraper', type: 'Intelligence', tasks: 89, lastActive: '5 mins ago', description: 'Monitors dark web forums and exploit databases for mentions of company assets.' },
];

export const AIAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const liveAgentStatus = useAgentStream();

  // Merge static base with live statuses
  const agents = baseAgents.map(agent => {
    const live = liveAgentStatus[agent.id];
    return {
      ...agent,
      status: live?.status || (agent.id === 'AGT-03' ? 'Idle' : 'Active'),
      currentTask: live?.currentTask || (agent.id !== 'AGT-03' ? 'Monitoring designated scopes' : 'Waiting for verified alerts'),
      cpuUsage: live?.cpuUsage || Math.floor(Math.random() * 30 + 10),
      memoryUsage: live?.memoryUsage || Math.floor(Math.random() * 40 + 20),
    };
  });

  const activeAgentsCount = agents.filter(a => a.status === 'Active').length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasks, 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            AI Security Agents
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage autonomous agents performing continuous security tasks</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-cyan-600 hover:bg-cyan-500 text-white border-0">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Deploy Agent</span>
            <span className="sm:hidden">Deploy</span>
          </Button>
        </div>
      </div>

      {/* Mobile-Optimized Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Bot className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Active Agents</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-xl sm:text-3xl font-black text-cyan-400">{activeAgentsCount}</span>
            <span className="text-sm font-medium text-slate-500 mb-1">/ {agents.length}</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Activity className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Tasks Executed</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">{totalTasks.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Cpu className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Compute Load</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">
            {Math.floor(agents.reduce((acc, a) => acc + (a.cpuUsage || 0), 0) / agents.length)}%
          </span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Shield className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Threats Mitigated</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">142</span>
        </div>
      </div>

      {/* Agents Grid (Cards for both mobile and desktop here) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/30 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${agent.status === 'Active' ? 'bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40' : 'bg-slate-800 border-slate-700'}`}>
                    <Bot className={`h-6 w-6 sm:h-7 sm:w-7 ${agent.status === 'Active' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-400">{agent.type}</span>
                      <span className="text-slate-700 hidden sm:inline">•</span>
                      <span className="text-[10px] sm:text-xs font-mono text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800/50">{agent.id}</span>
                    </div>
                  </div>
                </div>
                {agent.status === 'Active' ? (
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shrink-0 self-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse mr-1.5 inline-block"></span>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-500/30 text-slate-400 bg-slate-500/10 shrink-0 self-start">
                    {agent.status}
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-900/50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">Current Task</span>
                <span className="text-sm text-cyan-300 font-mono flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                  {agent.currentTask}
                </span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU</span>
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-amber-400" />
                    {agent.cpuUsage}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">RAM</span>
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5 text-purple-400" />
                    {agent.memoryUsage}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tasks</span>
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    {agent.tasks}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active</span>
                  <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    {agent.lastActive}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
                {agent.status === 'Active' ? (
                  <Button size="sm" variant="outline" className="h-9 flex-1 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                    <Pause className="h-3.5 w-3.5 mr-1.5 fill-current" /> Pause
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="h-9 flex-1 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                    <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Resume
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-9 flex-1 text-xs bg-transparent border-slate-700 text-slate-300 hover:text-white">
                  <Code className="h-3.5 w-3.5 mr-1.5" /> Logs
                </Button>
                <Button size="icon" variant="outline" className="h-9 w-9 shrink-0 bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white">
                  <MoreVertical className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
