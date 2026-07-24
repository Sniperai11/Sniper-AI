import React from 'react';
import { 
  ShieldAlert, Cpu, Activity, FileText, ArrowLeft, CheckCircle, 
  Terminal, Globe, Lock, Zap, Server, ChevronRight, Eye, Play, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToDashboard: () => void;
  onStartFreeScan: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToDashboard,
  onStartFreeScan,
}) => {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200" dir="rtl">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#070B14]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">Sniper AI</span>
              <span className="text-[10px] font-semibold text-cyan-400 block tracking-widest uppercase">Security Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">المميزات (Features)</a>
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">الحلول (Solutions)</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">الأسعار (Pricing)</a>
            <a href="#docs" className="hover:text-cyan-400 transition-colors">الوثائق (Docs)</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              تسجيل الدخول (Login)
            </button>
            <Button
              onClick={onStartFreeScan}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              ابدأ فحصاً مجانياً (Start Scan)
            </Button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content (Left side in RTL) */}
          <div className="lg:col-span-6 space-y-6 text-right">
            
            <Badge variant="info" className="px-3 py-1 bg-cyan-950/80 border-cyan-500/30 text-cyan-300 text-xs font-semibold rounded-full inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>جيل الذكاء الاصطناعي السيبراني الجديد — Gemini 3.5 Flash</span>
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              AI-Powered <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cybersecurity Testing
              </span> Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Discover vulnerabilities. Analyze risks. Generate security reports automatically.
              <span className="block text-slate-400 mt-2 text-xs">
                منصة أمن سيبراني متكاملة تعتمد على الذكاء الاصطناعي لاكتشاف الثغرات البرمجية والميدانية وتوفير حلول الترميم التلقائي.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                onClick={onStartFreeScan}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-extrabold shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" />
                ابدأ فحص الأمن الآن (Start Security Scan)
              </Button>

              <button
                onClick={onNavigateToDashboard}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/80 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-purple-400" />
                طلب العرض التوضيحي (Request Demo)
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>مطابق لـ OWASP Top 10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>معيار PCI-DSS للمدفوعات</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>شهادة ISO 27001</span>
              </div>
            </div>

          </div>

          {/* Hero 3D Interactive Cyber Preview Graphic */}
          <div className="lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative p-1 rounded-2xl bg-gradient-to-b from-cyan-500/30 via-slate-800 to-purple-600/20 shadow-2xl shadow-cyan-500/10"
            >
              <div className="bg-[#0D111C] rounded-[15px] p-6 space-y-4 overflow-hidden border border-slate-800/80">
                
                {/* Top Terminal Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    SNIPER-AI-SCANNER v3.5 :: LIVE OPERATIONAL MONITOR
                  </span>
                </div>

                {/* Cyber Dashboard Cards Mockup */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Security Score</span>
                    <span className="text-xl font-black text-cyan-400">88%</span>
                    <span className="text-[9px] text-emerald-400 block">↑ +5% هذا الأسبوع</span>
                  </div>
                  <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Active Assets</span>
                    <span className="text-xl font-black text-white">245</span>
                    <span className="text-[9px] text-slate-400 block">مواقع، APIs، وتطبيقات</span>
                  </div>
                  <div className="bg-[#070B14] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Critical Risk</span>
                    <span className="text-xl font-black text-red-400">2</span>
                    <span className="text-[9px] text-red-400/80 block">يتطلب تصحيح فوري</span>
                  </div>
                </div>

                {/* Live Scanner Activity Stream */}
                <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      Scanning api.banking-system.com...
                    </span>
                    <span className="text-emerald-400 font-bold">80% Completed</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full w-[80%] rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 space-y-1">
                    <p className="text-emerald-400">✓ Discovering subdomains & open ports</p>
                    <p className="text-emerald-400">✓ Testing JWT Authentication & Authorization rules</p>
                    <p className="text-amber-400">⚠ Potential SQL Injection vector detected in POST /login</p>
                    <p className="text-purple-400">🤖 AI Brain generating automatic remediation patch...</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#0D111C]/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white">مميزات منصة Sniper AI Security</h2>
            <p className="text-xs sm:text-sm text-slate-400">أحدث التقنيات السيبرانية لمساعدة فرق التطوير والأمان على سد الثغرات وتأمين الموارد.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <Card variant="cyber" className="p-6 space-y-4 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Vulnerability Detection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatically discover security weaknesses using AI-powered analysis with Gemini 3.5 Flash & Pro models.
              </p>
              <div className="text-[11px] text-cyan-400 font-semibold pt-2 flex items-center gap-1">
                استكشاف بالذكاء الاصطناعي <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </Card>

            {/* Feature 2 */}
            <Card variant="cyber" className="p-6 space-y-4 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Penetration Testing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan websites, APIs, mobile applications, and source code repos with advanced non-destructive security engines.
              </p>
              <div className="text-[11px] text-purple-400 font-semibold pt-2 flex items-center gap-1">
                فحص شامل وتلقائي <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </Card>

            {/* Feature 3 */}
            <Card variant="cyber" className="p-6 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Intelligent Security Reports</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate technical and executive security reports instantly in PDF, HTML, and JSON formats.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-2 flex items-center gap-1">
                تقارير إدارية وفنية <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </Card>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-[#070B14] border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Sniper AI Security Platform. All rights reserved.</p>
      </footer>

    </div>
  );
};
