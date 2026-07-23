import React, { useState } from 'react';
import { Mail, KeyRound, Lock, ArrowRight, AlertCircle, Sparkles, Shield, Smartphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgot?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgot,
}) => {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [requireMfa, setRequireMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [localErr, setLocalErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setLocalErr('يرجى إدخال البريد الإلكتروني المهني.');
      return;
    }
    setLocalErr(null);

    // Simulate MFA check if enabled or custom email
    if (email.includes('mfa') && !requireMfa) {
      setRequireMfa(true);
      return;
    }

    try {
      await login({ email, password, rememberMe });
      if (onSuccess) onSuccess();
    } catch (err) {
      // Handled in hook
    }
  };

  const handleQuickDemo = async (demoEmail: string, mode: string) => {
    setLocalErr(null);
    try {
      await login({ email: demoEmail, password: 'demo-password', mode });
      if (onSuccess) onSuccess();
    } catch (err) {
      // Handled in hook
    }
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      {(error || localErr) && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{localErr || error}</span>
        </div>
      )}

      {requireMfa ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-cyan-900/60 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">المصادقة الثنائية المعززة (MFA)</h4>
            <p className="text-xs text-slate-400">أدخل الرمز المكون من 6 أرقام المرسل إلى تطبيق المصادقة الخاص بك</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">رمز التحقق الأمني (TOTP)</label>
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] font-mono text-lg text-cyan-400 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || mfaCode.length < 6}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'جاري توثيق الرمز...' : 'تأكيد الرمز والتأهل للمنصة'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني المهني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ciso@company.sa"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الحصينة</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
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
              <span>حفظ الجلسة الآمنة</span>
            </label>

            {onNavigateToForgot && (
              <button
                type="button"
                onClick={onNavigateToForgot}
                className="text-cyan-400 hover:underline font-semibold"
              >
                نسيت كلمة المرور؟
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التوثيق وإشعال الجلسة...</span>
            ) : (
              <>
                <span>تسجيل الدخول وبدء العمليات</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>
      )}

      {/* QUICK PRESETS SECTION */}
      <div className="pt-4 border-t border-slate-900 space-y-2">
        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>الدخول السريع بحسابات مجهزة للاختبار:</span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('elhammoh2795@gmail.com', 'company')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-right transition-colors"
          >
            <p className="text-xs font-bold text-white">إبراهيم العتيبي</p>
            <p className="text-[10px] text-slate-400">Admin • CISO</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('hunter.tareq@security.sa', 'hunter')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-right transition-colors"
          >
            <p className="text-xs font-bold text-white">طارق الشمري</p>
            <p className="text-[10px] text-slate-400">Security Hunter</p>
          </button>
        </div>
      </div>

      {onNavigateToRegister && (
        <div className="text-center pt-2 text-xs text-slate-400">
          <span>ليس لديك حساب على المنصة؟ </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-cyan-400 font-bold hover:underline"
          >
            إنشاء حساب جديد للمؤسسة
          </button>
        </div>
      )}
    </div>
  );
};
