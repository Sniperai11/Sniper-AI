import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  FileText, Download, Calendar, Settings, Plus,
  PieChart, Activity, ShieldCheck, Zap
} from 'lucide-react';

const reports = [
  { id: 'REP-001', name: 'Q3 Executive Security Summary', type: 'Executive', date: 'Oct 15, 2024', size: '2.4 MB' },
  { id: 'REP-002', name: 'api.production.corp Pentest Report', type: 'Technical', date: 'Oct 10, 2024', size: '5.1 MB' },
  { id: 'REP-003', name: 'Weekly Vulnerability Delta', type: 'Operational', date: 'Oct 07, 2024', size: '1.2 MB' },
  { id: 'REP-004', name: 'SOC 2 Compliance Audit Readiness', type: 'Compliance', date: 'Oct 01, 2024', size: '3.8 MB' },
];

export const Reports = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            Report Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">Generate and distribute automated security reports</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-indigo-600 hover:bg-indigo-500 text-white border-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Report</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/10 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
              <PieChart className="h-6 w-6 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Executive Summary</h3>
              <p className="text-xs text-slate-500 mt-1">High-level metrics</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/30 transition-colors">
              <Zap className="h-6 w-6 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Pentest Results</h3>
              <p className="text-xs text-slate-500 mt-1">Technical details</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
              <ShieldCheck className="h-6 w-6 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Compliance Audit</h3>
              <p className="text-xs text-slate-500 mt-1">Framework mapping</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/40 border-slate-800/60 hover:border-amber-500/30 transition-colors cursor-pointer group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 group-hover:bg-amber-500/10 flex items-center justify-center border border-slate-700 group-hover:border-amber-500/30 transition-colors">
              <Activity className="h-6 w-6 text-slate-400 group-hover:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Operational Delta</h3>
              <p className="text-xs text-slate-500 mt-1">Weekly changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="border-b border-slate-800/60 pb-4">
          <CardTitle className="text-base font-medium">Recent Reports Archive</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y divide-slate-800/60">
            {reports.map((report) => (
              <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                    <FileText className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{report.name}</span>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <Badge variant="outline" className="bg-slate-900/50">{report.type}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span className="font-mono">{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
