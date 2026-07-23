import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { Shield, UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onNavigate?: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden" dir="rtl">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>تسجيل مؤسسة أو صائد ثغرات جديد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            إنشاء حساب أمني جديد
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            انضم إلى منصة Sniper AI Security لإدارة الأهداف الأمنية واكتشاف الثغرات وتلقي التقارير الذكية.
          </p>
        </div>

        <RegisterForm
          onSuccess={() => {
            if (onNavigate) onNavigate('dashboard');
            else window.location.hash = '#/dashboard';
          }}
          onNavigateToLogin={() => {
            if (onNavigate) onNavigate('login');
            else window.location.hash = '#/login';
          }}
        />
      </div>

      <p className="mt-8 text-xs text-slate-500 font-mono relative z-10">
        Sniper AI Security Platform • Enterprise Security Directive v2.4
      </p>
    </div>
  );
};

export default RegisterPage;
