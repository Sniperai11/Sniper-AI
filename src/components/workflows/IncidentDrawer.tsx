import React, { useState } from 'react';
import { IncidentWorkflow, IncidentState } from '../../api/types/workflows';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, Activity, FileText, Brain, History, Users, Target, ShieldAlert, Zap, X, ArrowRight, PlayCircle, BookOpen, CheckCircle2, UserPlus, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuditLogs, useUpdateIncidentState, useUpdateIncidentOwner } from '../../hooks/api/useWorkflows';

interface IncidentDrawerProps {
  incident: IncidentWorkflow;
  onClose: () => void;
}

export const IncidentDrawer = ({ incident, onClose }: IncidentDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'playbook' | 'timeline'>('details');
  const [isAssigning, setIsAssigning] = useState(false);
  const [newOwner, setNewOwner] = useState('');

  const { data: auditLogs } = useAuditLogs(incident.id);
  const updateState = useUpdateIncidentState();
  const updateOwner = useUpdateIncidentOwner();

  const getSeverityColor = (severity: string) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('crit') || s.includes('حرج')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (s.includes('high') || s.includes('عال')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    if (s.includes('med') || s.includes('متوسط')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  const handleStateChange = (newState: IncidentState) => {
    updateState.mutate({ id: incident.id, state: newState });
  };

  const handleAssignOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwner) return;
    updateOwner.mutate({ id: incident.id, owner: newOwner }, {
      onSuccess: () => {
        setIsAssigning(false);
        setNewOwner('');
      }
    });
  };

  const states: { key: IncidentState; label: string }[] = [
    { key: 'New', label: 'جديد' },
    { key: 'Investigating', label: 'قيد التحقيق' },
    { key: 'Contained', label: 'تم الاحتواء' },
    { key: 'Eradicated', label: 'تم الاجتثاث' },
    { key: 'Recovering', label: 'جاري التعافي' },
    { key: 'Resolved', label: 'تم الحل' },
    { key: 'Closed', label: 'مغلق' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[600px] lg:w-[800px] bg-[#0a0f1c] border-r border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-left-full duration-300 text-right" dir="rtl">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-[#050811]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{incident.id}</h2>
              <Badge className={cn("border", getSeverityColor(incident.severity))}>
                {incident.severity}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 line-clamp-1">{incident.title}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-[#050811] overflow-x-auto scrollbar-none">
        {[
          { id: 'details', label: 'نظرة عامة', icon: FileText },
          { id: 'ai', label: 'تحليل الذكاء الاصطناعي', icon: Brain },
          { id: 'playbook', label: 'دليل الإجراءات (Playbook)', icon: BookOpen },
          { id: 'timeline', label: 'سجل العمليات والتدقيق', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id 
                ? "border-cyan-500 text-cyan-400" 
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 p-4 sm:p-6 space-y-6">
        
        {/* Quick Action Toolbar */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">إجراءات الحادث السريعة</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              size="sm" 
              onClick={() => handleStateChange('Contained')}
              disabled={updateState.isPending}
              className="bg-amber-600 hover:bg-amber-500 text-white h-8 text-xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 ml-1" />
              احتواء الحادث
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleStateChange('Resolved')}
              disabled={updateState.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
              إغلاق وحل
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStateChange('Closed')}
              disabled={updateState.isPending}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 text-xs"
            >
              <Lock className="h-3.5 w-3.5 ml-1" />
              أرشفة
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsAssigning(!isAssigning)}
              className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 h-8 text-xs"
            >
              <UserPlus className="h-3.5 w-3.5 ml-1" />
              تعيين المحلل المسؤول
            </Button>
          </div>

          {isAssigning && (
            <form onSubmit={handleAssignOwner} className="flex items-center gap-2 pt-2 border-t border-slate-800 animate-in fade-in">
              <input 
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="أدخل اسم المحلل أو الفريق المسؤول..."
                className="h-8 text-xs bg-slate-950 border border-slate-700 rounded px-2 text-white flex-1 focus:outline-none focus:border-cyan-500 text-right"
              />
              <Button size="sm" type="submit" disabled={updateOwner.isPending} className="h-8 text-xs bg-cyan-600 hover:bg-cyan-500">
                حفظ
              </Button>
            </form>
          )}
        </div>

        {/* Incident State Bar */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">مرحلة الاستجابة الحالية</h3>
          <div className="flex flex-wrap items-center gap-2">
            {states.map((sObj, i) => {
              const isActive = incident.state === sObj.key;
              const isPast = states.findIndex(st => st.key === incident.state) > i;
              return (
                <React.Fragment key={sObj.key}>
                  <Button 
                    variant={isActive ? "default" : "outline"} 
                    size="sm"
                    className={cn(
                      "h-8 rounded-full text-xs font-medium border-slate-700",
                      isActive ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-500" :
                      isPast ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "text-slate-400 hover:text-slate-200"
                    )}
                    onClick={() => handleStateChange(sObj.key)}
                  >
                    {sObj.label}
                  </Button>
                  {i < states.length - 1 && <ArrowRight className="h-3 w-3 text-slate-700 shrink-0 rotate-180" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">المسؤول الحالي</span>
                <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {incident.owner || 'غير معين'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">المدة المنقضية</span>
                <span className="text-sm font-medium text-slate-200">2 ساعة 15 دقيقة</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 col-span-2">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">إطار MITRE ATT&CK</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {incident.mitreAttack.map(t => (
                    <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">الوصف والملخص التفصيلي</h3>
              <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-800/50">
                {incident.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">الأصول الأمنية المرتبطة</h3>
              <div className="flex flex-wrap gap-2">
                {incident.linkedAssets.map(asset => (
                  <Badge key={asset} variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300 flex items-center gap-1.5 px-3 py-1.5">
                    <Target className="h-3.5 w-3.5 text-slate-400" />
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-950/10">
              <div className="flex items-center gap-2 mb-4 border-b border-cyan-900/30 pb-3">
                <Brain className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">تحليل محرك الذكاء الاصطناعي</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">الملخص التنفيذي الذكي</h4>
                  <p className="text-sm text-slate-200">{incident.aiAnalysis.executiveSummary}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg border border-red-500/20 bg-red-950/10">
                    <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5" /> توقع المخاطر المستقبلية
                    </h4>
                    <p className="text-sm text-slate-300">{incident.aiAnalysis.riskPrediction}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/10">
                    <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" /> الإجراء الموصى به فوراً
                    </h4>
                    <p className="text-sm text-slate-300">{incident.aiAnalysis.nextAction}</p>
                    <Button size="sm" className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white">تنفيذ الإجراء التلقائي</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  {incident.playbook}
                </h3>
                <p className="text-xs text-slate-400 mt-1">خطة العمل المعتمدة للتعامل مع هذا النوع من الحوادث.</p>
              </div>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                <PlayCircle className="h-4 w-4 ml-2" />
                تشغيل الأتمتة
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { step: '1. تحديد الحسابات المخترقة وعزلها', status: 'completed' },
                { step: '2. عزل الأجهزة والنقاط النهائية المتأثرة', status: 'in-progress' },
                { step: '3. إعادة تعيين كلمات المرور ومفاتيح التشفير', status: 'pending' },
                { step: '4. مراجعة سجلات التدقيق لمنع التحرك الجانبي', status: 'pending' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <div className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold",
                    s.status === 'completed' ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" :
                    s.status === 'in-progress' ? "bg-amber-500/20 border-amber-500 text-amber-400" :
                    "bg-slate-800 border-slate-600 text-slate-400"
                  )}>
                    {i + 1}
                  </div>
                  <span className={cn("text-sm", s.status === 'completed' ? "text-slate-300 line-through" : "text-white")}>{s.step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="relative border-r-2 border-slate-800 mr-3 space-y-8 pr-6">
              {auditLogs?.map(log => (
                <div key={log.id} className="relative group">
                  <div className="absolute -right-[31px] top-0.5 h-4 w-4 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-slate-200">{log.action.replace(/_/g, ' ')}</h4>
                    <span className="text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString('ar-SA')}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-400">{log.userId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
