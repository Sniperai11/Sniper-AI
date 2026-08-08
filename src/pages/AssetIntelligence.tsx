import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Globe, Server, Cloud, ShieldAlert, Plus, CheckCircle, Search, ArrowLeft, ArrowRight, Play, FileText, Check, FolderPlus, Folder, Briefcase, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const AssetIntelligence: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Projects and Targets
  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res: any = await apiClient.get('/projects');
      return res.data || [];
    }
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Target Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [targetName, setTargetName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetType, setTargetType] = useState('Website');
  const [currentTarget, setCurrentTarget] = useState<any>(null);

  // Scan State
  const [selectedProfileId, setSelectedProfileId] = useState('');

  // Filter State
  const [selectedFilterProjectId, setSelectedFilterProjectId] = useState<string>('all');

  // Fetch Scan Profiles
  const { data: scanProfiles = [] } = useQuery({
    queryKey: ['scan-profiles'],
    queryFn: async () => {
      const res: any = await apiClient.get('/scans/profiles');
      return res.data || [];
    }
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const res: any = await apiClient.post('/projects', { name, description: description || 'مشروع أمني' });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const addTargetMutation = useMutation({
    mutationFn: async (data: any) => {
      let pid = selectedProjectId;
      if (!pid) {
        if (projectsData && projectsData.length > 0) {
          pid = projectsData[0].id;
        } else {
          const newProj = await createProjectMutation.mutateAsync({ name: 'مشروع رئيسي', description: 'المشروع الأمني الرئيسي للأصول' });
          pid = newProj.id;
        }
      }
      const res: any = await apiClient.post(`/projects/${pid}/targets`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const verifyTargetMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const res: any = await apiClient.post(`/targets/${targetId}/verify`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const startScanMutation = useMutation({
    mutationFn: async (targetId: string) => {
      const res: any = await apiClient.post(`/targets/${targetId}/scan`);
      return res.data;
    }
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const res = await createProjectMutation.mutateAsync({
        name: newProjectName.trim(),
        description: newProjectDescription.trim()
      });
      const createdProj = res?.data?.project || res?.data || res;
      if (createdProj?.id) {
        setSelectedProjectId(createdProj.id);
      }
      setNewProjectName('');
      setNewProjectDescription('');
      setIsProjectModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إنشاء المشروع');
    }
  };

  const handleOpenModal = (presetProjectId?: string) => {
    setStep(1);
    setTargetName('');
    setTargetUrl('');
    setTargetType('Website');
    setCurrentTarget(null);
    if (presetProjectId) {
      setSelectedProjectId(presetProjectId);
    } else if (projectsData && projectsData.length > 0) {
      setSelectedProjectId(projectsData[0].id);
    }
    setIsModalOpen(true);
  };

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await addTargetMutation.mutateAsync({ name: targetName, url: targetUrl, type: targetType });
      const targetObj = res?.target || res?.data?.target || res?.data || res;
      setCurrentTarget(targetObj);
      setStep(2);
    } catch (err: any) {
      alert(err.message || 'Error adding target');
    }
  };

  const handleVerify = async () => {
    if (!currentTarget) return;
    try {
      const targetIdentifier = currentTarget.id || currentTarget.url;
      const verifyRes: any = await verifyTargetMutation.mutateAsync(targetIdentifier);
      const updatedTarget = verifyRes?.target || verifyRes?.data?.target || currentTarget;
      setCurrentTarget({ ...updatedTarget, verificationStatus: 'Verified' });
      setStep(3);
    } catch (err: any) {
      alert(err.message || 'Error verifying target');
    }
  };

  const handleStartScan = async () => {
    if (!currentTarget) return;
    try {
      const targetIdentifier = currentTarget.id || currentTarget.url;
      await startScanMutation.mutateAsync(targetIdentifier);
      setStep(4);
    } catch (err: any) {
      alert(err.message || 'Error starting scan');
    }
  };

  // Flatten targets for display
  const allTargets = (projectsData || []).flatMap((p: any) => 
    (p.targets || []).map((t: any) => ({ ...t, projectName: p.name, projectId: p.id }))
  );

  const filteredTargets = selectedFilterProjectId === 'all'
    ? allTargets
    : allTargets.filter((t: any) => t.projectId === selectedFilterProjectId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-cyan-400" />
            إدارة الأهداف والمشاريع
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            قم بإنشاء مشاريعك الأمنية، إضافة نطاقاتك، والتحقق من ملكيتها وإطلاق الفحوصات.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={() => setIsProjectModalOpen(true)} 
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 gap-2 text-sm"
          >
            <FolderPlus className="h-4 w-4 text-cyan-400" />
            إضافة مشروع جديد
          </Button>
          <Button 
            onClick={() => handleOpenModal()} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            إضافة هدف جديد
          </Button>
        </div>
      </div>

      {/* Projects Overview Cards */}
      {projectsData && projectsData.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              المشاريع الأمنية المسجلة ({projectsData.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsData.map((proj: any, pIdx: number) => {
              const targetCount = (proj.targets || []).length;
              const isSelected = selectedFilterProjectId === proj.id;
              return (
                <div 
                  key={`proj-${proj.id}-${pIdx}`}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-500/5' 
                      : 'bg-[#0a0f1c] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{proj.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{proj.description || 'مشروع أمني'}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                      {targetCount} أهداف
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setSelectedFilterProjectId(isSelected ? 'all' : proj.id)}
                      className={`text-xs flex items-center gap-1 transition-colors ${
                        isSelected ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {isSelected ? 'عرض الكل' : 'تصفية الأهداف'}
                    </button>

                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleOpenModal(proj.id)}
                      className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 px-2"
                    >
                      <Plus className="w-3 h-3 ml-1" /> إضافة هدف
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Target List Table */}
      <Card className="bg-[#0a0f1c] border-slate-800">
        <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            سجل الأهداف والأصول الرقمية
            {selectedFilterProjectId !== 'all' && (
              <span className="text-xs font-normal text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                مفلترة حسب المشروع
              </span>
            )}
          </CardTitle>

          {projectsData && projectsData.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 shrink-0">التصفية:</span>
              <select 
                value={selectedFilterProjectId}
                onChange={e => setSelectedFilterProjectId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
              >
                <option value="all">كافة المشاريع ({allTargets.length} هدف)</option>
                {projectsData.map((p: any, idx: number) => (
                  <option key={`filter-${p.id}-${idx}`} value={p.id}>{p.name} ({(p.targets || []).length})</option>
                ))}
              </select>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium text-right">الهدف / المشروع</th>
                  <th className="px-6 py-4 font-medium text-right">الرابط</th>
                  <th className="px-6 py-4 font-medium text-right">النوع</th>
                  <th className="px-6 py-4 font-medium text-right">الحالة</th>
                  <th className="px-6 py-4 font-medium text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">جاري التحميل...</td></tr>
                ) : filteredTargets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      لا توجد أهداف مطابقة للفيلم الحالي. قم بإضافة هدف جديد للبدء.
                    </td>
                  </tr>
                ) : (
                  filteredTargets.map((t: any, idx: number) => (
                    <tr key={`target-${t.projectId || 'p'}-${t.id || 't'}-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.projectName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs dir-ltr text-right">{t.url}</td>
                      <td className="px-6 py-4 text-slate-300">{t.type}</td>
                      <td className="px-6 py-4">
                        {t.verificationStatus === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" /> تم التحقق
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 text-xs bg-amber-400/10 px-2 py-1 rounded">
                            <ShieldAlert className="w-3 h-3" /> بانتظار التحقق
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-left">
                        {t.verificationStatus === 'Verified' ? (
                          <Button variant="ghost" size="sm" onClick={() => {
                            setCurrentTarget(t);
                            setStep(3);
                            setIsModalOpen(true);
                          }} className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 h-8 text-xs">
                            <Play className="w-3 h-3 ml-1" /> فحص الآن
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => {
                            setCurrentTarget(t);
                            setStep(2);
                            setIsModalOpen(true);
                          }} className="text-amber-400 hover:text-amber-300 hover:bg-slate-800 h-8 text-xs">
                            <CheckCircle className="w-3 h-3 ml-1" /> تحقق
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dedicated Add Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-cyan-400" />
                إضافة مشروع أمني جديد
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">اسم المشروع <span className="text-cyan-400">*</span></label>
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  required
                  placeholder="مثال: الخدمات السحابية والفرع الرئيسي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">وصف المشروع</label>
                <textarea 
                  value={newProjectDescription}
                  onChange={e => setNewProjectDescription(e.target.value)}
                  placeholder="نطاق المشروع والأهداف والمواقع التابعة..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="bg-transparent border-slate-800 text-slate-400 hover:text-white"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProjectMutation.isPending || !newProjectName.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[110px]"
                >
                  {createProjectMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Target Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">
                {step === 1 && 'إضافة هدف فحص جديد'}
                {step === 2 && 'التحقق من ملكية الهدف'}
                {step === 3 && 'إطلاق الفحص الأمني'}
                {step === 4 && 'تم بنجاح'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            {/* Stepper Indicator */}
            <div className="px-6 pt-4 pb-2 flex items-center justify-between relative">
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -z-10 translate-y-2"></div>
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-cyan-500 -z-10 translate-y-2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex flex-col items-center gap-2 bg-[#0a0f1c]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s < step ? 'bg-cyan-500 text-white' : s === step ? 'bg-cyan-600 text-white ring-4 ring-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-[10px] ${s <= step ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {s === 1 && 'الإضافة'}
                    {s === 2 && 'التحقق'}
                    {s === 3 && 'الفحص'}
                    {s === 4 && 'النتيجة'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {step === 1 && (
                <form onSubmit={handleAddTarget} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-slate-300">المشروع</label>
                      <button 
                        type="button" 
                        onClick={() => setIsProjectModalOpen(true)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        مشروع جديد
                      </button>
                    </div>
                    <select 
                      value={selectedProjectId}
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    >
                      {projectsData && projectsData.length > 0 ? projectsData.map((p: any, idx: number) => (
                        <option key={`proj-sel-${p.id}-${idx}`} value={p.id}>{p.name}</option>
                      )) : (
                        <option value="">سيتم إنشاء مشروع رئيسي تلقائياً</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">اسم الهدف</label>
                    <input 
                      type="text" 
                      value={targetName}
                      onChange={e => setTargetName(e.target.value)}
                      required
                      placeholder="مثال: الخادم الرئيسي"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">الرابط أو الآي بي</label>
                    <input 
                      type="text" 
                      value={targetUrl}
                      onChange={e => setTargetUrl(e.target.value)}
                      required
                      placeholder="https://example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none dir-ltr text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">النوع</label>
                    <select 
                      value={targetType}
                      onChange={e => setTargetType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Website">موقع إلكتروني</option>
                      <option value="API">واجهة برمجية API</option>
                      <option value="Network">شبكة / آي بي</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={addTargetMutation.isPending} className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[120px]">
                      {addTargetMutation.isPending ? 'جاري الإضافة...' : 'التالي'}
                      {!addTargetMutation.isPending && <ArrowLeft className="w-4 h-4 mr-2" />}
                    </Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-200 text-sm">
                    لأسباب أمنية وقانونية، يجب التحقق من ملكيتك لهذا النطاق قبل السماح بإجراء أي فحوصات أمنية نشطة.
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">قم بإضافة هذا الرمز كـ TXT Record في إعدادات DNS للنطاق:</label>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1 pr-3">
                      <code className="text-cyan-400 flex-1 font-mono text-sm">{currentTarget?.verificationToken || 'sniper-verify-xxxxxx'}</code>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent border-slate-700 text-slate-400 hover:text-white">
                      التحقق لاحقاً
                    </Button>
                    <Button onClick={handleVerify} disabled={verifyTargetMutation.isPending} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white">
                      {verifyTargetMutation.isPending ? 'جاري التحقق...' : 'التحقق الآن'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <div className="text-sm">تم التحقق من ملكية <strong>{currentTarget?.url}</strong> بنجاح.</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اختر نوع الفحص الأمني</label>
                    <div className="space-y-2">
                      {scanProfiles.map((p: any, idx: number) => (
                        <label key={`prof-${p.id}-${idx}`} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedProfileId === p.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'}`}>
                          <input 
                            type="radio" 
                            name="profile" 
                            value={p.id}
                            checked={selectedProfileId === p.id}
                            onChange={() => setSelectedProfileId(p.id)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-white text-sm">{p.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{p.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={handleStartScan} 
                      disabled={startScanMutation.isPending || !selectedProfileId} 
                      className="bg-cyan-600 hover:bg-cyan-500 text-white w-full"
                    >
                      {startScanMutation.isPending ? 'جاري البدء...' : 'إطلاق الفحص الأمني الآن'}
                      {!startScanMutation.isPending && <Play className="w-4 h-4 mr-2" />}
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center py-4 animate-in fade-in slide-in-from-right-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">تم الإطلاق بنجاح!</h3>
                    <p className="text-slate-400 text-sm">
                      يعمل محرك Sniper AI الآن في الخلفية على فحص الهدف <strong>{currentTarget?.name}</strong>. يمكنك متابعة التقدم لحظياً أو استعراض التقرير النهائي عند الانتهاء.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button onClick={() => { setIsModalOpen(false); navigate('/scans'); }} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 gap-2">
                      <Search className="w-4 h-4" /> متابعة الفحص
                    </Button>
                    <Button onClick={() => { setIsModalOpen(false); navigate('/reports'); }} className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
                      <FileText className="w-4 h-4" /> الانتقال للتقارير
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

