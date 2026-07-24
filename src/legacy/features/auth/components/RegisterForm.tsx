import React, { useState } from 'react';
import { User, Mail, Building, KeyRound, ArrowRight, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrength } from './PasswordStrength';

interface RegisterFormProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const { register, loading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'company' | 'hunter'>('company');
  const [role, setRole] = useState<'Admin' | 'Security Analyst' | 'Viewer'>('Admin');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);

    if (!name.trim() || !email.trim()) {
      setLocalErr('يرجى تعبئة كافة البيانات الأساسية المطلوبة.');
      return;
    }

    if (password && password !== confirmPassword) {
      setLocalErr('كلمات المرور غير متطابقة.');
      return;
    }

    if (!agreeTerms) {
      setLocalErr('يجب الموافقة على شروط الخدمة وسياسة الإفصاح عن الثغرات.');
      return;
    }

    try {
      await register({
        name,
        email,
        companyName: companyName || 'شركة أمان رقمي',
        password,
        mode,
        role,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      // Handled in hook
    }
  };

  return (
    <div className="w-full space-y-5" dir="rtl">
      {(error || localErr) && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{localErr || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل للمشرف الأمني</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="د. إبراهيم العتيبي"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني الرسمي</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.sa"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنشأة أو المؤسسة</label>
            <div className="relative">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="أرامكو للحلول الرقمية"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور الحصينة</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">تأكيد كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <PasswordStrength password={password} />

        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع الحساب ونطاق العمليات</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setMode('company')}
              className={`p-3 rounded-xl border text-right transition-all ${
                mode === 'company'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>حساب مؤسسي</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">إدارة الأهداف وفحص البنية التحتية</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('hunter')}
              className={`p-3 rounded-xl border text-right transition-all ${
                mode === 'hunter'
                  ? 'bg-amber-950/60 border-amber-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>صياد مكافآت</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">البحث عن الثغرات وتقديم البلاغات</p>
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-400 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
          />
          <span className="leading-relaxed">
            أقر بالموافقة على <span className="text-cyan-400 underline">اتفاقية استخدام Sniper AI Security</span> وبنود الدستور الهندسي الأمني.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>جاري إنشاء الحساب والمجلس الأمني...</span>
          ) : (
            <>
              <span>إنشاء الحساب وتفعيل الجلسة</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </>
          )}
        </button>
      </form>

      {onNavigateToLogin && (
        <div className="text-center pt-2 text-xs text-slate-400">
          <span>لديك حساب بالفعل؟ </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-cyan-400 font-bold hover:underline"
          >
            تسجيل الدخول
          </button>
        </div>
      )}
    </div>
  );
};
