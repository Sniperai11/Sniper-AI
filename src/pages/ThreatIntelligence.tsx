import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Shield, Search, Filter, MoreVertical, 
  Globe, AlertTriangle, Hash, ExternalLink,
  Activity, Zap, Crosshair
} from 'lucide-react';

const feeds = [
  { id: 'TI-001', type: 'Malware', indicator: '72.23.44.12', severity: 'Critical', source: 'AlienVault', detected: '1 hour ago', tags: ['C2', 'Ransomware'] },
  { id: 'TI-002', type: 'CVE', indicator: 'CVE-2024-0012', severity: 'High', source: 'NVD', detected: '3 hours ago', tags: ['PaloAlto', 'RCE'] },
  { id: 'TI-003', type: 'Domain', indicator: 'auth-corp-update.com', severity: 'High', source: 'PhishTank', detected: '1 day ago', tags: ['Phishing', 'Brand Impersonation'] },
  { id: 'TI-004', type: 'Hash', indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', severity: 'Medium', source: 'VirusTotal', detected: '2 days ago', tags: ['Trojan'] },
];

const getSeverityBadge = (severity: string) => {
  switch(severity.toLowerCase()) {
    case 'critical': return <Badge variant="destructive" className="border-0">Critical</Badge>;
    case 'high': return <Badge variant="warning" className="border-0 bg-amber-500/20 text-amber-400">High</Badge>;
    case 'medium': return <Badge variant="secondary" className="border-0 text-slate-300 bg-slate-800">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="border-slate-700 text-slate-400">Low</Badge>;
    default: return <Badge variant="outline">{severity}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'Malware': return <AlertTriangle className="h-4 w-4 text-red-400" />;
    case 'CVE': return <Shield className="h-4 w-4 text-amber-400" />;
    case 'Domain': return <Globe className="h-4 w-4 text-cyan-400" />;
    case 'Hash': return <Hash className="h-4 w-4 text-slate-400" />;
    default: return <Shield className="h-4 w-4 text-slate-400" />;
  }
}

export const ThreatIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-400" />
            Threat Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">Global threat feeds and dark web monitoring</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Feeds</span>
            <span className="sm:hidden">Feeds</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-amber-600 hover:bg-amber-500 text-white border-0">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Manual Hunt</span>
            <span className="sm:hidden">Hunt</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Globe className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Active Intel Feeds</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-xl sm:text-3xl font-black text-white">24</span>
            <span className="text-sm font-medium text-emerald-400 mb-1">Online</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Activity className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">IoCs Processed (24h)</span>
          <span className="text-xl sm:text-3xl font-black text-cyan-400 mt-1">1.4M</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <Crosshair className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Direct Mentions</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">12</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">High-Risk Campaigns</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">3</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <CardTitle className="text-base font-medium">Active Indicators (IoC)</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search IPs, hashes, CVEs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950/50 py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Mobile List */}
          <div className="grid grid-cols-1 divide-y divide-slate-800/60 lg:hidden">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                      {getTypeIcon(feed.type)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-200 font-mono break-all">{feed.indicator}</span>
                      <span className="text-xs text-slate-500">{feed.type} • {feed.source}</span>
                    </div>
                  </div>
                  {getSeverityBadge(feed.severity)}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {feed.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Indicator</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                  <th className="px-6 py-4 font-medium">Detected</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {feeds.map((feed) => (
                  <tr key={feed.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium font-mono text-slate-200 flex items-center gap-2">
                        {feed.indicator}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(feed.type)}
                        <span className="text-slate-300">{feed.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSeverityBadge(feed.severity)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400">{feed.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {feed.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {feed.detected}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
