import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, ShieldAlert, ArrowRight, Download, Filter, Target } from 'lucide-react';

const frameworks = [
  { name: 'PCI-DSS v4.0', status: 'Compliant', score: 98, controls: { passed: 112, failed: 2 }, lastAudit: 'Oct 20, 2024' },
  { name: 'SOC 2 Type II', status: 'At Risk', score: 85, controls: { passed: 85, failed: 15 }, lastAudit: 'Oct 22, 2024' },
  { name: 'ISO 27001', status: 'Compliant', score: 100, controls: { passed: 93, failed: 0 }, lastAudit: 'Oct 10, 2024' },
  { name: 'GDPR', status: 'Compliant', score: 92, controls: { passed: 45, failed: 4 }, lastAudit: 'Oct 15, 2024' },
  { name: 'HIPAA', status: 'Compliant', score: 96, controls: { passed: 78, failed: 3 }, lastAudit: 'Sep 29, 2024' },
  { name: 'NIST CSF', status: 'At Risk', score: 78, controls: { passed: 62, failed: 18 }, lastAudit: 'Oct 23, 2024' },
];

export const Compliance = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
            Compliance Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Continuous compliance monitoring and auditing</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Audit Log</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-500 text-white border-0">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Add Framework</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Average Score</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">91.5%</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Frameworks Tracked</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">6</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Failed Controls</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">42</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Audit Ready</span>
          <span className="text-xl sm:text-3xl font-black text-emerald-400 mt-1">4 <span className="text-sm font-medium text-slate-500">/ 6</span></span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <h2 className="text-lg font-medium text-white">Active Frameworks</h2>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameworks.map((fw) => (
          <Card key={fw.name} className="bg-slate-900/40 border-slate-800/60 hover:border-slate-700 transition-colors group">
            <CardContent className="p-5 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{fw.name}</h3>
                {fw.status === 'Compliant' ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shrink-0">Compliant</Badge>
                ) : (
                  <Badge variant="warning" className="bg-amber-500/20 text-amber-400 border-0 shrink-0">At Risk</Badge>
                )}
              </div>
              
              <div className="flex items-end gap-2 mb-6">
                <span className={`text-4xl font-black ${fw.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {fw.score}%
                </span>
                <span className="text-sm text-slate-500 mb-1">Score</span>
              </div>

              <div className="space-y-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Passed Controls</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="h-3 w-3" />
                    {fw.controls.passed}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Failed Controls</span>
                  <span className={fw.controls.failed > 0 ? "text-amber-400 font-bold flex items-center gap-1.5" : "text-slate-500 flex items-center gap-1.5"}>
                    {fw.controls.failed > 0 && <ShieldAlert className="h-3 w-3" />}
                    {fw.controls.failed}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Last Audit: {fw.lastAudit}</span>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-300 group-hover:text-emerald-400 hover:bg-emerald-500/10">
                  View Details <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
