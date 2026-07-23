import React, { useState } from 'react';
import { Mail, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ForgotPasswordPageProps {
  onNavigate?: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني الخاص بحسابك.');
      return;
    }
    setErrorMsg(null);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل إرسال طلب استعادة كلمة المرور.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden" dir="rtl">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>استعادة صلاحيات الوصول الآمن</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            نسيت كلمة المرور؟
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            أدخل عنوان البريد الإلكتروني المرتبط بحسابك وسنقوم بإرسال رابط تعيين كلمة المرور فوراً.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">تم إرسال رابط التغيير بنجاح!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              يرجى فحص صندوق الوارد بريدك الإلكتروني <span className="font-mono font-bold text-cyan-400">{email}</span> والضغط على الرابط لإعادة التعيين.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else window.location.hash = '#/login';
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold hover:bg-slate-800 transition-colors"
            >
              العودة لصفحة تسجيل الدخول
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني المسجل</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.sa"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>جاري الإرسال...</span>
              ) : (
                <>
                  <span>إرسال رابط إعادة التعيين</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('login');
                  else window.location.hash = '#/login';
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← العودة إلى صفحة تسجيل الدخول
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
