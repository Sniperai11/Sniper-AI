import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Server, ShieldAlert, Globe, Database, Network, 
  ArrowLeft, ArrowRight, ExternalLink, Shield, Cpu, Clock,
  Terminal, CheckCircle, AlertTriangle, Cloud
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAsset } from '../hooks/api/useAssets';

const activityData = [
  { time: '00:00', requests: 120 },
  { time: '04:00', requests: 80 },
  { time: '08:00', requests: 450 },
  { time: '12:00', requests: 980 },
  { time: '16:00', requests: 750 },
  { time: '20:00', requests: 300 },
  { time: '24:00', requests: 150 },
];

export const AssetDetails = () => {
  const { id } = useParams();
  const { data: asset, isLoading } = useAsset(id || 'AST-1042');

  const assetName = asset?.name || 'api.production.corp';
  const assetIp = asset?.ipAddress || '192.168.1.10';
  const assetOwner = asset?.owner || 'Platform Engineering Team';
  const assetCategory = asset?.category || 'Infrastructure';
  const assetEnv = asset?.environment || 'Production';

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      
      {/* Back & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <Link to="/assets" className="hover:text-cyan-400 flex items-center transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </Link>
        <span>/</span>
        <span className="text-slate-200">{assetName}</span>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
            <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-all">{assetName}</h1>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">Active</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full sm:w-auto h-8 text-xs shrink-0 mt-2 sm:mt-0">
                <ExternalLink className="h-3 w-3 mr-2" />
                View Asset
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 sm:mt-2 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Server className="h-4 w-4 text-slate-500" />
                {assetIp}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-slate-500" />
                {assetCategory}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                Last Scanned: 2 hours ago
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Column - Metadata */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/60">
            <CardHeader className="pb-3 border-b border-slate-800/60 p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Asset Context</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Environment</p>
                  <p className="text-sm font-medium text-slate-200">{assetEnv}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Owner</p>
                  <p className="text-sm font-medium text-slate-200">{assetOwner}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Risk Score</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-red-400">85</span>
                      <span className="text-xs text-slate-500 mb-1">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Vulnerabilities</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-amber-400">3</span>
                      <span className="text-xs text-slate-500 mb-1">Active</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {asset?.tags ? asset.tags.map(t => (
                      <Badge key={t} variant="secondary" className="bg-slate-800 text-slate-300 text-xs border border-slate-700">{t}</Badge>
                    )) : (
                      <>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs border border-slate-700">PCI-DSS</Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs border border-slate-700">Production</Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs border border-slate-700">Ingress</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card className="bg-slate-900/40 border-slate-800/60">
            <CardHeader className="pb-3 border-b border-slate-800/60 p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Detected Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/30 border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">Nginx Proxy</span>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">v1.24.0</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/30 border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">Node.js Express</span>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">v18.16.0</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-800/30 border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">Ubuntu Linux</span>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">22.04 LTS</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Linked Items */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/60 p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-4">Ingress Traffic Activity (24h)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/60 p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-4">Associated Security Findings</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">VULN-9021: Unauthenticated RCE in Edge Gateway</p>
                    <p className="text-[11px] text-slate-400">CVSS 9.8 • Discovered 1 day ago</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">INC-2024-080: Exfiltration Attempt via DNS Tunneling</p>
                    <p className="text-[11px] text-slate-400">MITRE T1071.004 • In Investigation</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">Active</Badge>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
