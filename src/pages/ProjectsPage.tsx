import React, { useState } from 'react';
import { 
  Briefcase, Plus, Search, RefreshCw, Lock, ExternalLink, ShieldAlert, Check, Copy, HelpCircle 
} from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';
import { Badge, VerificationBadge } from '../shared/components/Badge';

export interface ProjectsPageProps {
  projects: any[];
  activeScans: any[];
  actionLoading: string | null;
  onAddProject: (name: string, desc: string) => void;
  onAddTarget: (projectId: string, name: string, url: string, type: string, bountyPlatform?: string) => void;
  onTriggerScan: (targetId: string, options?: any) => void;
  onVerifyOwnership: (target: any) => void;
  onVerifyBountyTarget: (targetId: string, proofUrl: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects = [],
  activeScans = [],
  actionLoading,
  onAddProject,
  onAddTarget,
  onTriggerScan,
  onVerifyOwnership,
  onVerifyBountyTarget
}) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeActiveScans = Array.isArray(activeScans) ? activeScans : [];

  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [showAddProj, setShowAddProj] = useState(false);

  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [newTargetType, setNewTargetType] = useState('Website');
  const [newTargetBountyPlatform, setNewTargetBountyPlatform] = useState('None');
  const [selectedProjIdForTarget, setSelectedProjIdForTarget] = useState('');
  const [showAddTarget, setShowAddTarget] = useState(false);

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [verifyingTargetId, setVerifyingTargetId] = useState<string | null>(null);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">إدارة الأهداف والمشاريع الأمنية</h2>
          <p className="text-xs text-slate-400 mt-1">تحديد نطاق الفحص وإصدار شهادات إثبات الملكية وتتبع قنوات الفحص النشطة</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddProj(true)}>
            <Plus className="w-4 h-4" /> إضافة مشروع جديد
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              if (safeProjects.length > 0) {
                setSelectedProjIdForTarget(safeProjects[0].id);
                setShowAddTarget(true);
              }
            }}
            disabled={safeProjects.length === 0}
          >
            <Plus className="w-4 h-4" /> إضافة هدف فحص
          </Button>
        </div>
      </div>

      {/* ADD PROJECT MODAL */}
      {showAddProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">مشروع أمني جديد</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم المشروع</label>
                <input 
                  type="text" 
                  value={newProjName}
                  onChange={e => setNewProjName(e.target.value)}
                  placeholder="مثال: الخدمات المالية السحابية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">الوصف العام</label>
                <textarea 
                  value={newProjDesc}
                  onChange={e => setNewProjDesc(e.target.value)}
                  placeholder="نطاق المشروع والأهداف المرتبطة به..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowAddProj(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  if (newProjName.trim()) {
                    onAddProject(newProjName, newProjDesc);
                    setNewProjName('');
                    setNewProjDesc('');
                    setShowAddProj(false);
                  }
                }}
              >
                إنشاء المشروع
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TARGET MODAL */}
      {showAddTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">إضافة هدف فحص جديد</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اختر المشروع</label>
                <select 
                  value={selectedProjIdForTarget}
                  onChange={e => setSelectedProjIdForTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {safeProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم الهدف</label>
                <input 
                  type="text" 
                  value={newTargetName}
                  onChange={e => setNewTargetName(e.target.value)}
                  placeholder="مثال: الخادم الرئيسي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">رابط أو معرف الهدف</label>
                <input 
                  type="text" 
                  value={newTargetUrl}
                  onChange={e => setNewTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">نوع الهدف</label>
                <select 
                  value={newTargetType}
                  onChange={e => setNewTargetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Website">موقع إلكتروني (Website)</option>
                  <option value="API">واجهة برمجة تطبيقات (API)</option>
                  <option value="Mobile">تطبيق هاتف (Mobile)</option>
                  <option value="Source Code">شفرة مصدرية (Source Code)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowAddTarget(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  if (newTargetName.trim() && newTargetUrl.trim() && selectedProjIdForTarget) {
                    onAddTarget(selectedProjIdForTarget, newTargetName, newTargetUrl, newTargetType, newTargetBountyPlatform);
                    setNewTargetName('');
                    setNewTargetUrl('');
                    setShowAddTarget(false);
                  }
                }}
              >
                إضافة الهدف
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS LIST GRID */}
      {safeProjects.length === 0 ? (
        <Card className="text-center py-12 text-slate-500 text-xs">
          لا توجد أي مشاريع أمنية نشطة حالياً. ابدأ بإضافة أول مشروع أمني للتحكم في الأهداف.
        </Card>
      ) : (
        <div className="space-y-6">
          {safeProjects.map((proj) => (
            <Card key={proj.id} title={proj.name} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 pb-2">الاسم والنوع</th>
                      <th className="py-2.5 pb-2">رابط المورد</th>
                      <th className="py-2.5 pb-2">حالة الملكية</th>
                      <th className="py-2.5 pb-2 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(proj?.targets) ? proj.targets : []).map((target: any) => {
                      const isScanning = safeActiveScans.some(s => s?.targetId === target?.id && s?.status !== 'Completed');
                      return (
                        <tr key={target.id} className="border-b border-slate-850 hover:bg-slate-900/40">
                          <td className="py-3 font-semibold text-white">
                            {target.name}
                            <span className="text-[10px] text-slate-500 block">{target.type}</span>
                          </td>
                          <td className="py-3 font-mono text-slate-300">{target.url}</td>
                          <td className="py-3">
                            <VerificationBadge status={target.verificationStatus} />
                          </td>
                          <td className="py-3 text-left">
                            <div className="flex items-center gap-2 justify-end">
                              {target.verificationStatus !== 'Verified' ? (
                                <div className="flex items-center gap-1.5">
                                  <input 
                                    type="text" 
                                    placeholder="أثبت الملكية برابط PoC..." 
                                    onChange={(e) => setProofUrl(e.target.value)}
                                    className="bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyan-500"
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => {
                                      if (proofUrl.trim()) {
                                        onVerifyBountyTarget(target.id, proofUrl);
                                        setProofUrl('');
                                      }
                                    }}
                                  >
                                    توثيق
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  size="sm" 
                                  disabled={isScanning}
                                  onClick={() => onTriggerScan(target.id)}
                                >
                                  {isScanning ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" /> جاري الفحص
                                    </>
                                  ) : (
                                    'تشغيل الفحص الأمني'
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
