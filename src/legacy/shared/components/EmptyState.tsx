import React from 'react';
import { Shield, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-10 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center justify-center my-6 ${className}`} dir="rtl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
        {icon || <Shield className="w-7 h-7" />}
      </div>
      <h4 className="text-base font-bold text-slate-200 mb-2">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          <Plus className="w-4 h-4 ml-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
