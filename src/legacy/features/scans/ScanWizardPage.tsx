import React, { useState } from 'react';
import { 
  Globe, Code, Smartphone, Server, Cpu, CheckCircle2, Terminal, 
  Play, RefreshCw, ShieldAlert, Sliders, FileText, Lock, Sparkles, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export interface ScanWizardPageProps {
  onStartScan: (scanParams: any) => void;
  activeScans?: any[];
  onOpenTerminal?: (scanJobId: string) => void;
}

export const ScanWizardPage: React.FC<ScanWizardPageProps> = ({
  onStartScan,
  activeScans = [],
  onOpenTerminal
}) => {
  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [targetType, setTargetType] = useState<string>('Website');
  const [targetUrl, setTargetUrl] = useState<string>('example.com');
  const [scanType, setScanType] = useState<string>('Full Security Audit');
  const [advancedOptions, setAdvancedOptions] = useState({
    owaspTop10: true,
    apiSecurity: true,
    authTesting: true,
    aiAnalysis: true,
    generateReport: true,
  });

  // Live Scan Simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLogList, setScanLogList] = useState<string[]>([]);

  const toggleOption = (key: keyof typeof advancedOptions) => {
    setAdvancedOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLaunchScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogList([
      "Scanning Target...",
      "✓ Discovering Assets",
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step === 1) {
        setScanProgress(25);
        setScanLogList(prev => [...prev, "✓ Checking Headers"]);
      } else if (step === 2) {
        setScanProgress(50);
        setScanLogList(prev => [...prev, "✓ Testing APIs"]);
      } else if (step === 3) {
        setScanProgress(80);
        setScanLogList(prev => [...prev, "✓ Running Security Rules"]);
      } else if (step === 4) {
        setScanProgress(100);
        setScanLogList(prev => [...prev, "✓ AI Analysis Completed"]);
        clearInterval(interval);
        if (onStartScan) {
          onStartScan({
            targetType,
            targetUrl,
            scanType,
            advancedOptions
          });
        }
      }
    }, 1200);
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* HEADER BANNER */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
        <div className="space-y-1 relative z-10 text-right">
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            Security Scan Wizard (معالج الفحص الأمني)
          </h2>
          <p className="text-xs text-slate-400">
            قم بإعداد وتشغيل فحص أمني جديد للأصول الرقمية الخاصة بشركتك في 4 خطوات بسيطة مع التحليل الحي بالذكاء الاصطناعي.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WIZARD FORM (7 cols) */}
        <Card title="إنشاء فحص أمني جديد (Create New Scan)" className="lg:col-span-7 space-y-6">
          
          {/* Step Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 border-b border-slate-800 pb-4">
            {[
              { num: 1, label: "الهدف" },
              { num: 2, label: "الرابط" },
              { num: 3, label: "نوع الفحص" },
              { num: 4, label: "خيارات متقدمة" }
            ].map(step => (
              <div 
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
                  currentStep === step.num 
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 font-bold' 
                    : currentStep > step.num 
                    ? 'bg-slate-900 border-slate-800 text-emerald-400' 
                    : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono">STEP {step.num}</div>
                <div className="text-xs truncate mt-0.5">{step.label}</div>
              </div>
            ))}
          </div>

          {/* STEP 1: TARGET SELECTION */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200">الخطوة 1: اختيار المورد والهدف الأمني (Target Selection)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Website', label: 'Website', icon: Globe, desc: 'موقع ويب' },
                  { id: 'API', label: 'API', icon: Code, desc: 'واجهة برمجية' },
                  { id: 'Mobile App', label: 'Mobile App', icon: Smartphone, desc: 'تطبيق هاتف' },
                  { id: 'Cloud Infrastructure', label: 'Cloud Infrastructure', icon: Server, desc: 'بنية سحابية' },
                  { id: 'Source Code', label: 'Source Code', icon: Cpu, desc: 'شفرة برمجية' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetType(item.id)}
                      className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between h-28 ${
                        targetType === item.id 
                          ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${targetType === item.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setCurrentStep(2)} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl">
                  المتابعة للخطوة التالية
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TARGET URL */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200">الخطوة 2: إضافة عنوان ورابط الهدف (Target URL)</h3>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">رابط الهدف المستهدف للفحص:</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="example.com أو https://api.company.com"
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => setCurrentStep(1)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">رجوع</button>
                <Button onClick={() => setCurrentStep(3)} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl">
                  المتابعة للخطوة التالية
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SCAN TYPE */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200">الخطوة 3: تحديد نوع وطبيعة الفحص (Scan Type)</h3>
              <div className="space-y-2">
                {[
                  { id: 'Quick Scan', title: 'Quick Scan', desc: 'فحص سريع للمنافذ والشهادات والعناوين الخارجية' },
                  { id: 'Full Security Audit', title: 'Full Security Audit', desc: 'تدقيق أمني شامل لكافة الواجهات والثغرات المعرفية' },
                  { id: 'Penetration Test', title: 'Penetration Test', desc: 'اختبار اختراق عميق بمحاكاة سيناريوهات المهاجمين' },
                  { id: 'Compliance Scan', title: 'Compliance Scan', desc: 'فحص الامتثال لمعايير ISO 27001 و PCI-DSS و OWASP' },
                ].map(st => (
                  <label
                    key={st.id}
                    onClick={() => setScanType(st.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      scanType === st.id 
                        ? 'bg-cyan-950/60 border-cyan-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input type="radio" checked={scanType === st.id} readOnly className="accent-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{st.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{st.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => setCurrentStep(2)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">رجوع</button>
                <Button onClick={() => setCurrentStep(4)} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl">
                  المتابعة للخطوة التالية
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ADVANCED OPTIONS & START */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200">الخطوة 4: خيارات الفحص المتقدمة (Advanced Options)</h3>
              <div className="space-y-2.5">
                {[
                  { key: 'owaspTop10', label: 'OWASP Top 10 Security Rules' },
                  { key: 'apiSecurity', label: 'API Security & Endpoint Inspection' },
                  { key: 'authTesting', label: 'Authentication & Session Testing' },
                  { key: 'aiAnalysis', label: 'AI Analysis & Remediation Suggestion' },
                  { key: 'generateReport', label: 'Generate Executive & Technical Report' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(advancedOptions[opt.key as keyof typeof advancedOptions])}
                      onChange={() => toggleOption(opt.key as keyof typeof advancedOptions)}
                      className="w-4 h-4 rounded accent-cyan-500"
                    />
                    <span className="text-xs font-medium text-slate-200">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button onClick={() => setCurrentStep(3)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">رجوع</button>
                <Button
                  onClick={handleLaunchScan}
                  disabled={isScanning}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  بدء الفحص الآن (Start Scan)
                </Button>
              </div>
            </motion.div>
          )}

        </Card>

        {/* LIVE SCAN MONITOR TERMINAL (5 cols) */}
        <Card title="Live Scan Monitor (شاشة الفحص المباشرة)" className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-[#070B14] rounded-xl border border-slate-800 font-mono text-xs space-y-3 min-h-[360px] flex flex-col justify-between">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[11px]">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Target: {targetUrl}
                </span>
                <Badge variant={isScanning ? "info" : "success"}>
                  {isScanning ? "Scanning..." : "Standby"}
                </Badge>
              </div>

              {/* Console Checklist */}
              <div className="space-y-2 text-[11px] text-slate-300">
                {scanLogList.length === 0 ? (
                  <p className="text-slate-500 italic py-8 text-center">قم بتحديد إعدادات الفحص ثم اضغط "Start Scan" للبدء المباشر.</p>
                ) : (
                  scanLogList.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress:</span>
                <span className="text-cyan-400 font-bold">{scanProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-500 rounded-full" style={{ width: `${scanProgress}%` }}></div>
              </div>
            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};
