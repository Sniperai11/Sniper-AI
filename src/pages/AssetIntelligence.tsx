import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Server, Search, Filter, ShieldAlert, Cpu, 
  Globe, Database, Cloud, Network, Shield,
  MoreVertical, ExternalLink, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const assets = [
  { id: 'AST-1042', name: 'api.production.corp', type: 'API Gateway', category: 'Infrastructure', risk: 'Medium', tags: ['PCI-DSS', 'External'], owner: 'Platform Team', lastSeen: '2 hours ago' },
  { id: 'AST-1043', name: 'auth.internal.corp', type: 'Identity Provider', category: 'Security', risk: 'High', tags: ['Core', 'Internal'], owner: 'SecOps', lastSeen: '10 mins ago' },
  { id: 'AST-1044', name: 'customer-db-primary', type: 'Database', category: 'Data Storage', risk: 'Critical', tags: ['PII', 'Production'], owner: 'DBA Team', lastSeen: 'Just now' },
  { id: 'AST-1045', name: 'payment-processor-svc', type: 'Microservice', category: 'Application', risk: 'Low', tags: ['PCI-DSS', 'Internal'], owner: 'Payments Team', lastSeen: '1 hour ago' },
  { id: 'AST-1046', name: 'cdn-assets.corp', type: 'CDN', category: 'Infrastructure', risk: 'Low', tags: ['External', 'Static'], owner: 'Web Team', lastSeen: '5 hours ago' },
  { id: 'AST-1047', name: 'vpn-gateway-eu', type: 'VPN Gateway', category: 'Network', risk: 'Medium', tags: ['External', 'Remote Access'], owner: 'NetOps', lastSeen: '1 day ago' },
  { id: 'AST-1048', name: 'legacy-admin-panel', type: 'Web App', category: 'Application', risk: 'Critical', tags: ['Deprecated', 'Internal'], owner: 'Unknown', lastSeen: '2 weeks ago' },
];

const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Infrastructure': return <Server className="h-4 w-4 text-cyan-400" />;
    case 'Security': return <Shield className="h-4 w-4 text-emerald-400" />;
    case 'Data Storage': return <Database className="h-4 w-4 text-purple-400" />;
    case 'Application': return <Globe className="h-4 w-4 text-blue-400" />;
    case 'Network': return <Network className="h-4 w-4 text-indigo-400" />;
    default: return <Cloud className="h-4 w-4 text-slate-400" />;
  }
}

const getRiskBadge = (risk: string) => {
  switch(risk.toLowerCase()) {
    case 'critical': return <Badge variant="destructive" className="border-0">Critical</Badge>;
    case 'high': return <Badge variant="warning" className="border-0 bg-amber-500/20 text-amber-400">High</Badge>;
    case 'medium': return <Badge variant="secondary" className="border-0 text-slate-300 bg-slate-800">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="border-slate-700 text-slate-400">Low</Badge>;
    default: return <Badge variant="outline">{risk}</Badge>;
  }
};

export const AssetIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Asset Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">Comprehensive inventory and context of all digital assets</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Discover Assets</span>
            <span className="sm:hidden">Discover</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center">
            <span className="hidden sm:inline">Add Asset</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Total Assets</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">1,842</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Internet Facing</span>
          <span className="text-xl sm:text-3xl font-black text-cyan-400 mt-1">245</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Unmanaged (Shadow)</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">38</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Critical Risk</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">14</span>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <CardTitle className="text-base font-medium">Asset Inventory</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search name, type..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950/50 py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <Button variant="outline" size="sm" className="px-3 shrink-0 hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          
          {/* Mobile List View */}
          <div className="grid grid-cols-1 divide-y divide-slate-800/60 lg:hidden">
            {assets.map((asset) => (
              <div key={asset.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                      {getCategoryIcon(asset.category)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link to={`/assets/${asset.id}`} className="font-bold text-cyan-400 hover:text-cyan-300">
                        {asset.name}
                      </Link>
                      <span className="text-xs text-slate-500">{asset.category} • {asset.type}</span>
                    </div>
                  </div>
                  {getRiskBadge(asset.risk)}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {asset.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
                  <span className="text-xs text-slate-500">Owner: {asset.owner}</span>
                  <Link to={`/assets/${asset.id}`} className="w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent border-slate-700">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Asset Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Risk</th>
                  <th className="px-6 py-4 font-medium">Last Seen</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div className="flex flex-col">
                          <Link to={`/assets/${asset.id}`} className="font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                            {asset.name}
                          </Link>
                          <span className="text-xs text-slate-500">{asset.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{asset.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {asset.owner}
                    </td>
                    <td className="px-6 py-4">
                      {getRiskBadge(asset.risk)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {asset.lastSeen}
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
