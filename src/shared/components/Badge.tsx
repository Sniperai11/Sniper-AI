import React from 'react';
import { SeverityLevel, VerificationStatus } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide font-mono select-none uppercase border";
  
  const variantStyles = {
    default: "bg-slate-950 text-slate-400 border-slate-800",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-950/40 text-amber-400 border-amber-500/20",
    danger: "bg-red-950/40 text-red-400 border-red-500/20",
    info: "bg-cyan-950/40 text-cyan-400 border-cyan-500/20",
  };

  return (
    <span 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: SeverityLevel | string }> = ({ severity }) => {
  const norm = String(severity).toUpperCase();
  let variant: 'danger' | 'warning' | 'info' | 'default' = 'default';
  let label = severity;

  if (norm === 'CRITICAL') {
    variant = 'danger';
    label = 'حرج (Critical)';
  } else if (norm === 'HIGH') {
    variant = 'danger';
    label = 'عالٍ (High)';
  } else if (norm === 'MEDIUM') {
    variant = 'warning';
    label = 'متوسط (Medium)';
  } else if (norm === 'LOW') {
    variant = 'info';
    label = 'منخفض (Low)';
  }

  return <Badge variant={variant}>{label}</Badge>;
};

export const VerificationBadge: React.FC<{ status: VerificationStatus | string }> = ({ status }) => {
  const mapping: Record<string, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
    Verified: { variant: 'success', label: 'تم التحقق' },
    Pending: { variant: 'warning', label: 'قيد الانتظار' },
    Failed: { variant: 'danger', label: 'فشل التحقق' }
  };
  const config = mapping[status] || { variant: 'warning', label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
