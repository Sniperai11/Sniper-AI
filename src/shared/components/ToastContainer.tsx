import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useSecurityStore } from '../../store/useSecurityStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSecurityStore();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const bgMap = {
    success: 'bg-slate-900/95 border-emerald-500/40 text-slate-100',
    error: 'bg-slate-900/95 border-rose-500/40 text-slate-100',
    warning: 'bg-slate-900/95 border-amber-500/40 text-slate-100',
    info: 'bg-slate-900/95 border-cyan-500/40 text-slate-100',
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-slideUp ${bgMap[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            {iconMap[toast.type]}
            <p className="text-xs font-medium leading-relaxed mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg shrink-0 mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
