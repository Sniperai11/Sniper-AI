import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'cyan', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorMap = {
    cyan: 'border-cyan-500/30 border-t-cyan-400',
    emerald: 'border-emerald-500/30 border-t-emerald-400',
    amber: 'border-amber-500/30 border-t-amber-400',
    rose: 'border-rose-500/30 border-t-rose-400',
    slate: 'border-slate-700/50 border-t-slate-300',
  };

  return (
    <div
      role="status"
      className={`inline-block rounded-full animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`}
    >
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
};
