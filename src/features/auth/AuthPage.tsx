import React, { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { Shield, Lock, KeyRound, Sparkles, UserCheck, ArrowRight, ShieldAlert } from 'lucide-react';

export const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8" dir="rtl">
      <div className="w-full max-w-xl">
        <AuthModal isInline={true} />
      </div>
    </div>
  );
};

export default AuthPage;
