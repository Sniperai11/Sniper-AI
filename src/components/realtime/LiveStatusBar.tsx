import React from 'react';
import { useConnectionState } from '../../hooks/realtime';
import { pipelineMetrics } from '../../realtime/pipeline';
import { Activity, Zap, Server, Database, Brain, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LiveStatusBar = () => {
  const wsState = useConnectionState();
  const metrics = pipelineMetrics.getMetrics(); // To get reactive metrics we might need an interval or a hook, but for now we'll do an interval

  const [liveMetrics, setLiveMetrics] = React.useState(metrics);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(pipelineMetrics.getMetrics());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-emerald-500 text-emerald-400 border-emerald-500/20';
      case 'Connecting':
      case 'Reconnecting': return 'bg-yellow-500 text-yellow-400 border-yellow-500/20';
      case 'Disconnected':
      case 'Authentication Failed': return 'bg-red-500 text-red-400 border-red-500/20';
      default: return 'bg-slate-500 text-slate-400 border-slate-500/20';
    }
  };

  const wsColor = getStatusColor(wsState);

  return (
    <div className="hidden lg:flex items-center gap-3 text-[10px] font-medium tracking-wider uppercase">
      {/* WS Status */}
      <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded border bg-opacity-10", wsColor)}>
        <Wifi className="h-3 w-3" />
        <span>WS: {wsState}</span>
      </div>

      {/* API Status (Mocked for now as healthy) */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        <Server className="h-3 w-3" />
        <span>API: OK</span>
      </div>

      {/* Database Status (Mocked) */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        <Database className="h-3 w-3" />
        <span>DB: OK</span>
      </div>

      {/* AI Engine Status (Mocked) */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        <Brain className="h-3 w-3" />
        <span>AI: READY</span>
      </div>

      {/* Telemetry Metrics */}
      <div className="flex items-center gap-4 text-slate-400 border-l border-slate-800 pl-3 ml-1">
        <div className="flex items-center gap-1.5" title="Events Per Second">
          <Activity className="h-3 w-3 text-cyan-500" />
          <span>{Math.round(liveMetrics.eventsPerSecond)} EPS</span>
        </div>
        <div className="flex items-center gap-1.5" title="Latency">
          <Zap className="h-3 w-3 text-yellow-500" />
          <span>{Math.round(liveMetrics.averageLatencyMs)}ms</span>
        </div>
        <div className="flex items-center gap-1.5" title="Reconnects">
          <span className="text-slate-500">RECONNECTS:</span>
          <span className="text-white">{liveMetrics.reconnectCount}</span>
        </div>
      </div>
    </div>
  );
};
