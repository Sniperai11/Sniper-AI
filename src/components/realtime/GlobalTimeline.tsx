import React, { useState } from 'react';
import { useSecurityEvents, useAgentStream, useScanProgress, useNotifications } from '../../hooks/realtime';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, Zap, Target, Bot, FileText, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const GlobalTimeline = () => {
  const securityEvents = useSecurityEvents();
  const agents = useAgentStream();
  const scans = useScanProgress();
  const notifications = useNotifications();

  // Combine and sort events
  const timelineEvents = React.useMemo(() => {
    const combined: any[] = [];
    
    securityEvents.forEach(e => combined.push({
      id: e.id,
      timestamp: e.timestamp,
      type: 'Security',
      title: e.description,
      subtitle: `Source: ${e.source} | Severity: ${e.severity}`,
      icon: Shield,
      color: e.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'
    }));

    Object.values(agents as Record<string, any>).forEach(a => combined.push({
      id: a.id,
      timestamp: a.timestamp,
      type: 'Agent',
      title: `Agent ${a.agentId} status changed`,
      subtitle: `Status: ${a.status} | Task: ${a.currentTask}`,
      icon: Bot,
      color: 'text-cyan-400'
    }));

    Object.values(scans as Record<string, any>).forEach(s => combined.push({
      id: s.id,
      timestamp: s.timestamp,
      type: 'Scan',
      title: `Scan ${s.scanId} progress updated`,
      subtitle: `Phase: ${s.currentPhase} | Progress: ${s.progressPercentage}% | Findings: ${s.findingsCount}`,
      icon: Target,
      color: 'text-emerald-400'
    }));

    notifications.forEach(n => combined.push({
      id: n.id,
      timestamp: n.timestamp,
      type: 'Notification',
      title: n.title,
      subtitle: n.message,
      icon: Zap,
      color: 'text-purple-400'
    }));

    // Sort by newest first
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [securityEvents, agents, scans, notifications]);

  const [filter, setFilter] = useState<string | null>(null);

  const displayedEvents = filter ? timelineEvents.filter(e => e.type === filter) : timelineEvents;

  return (
    <Card className="bg-slate-900/40 border-slate-800/60 h-full flex flex-col">
      <CardHeader className="border-b border-slate-800/50 pb-4 shrink-0">
        <CardTitle className="text-base font-medium">Global Activity Timeline</CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge 
            variant="outline" 
            className={cn("cursor-pointer border-slate-700", !filter ? "bg-slate-800" : "hover:bg-slate-800/50")}
            onClick={() => setFilter(null)}
          >
            All
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("cursor-pointer border-slate-700", filter === 'Security' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "hover:bg-slate-800/50")}
            onClick={() => setFilter('Security')}
          >
            Security Events
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("cursor-pointer border-slate-700", filter === 'Agent' ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "hover:bg-slate-800/50")}
            onClick={() => setFilter('Agent')}
          >
            Agents
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("cursor-pointer border-slate-700", filter === 'Scan' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "hover:bg-slate-800/50")}
            onClick={() => setFilter('Scan')}
          >
            Scans
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="p-4 sm:p-6">
          {displayedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-500 py-12">
              <Clock className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-sm">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-800 ml-3 space-y-6">
              {displayedEvents.slice(0, 200).map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={`${event.id}-${index}`} className="relative pl-6 sm:pl-8 group">
                    <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                      <Icon className={cn("h-3 w-3", event.color)} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">{event.title}</span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap hidden sm:inline-block">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mb-1 sm:hidden">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
