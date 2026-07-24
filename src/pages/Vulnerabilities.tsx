import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Search, Filter, Shield, Info, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useVulnerabilities } from '../hooks/api/useWorkflows';
import { VulnerabilityWorkflow } from '../api/types/workflows';
import { VulnerabilityDrawer } from '../components/workflows/VulnerabilityDrawer';

export const Vulnerabilities = () => {
  const { data: vulnerabilities, isLoading } = useVulnerabilities();
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityWorkflow | null>(null);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <Badge variant="destructive" className="border-0">Critical</Badge>;
      case 'High': return <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-0">High</Badge>;
      case 'Medium': return <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-0">Medium</Badge>;
      case 'Low': return <Badge variant="outline" className="border-slate-700 text-slate-400">Low</Badge>;
      default: return <Badge variant="outline" className="border-slate-700 text-slate-400">Info</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'High': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'Medium': return <AlertCircle className="h-4 w-4 text-slate-400" />;
      case 'Low': return <Shield className="h-4 w-4 text-slate-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Vulnerabilities</h1>
          <p className="text-sm text-slate-400 mt-1">Manage, triage, and remediate discovered vulnerabilities.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search CVE, Asset, IP..." 
              className="h-10 w-full sm:w-64 rounded-md border border-slate-800 bg-slate-900/50 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
          <Button variant="outline" className="h-10 border-slate-800 bg-slate-900/50 shrink-0">
            <Filter className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Critical</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">12</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10">
            <AlertTriangle className="w-16 h-16 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">High</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">34</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Remediated (30d)</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">156</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-400">Avg. Time to Fix</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">4.2d</span>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium">Vulnerability</th>
                <th className="px-4 py-4 font-medium">Severity</th>
                <th className="px-4 py-4 font-medium">CVSS</th>
                <th className="px-4 py-4 font-medium">State</th>
                <th className="px-4 py-4 font-medium hidden sm:table-cell">Asset</th>
                <th className="px-4 py-4 font-medium hidden md:table-cell">Discovered</th>
                <th className="px-4 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading vulnerabilities...</td>
                </tr>
              ) : vulnerabilities?.map((vuln) => (
                <tr 
                  key={vuln.id} 
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedVuln(vuln)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {getSeverityIcon(vuln.severity)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors truncate max-w-[200px] sm:max-w-xs">{vuln.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{vuln.cve || vuln.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getSeverityBadge(vuln.severity)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-mono text-slate-300">
                    {vuln.cvss}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="border-slate-700 bg-slate-900">{vuln.state}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden sm:table-cell">
                    <div className="truncate max-w-[150px]" title={vuln.affectedAssets.join(', ')}>
                      {vuln.affectedAssets[0]} {vuln.affectedAssets.length > 1 && `+${vuln.affectedAssets.length - 1}`}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden md:table-cell whitespace-nowrap text-xs">
                    {new Date(vuln.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                      Triage <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedVuln && (
        <VulnerabilityDrawer 
          vulnerability={selectedVuln} 
          onClose={() => setSelectedVuln(null)} 
        />
      )}
    </div>
  );
};
