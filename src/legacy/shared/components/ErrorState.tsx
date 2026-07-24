import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ في تحميل البيانات',
  message = 'تعذر الاتصال بالخادم الأمني. يرجى المحاولة مرة أخرى أو التحقق من الاتصال.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-2xl bg-slate-900/60 border border-rose-900/30 text-center flex flex-col items-center justify-center my-6 ${className}`} dir="rtl">
      <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-200 mb-2">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 ml-2" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
