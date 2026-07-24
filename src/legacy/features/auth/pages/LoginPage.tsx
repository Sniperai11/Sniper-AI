import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { Shield, Lock } from 'lucide-react';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden" dir="rtl">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>منصة Sniper AI Security • التوثيق الآمن</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            تسجيل الدخول للنظام
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            قم بتقديم البيانات الاعتمادية المعتمدة للوصول إلى مركز القيادة وفحوصات السلامة السيبرانية.
          </p>
        </div>

        <LoginForm
          onSuccess={() => {
            if (onNavigate) onNavigate('dashboard');
            else window.location.hash = '#/dashboard';
          }}
          onNavigateToRegister={() => {
            if (onNavigate) onNavigate('register');
            else window.location.hash = '#/register';
          }}
          onNavigateToForgot={() => {
            if (onNavigate) onNavigate('forgot-password');
            else window.location.hash = '#/forgot-password';
          }}
        />
      </div>

      <p className="mt-8 text-xs text-slate-500 font-mono relative z-10">
        Sniper AI Security Platform • Enterprise Security Directive v2.4
      </p>
    </div>
  );
};

export default LoginPage;
