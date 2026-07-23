import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthText = () => {
    if (!password) return { text: 'غير محددة', color: 'text-slate-500', bar: 'w-0 bg-slate-700' };
    if (score <= 1) return { text: 'ضعيفة جداً', color: 'text-rose-400', bar: 'w-1/4 bg-rose-500' };
    if (score === 2) return { text: 'متوسطة', color: 'text-amber-400', bar: 'w-2/4 bg-amber-500' };
    if (score === 3) return { text: 'قوية', color: 'text-cyan-400', bar: 'w-3/4 bg-cyan-500' };
    return { text: 'حصينة جداً', color: 'text-emerald-400', bar: 'w-full bg-emerald-500' };
  };

  const strength = getStrengthText();

  return (
    <div className="mt-2 space-y-2 dir-rtl">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">قوة كلمة المرور:</span>
        <span className={`font-bold ${strength.color}`}>{strength.text}</span>
      </div>

      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
        <div className={`h-full transition-all duration-300 ${strength.bar}`} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 pt-1">
        <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
          {hasMinLength ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>8 أحرف على الأقل</span>
        </div>
        <div className={`flex items-center gap-1 ${hasUpperLower ? 'text-emerald-400' : 'text-slate-500'}`}>
          {hasUpperLower ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>أحرف كبيرة وصغيرة</span>
        </div>
        <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
          {hasNumber ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>تحتوي أرقام</span>
        </div>
        <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
          {hasSpecial ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>رموز خاصة (!@#$)</span>
        </div>
      </div>
    </div>
  );
};
