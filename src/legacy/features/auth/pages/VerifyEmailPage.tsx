import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

interface VerifyEmailPageProps {
  token?: string;
  onNavigate?: (page: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ token = 'demo-token', onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    authService.verifyEmail(token).then(() => {
      setSuccess(true);
      setLoading(false);
    }).catch(() => {
      setSuccess(false);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden" dir="rtl">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>توثيق الهوية الرقمية</span>
        </div>

        {loading ? (
          <div className="space-y-4 py-8">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">جاري التأكد من رمز التوثيق الخاص بريدك...</h3>
          </div>
        ) : success ? (
          <div className="space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">تم توثيق البريد الإلكتروني بنجاح!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              حسابك الأمني أصبح موثقاً بالكامل وجاهزاً للبدء في تشغيل فحص الأهداف واختبارات الاختراق.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('dashboard');
                else window.location.hash = '#/dashboard';
              }}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 hover:brightness-110 transition-all inline-flex items-center gap-2"
            >
              <span>الانتقال إلى لوحة التحكم الرئيسية</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">رابط التوثيق غير صالح أو انتهت مدته</h2>
            <p className="text-xs text-slate-400">
              يرجى إعادة طلب رابط توثيق جديد من إعدادات الحساب.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else window.location.hash = '#/login';
              }}
              className="mt-4 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
