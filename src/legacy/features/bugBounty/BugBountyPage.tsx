import React, { useState } from 'react';
import { Trophy, HelpCircle, ArrowUpRight, Check, Send, Sparkles, RefreshCw, Lock, Award, Eye, Code } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export interface BugBountyPageProps {
  bbPrograms: any[];
  bbLeaderboard: any[];
  bbSubmissions: any[];
  userProfile: any;
  actionLoading: string | null;
  onSubmitBountyReport: (payload: any) => void;
  onReviewBountyReport: (submissionId: string, status: string, points: number, reward: number) => void;
  onGenerateBountyDraft: (payload: any) => void;
  bountyReportDraft: any;
  bountyReportLoading: boolean;
}

export const BugBountyPage: React.FC<BugBountyPageProps> = ({
  bbPrograms = [],
  bbLeaderboard = [],
  bbSubmissions = [],
  userProfile,
  actionLoading,
  onSubmitBountyReport,
  onReviewBountyReport,
  onGenerateBountyDraft,
  bountyReportDraft,
  bountyReportLoading
}) => {
  const safeBbPrograms = Array.isArray(bbPrograms) ? bbPrograms : [];
  const safeBbLeaderboard = Array.isArray(bbLeaderboard) ? bbLeaderboard : [];
  const safeBbSubmissions = Array.isArray(bbSubmissions) ? bbSubmissions : [];
  const [selectedProg, setSelectedProg] = useState('');
  const [vulnTitle, setVulnTitle] = useState('');
  const [vulnDesc, setVulnDesc] = useState('');
  const [vulnSteps, setVulnSteps] = useState('');
  const [vulnProof, setVulnProof] = useState('');

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProg || !vulnTitle || !vulnDesc) return;
    
    onSubmitBountyReport({
      programId: selectedProg,
      title: vulnTitle,
      description: vulnDesc,
      stepsToReproduce: vulnSteps,
      proofOfConcept: vulnProof
    });

    setVulnTitle('');
    setVulnDesc('');
    setVulnSteps('');
    setVulnProof('');
  };

  const handleGenerateDraft = () => {
    if (!selectedProg || !vulnTitle || !vulnDesc) return;
    onGenerateBountyDraft({
      title: vulnTitle,
      description: vulnDesc,
      stepsToReproduce: vulnSteps
    });
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>برنامج الإفصاح المسؤول ومكافآت الثغرات (Safe Harbor Verified)</span>
          </div>
          <h2 className="text-2xl font-black text-white">بوابة صائدي الثغرات والمكافآت الأمنية</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            مرحباً بك في المجتمع التقني للحماية التشاركية. نحن في شركة DigitalTech Solutions نقدر جهود الباحثين الأمنيين الهاكرز الأخلاقيين لتعزيز خطوطنا الدفاعية. اكتشف ثغرة، أبلغنا بأمان، واحصل على تكريم مالي ومكان في لوحة الشرف!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REPORT SUBMISSION FORM */}
        <div className="lg:col-span-8 space-y-6">
          <Card title="الإبلاغ عن ثغرة أمنية (Submit Vulnerability)">
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">برنامج الثغرات المستهدف</label>
                  <select 
                    value={selectedProg}
                    onChange={e => setSelectedProg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  >
                    <option value="">اختر برنامجاً...</option>
                    {safeBbPrograms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">عنوان الثغرة</label>
                  <input 
                    type="text" 
                    value={vulnTitle}
                    onChange={e => setVulnTitle(e.target.value)}
                    placeholder="مثال: SQL Injection في صفحة المنتجات"
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">الوصف العام للأثر الأمني للثغرة</label>
                <textarea 
                  value={vulnDesc}
                  onChange={e => setVulnDesc(e.target.value)}
                  placeholder="وصف فني تفصيلي..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">خطوات إعادة الإنتاج (Steps to Reproduce)</label>
                <textarea 
                  value={vulnSteps}
                  onChange={e => setVulnSteps(e.target.value)}
                  placeholder="1. افتح الرابط التالي... 2. ضع الـ Payload..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleGenerateDraft}
                  disabled={bountyReportLoading || !selectedProg || !vulnTitle || !vulnDesc}
                >
                  {bountyReportLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> صياغة التقرير بالذكاء الاصطناعي...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> صياغة مسودة تقنية بالذكاء الاصطناعي
                    </>
                  )}
                </Button>
                <Button type="submit">إرسال البلاغ الفني</Button>
              </div>
            </form>
          </Card>

          {/* BOUNTY REPORT AI DRAFT */}
          {bountyReportDraft && (
            <Card title="تقرير مسودة الذكاء الاصطناعي المولد" className="bg-slate-900 border border-slate-800">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg text-xs font-mono text-slate-300 leading-relaxed space-y-3">
                <p>{bountyReportDraft}</p>
              </div>
            </Card>
          )}
        </div>

        {/* LEADERBOARD & STATS */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="لوحة شرف الباحثين الأمنيين">
            <div className="space-y-3">
              {safeBbLeaderboard.map((leader: any) => (
                <div key={leader.rank} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full font-bold font-mono text-[11px] flex items-center justify-center border ${
                      leader.rank === 1 ? 'bg-amber-950/80 text-amber-400 border-amber-500/30' :
                      leader.rank === 2 ? 'bg-slate-800 text-slate-300 border-slate-700' :
                      leader.rank === 3 ? 'bg-amber-900/40 text-amber-600 border-amber-900/20' :
                      'bg-slate-900 text-slate-400 border-slate-850'
                    }`}>
                      {leader.rank}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold text-white">{leader.name}</div>
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(leader?.badges) ? leader.badges : []).map((b: string, i: number) => (
                          <span key={i} className="bg-slate-900 text-slate-400 px-1 py-0.5 rounded text-[8px]">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-xs font-bold text-amber-400 font-mono">{leader.points} Pts</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
