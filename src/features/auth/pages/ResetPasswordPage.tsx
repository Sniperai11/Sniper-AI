import React, { useState } from 'react';
import { KeyRound, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrength } from '../components/PasswordStrength';

interface ResetPasswordPageProps {
  token?: string;
  onNavigate?: (page: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token = 'token-demo', onNavigate }) => {
  const { resetPassword, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('كلمات المرور غير متطابقة.');
      return;
    }
    setErrorMsg(null);
    try {
      await resetPassword(token, password);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشلت عملية تحديث كلمة المرور.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden" dir="rtl">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>تحديد كلمة مرور جديدة</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            قم بإدخال كلمة المرور الجديدة المعززة لتأمين حسابك في المنصة.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">تم تحديث كلمة المرور بنجاح!</h3>
            <p className="text-xs text-slate-300">
              يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else window.location.hash = '#/login';
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:brightness-110 transition-colors"
            >
              الانتقال لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <PasswordStrength password={password} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'جاري تحديث كلمة المرور...' : 'حفظ كلمة المرور الجديدة'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
