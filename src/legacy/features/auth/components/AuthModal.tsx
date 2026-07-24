import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Mail, User, Building, UserCheck, KeyRound, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSecurityStore } from '../../../store/useSecurityStore';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean; // When rendered inline on ProtectedRoute
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  isInline = false
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'quick'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regScope, setRegScope] = useState<'company' | 'hunter'>('company');
  const [regRole, setRegRole] = useState<'Admin' | 'Security Analyst' | 'Viewer'>('Admin');
  const [regTerms, setRegTerms] = useState(true);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, register, actionLoading } = useSecurityStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(loginEmail, loginPassword, regScope);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشلت عملية تسجيل الدخول. يرجى التحقق من البيانات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('يرجى ملء كافة الحقول الأساسية المطلوبة');
      return;
    }
    if (!regTerms) {
      setErrorMsg('يجب الموافقة على شروط الاستخدام وسياسة الإفصاح المنسق عن الثغرات');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        companyName: regCompany || 'شركة أمان رقمي خافية',
        password: regPassword,
        mode: regScope,
        role: regRole
      });
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل إنشاء الحساب الجديد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (email: string, mode: 'company' | 'hunter') => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(email, 'demo-pass', mode);
      if (onClose) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل الدخول السريع');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="w-full max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden" dir="rtl">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close Button if Modal */}
      {!isInline && onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      )}

      {/* Header Badge & Title */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>منصة Sniper AI Security • بوابة التوثيق الآمن</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          {authMode === 'login' ? 'تسجيل الدخول إلى حسابك' : authMode === 'register' ? 'إنشاء حساب جديد في المنصة' : 'الدخول السريع التجريبي'}
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          قم بتسجيل الدخول أو بإنشاء حسابك لإدارة الفحوصات الأمنية وتدقيق الثغرات وإطلاق اختبارات الاختراق الذكية.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-center bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 mb-8 relative z-10">
        <button
          onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            authMode === 'login'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>تسجيل الدخول</span>
        </button>

        <button
          onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            authMode === 'register'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>حساب جديد</span>
        </button>

        <button
          onClick={() => { setAuthMode('quick'); setErrorMsg(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            authMode === 'quick'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>دخول تجريبي</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORMS CONTAINER */}
      <div className="relative z-10">
        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني المهني</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ciso@company.sa"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>تذكر الجلسة على هذا المتصفح</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('استعادة كلمة المرور متاحة عبر التواصل مع مشرف النظام الأمني.'); }} className="text-cyan-400 hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري توثيق الجلسة...</span>
              ) : (
                <>
                  <span>تسجيل الدخول وتفعيل الجلسة</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="د. إبراهيم العتيبي"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.sa"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المؤسسة / الشركة</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="شركة أرامكو السعودية الرقمية"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور الحصينة</label>
              <div className="relative">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Scope selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">تخصص النطاق والعمليات</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRegScope('company')}
                  className={`p-3 rounded-xl border text-right transition-all ${
                    regScope === 'company'
                      ? 'bg-cyan-950/60 border-cyan-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    <span>نطاق الشركات والمؤسسات</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">إدارة المشاريع وإطلاق الفحوصات الأمنية</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegScope('hunter')}
                  className={`p-3 rounded-xl border text-right transition-all ${
                    regScope === 'hunter'
                      ? 'bg-amber-950/60 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>صياد مكافآت أمني مستقل</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">تقديم البلاغات والبحث عن مكافآت الثغرات</p>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-400 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={regTerms}
                onChange={(e) => setRegTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <span className="leading-relaxed">
                أوافق على <span className="text-cyan-400 underline">شروط الاستخدام</span> و <span className="text-cyan-400 underline">سياسة الإفصاح المنسق عن الثغرات (CVD)</span> بالدستور الهندسي.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري إنشاء الحساب...</span>
              ) : (
                <>
                  <span>تأكيد تسجيل الحساب والبدء</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* QUICK DEMO PRESETS */}
        {authMode === 'quick' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-3">
              اختر أحد الحسابات المجهزة مسبقاً لتجربة المنصة فوراً بضغطة زر واحدة بدون كلمة مرور:
            </p>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('elhammoh2795@gmail.com', 'company')}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all text-right group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  إ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    إبراهيم العتيبي (CISO - مدير الأمان التنفيذي)
                  </h4>
                  <p className="text-[11px] text-slate-400">elhammoh2795@gmail.com • شركة أرامكو السعودية</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px] font-mono">
                Admin
              </span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('hunter.tareq@security.sa', 'hunter')}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all text-right group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-bold text-sm">
                  ط
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    طارق الشمري (صياد مكافآت معتمد)
                  </h4>
                  <p className="text-[11px] text-slate-400">hunter.tareq@security.sa • نطاق المكافآت المستقل</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60 text-[10px] font-mono">
                Hunter
              </span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('analyst.sara@cyber.sa', 'company')}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all text-right group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  س
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    سارة القحطاني (محلل أمني ومدقق شفرات)
                  </h4>
                  <p className="text-[11px] text-slate-400">analyst.sara@cyber.sa • فريق الاستجابة للحوادث</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60 text-[10px] font-mono">
                Analyst
              </span>
            </button>
          </div>
        )}
      </div>

      {/* FOOTER BADGES */}
      <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          تشفير الجلسة بـ TLS 1.3 & AES-256
        </span>
        <span className="font-mono text-slate-600">Sniper AI Security v2.4</span>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl my-auto"
      >
        {content}
      </motion.div>
    </div>
  );
};
