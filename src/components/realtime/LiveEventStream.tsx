import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSecurityEvents } from '../../hooks/realtime';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Pause, Search, Filter, ShieldAlert, AlertTriangle, Shield, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SecurityEvent } from '../../realtime/types';

export const LiveEventStream = () => {
  const events = useSecurityEvents();
  const [isPaused, setIsPaused] = useState(false);
  const [frozenEvents, setFrozenEvents] = useState<SecurityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logic if not paused
  useEffect(() => {
    if (!isPaused && scrollRef.current && !selectedEvent) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, isPaused, selectedEvent]);

  // When paused, we freeze the current list of events we render
  useEffect(() => {
    if (isPaused) {
      setFrozenEvents(events);
    }
  }, [isPaused, events]);

  const rawEvents = isPaused ? frozenEvents : events;

  const displayEvents = useMemo(() => {
    if (!searchQuery) return rawEvents;
    const lowerQ = searchQuery.toLowerCase();
    return rawEvents.filter(e => 
      e.description.toLowerCase().includes(lowerQ) ||
      e.source.toLowerCase().includes(lowerQ)
    );
  }, [rawEvents, searchQuery]);

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <ShieldAlert className="h-5 w-5 text-red-400" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default: return <Shield className="h-5 w-5 text-emerald-400" />;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <Badge variant="destructive" className="border-0">Critical</Badge>;
      case 'high': return <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-0">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-0">Medium</Badge>;
      default: return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px] sm:h-[700px] relative">
      <Card className={cn("bg-slate-900/40 border-slate-800/60 flex-1 flex flex-col transition-all", selectedEvent ? "hidden lg:flex lg:w-2/3" : "w-full")}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 border-b border-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-2">
              Live Security Operations
              {!isPaused && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search description, asset..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-48 lg:w-64 rounded-md border border-slate-800 bg-slate-900/50 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 px-2 hidden sm:flex border-slate-700">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-slate-700"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume Stream" : "Pause Stream"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-400" /> : <Pause className="h-3.5 w-3.5 text-amber-400" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden relative">
          <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            {displayEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <CheckCircle className="h-8 w-8 opacity-20" />
                <p className="text-sm">No recent events. Monitoring active...</p>
              </div>
            ) : (
              displayEvents.slice(0, 200).map((event) => (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "group flex items-start gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer",
                    selectedEvent?.id === event.id 
                      ? "bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      : "bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/80 hover:border-slate-700/80"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {getSeverityIcon(event.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-200 line-clamp-1">{event.description}</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                      {getSeverityBadge(event.severity)}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-slate-500">Asset:</span> 
                        <span className="font-medium text-slate-300">{(event as any).asset || event.source}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="text-slate-500">Agent:</span> 
                        <span className="font-medium text-slate-300">{(event as any).agentId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              ))
            )}
          </div>
          
          {isPaused && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg shadow-black/50">
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 cursor-pointer backdrop-blur-md" onClick={() => setIsPaused(false)}>
                Stream Paused. Click to resume
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Drawer (Rendered inline on lg, overlay on mobile) */}
      {selectedEvent && (
        <Card className="bg-slate-900/60 border-slate-800/80 flex-1 lg:w-1/3 flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4 shrink-0 bg-slate-950/50">
            <CardTitle className="text-sm font-semibold text-slate-200">Event Details</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setSelectedEvent(null)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {getSeverityIcon(selectedEvent.severity)}
                {getSeverityBadge(selectedEvent.severity)}
                <span className="text-xs text-slate-400 ml-auto">{new Date(selectedEvent.timestamp).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{selectedEvent.description}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {(selectedEvent as any).detailedDescription || 'No additional details provided by the AI analysis engine for this specific event payload.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Source / Asset</span>
                <span className="text-sm font-medium text-slate-200 break-all">{selectedEvent.source}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Detecting Agent</span>
                <span className="text-sm font-medium text-slate-200 break-all">{(selectedEvent as any).agentId || 'Auto-Scanner'}</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Recommendation</span>
              </div>
              <p className="text-sm text-slate-300">
                {(selectedEvent as any).aiRecommendation || 'Isolate the affected asset immediately and review associated IAM roles. Wait for further deep-scan analysis.'}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white w-full">Execute Remedy</Button>
              </div>
            </div>

            {/* Related Incident */}
            <div className="pt-4 border-t border-slate-800/50">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Related Incident Context</h4>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200">INC-2024-081</span>
                  <span className="text-[10px] text-slate-400">Multiple login failures detected</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 border-slate-600 text-slate-300">View</Button>
              </div>
            </div>
            
          </CardContent>
        </Card>
      )}
    </div>
  );
};
