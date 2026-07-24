import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 font-medium rounded-md whitespace-nowrap border transition-colors select-none";

  const variantStyles = {
    critical: "bg-red-950/60 border-red-500/40 text-red-400 shadow-sm shadow-red-950/20",
    high: "bg-orange-950/60 border-orange-500/40 text-orange-400 shadow-sm shadow-orange-950/20",
    medium: "bg-amber-950/60 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-950/20",
    low: "bg-slate-800/80 border-slate-700 text-slate-300",
    info: "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950/20",
    success: "bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-950/20",
    warning: "bg-yellow-950/60 border-yellow-500/40 text-yellow-400 shadow-sm shadow-yellow-950/20",
    dark: "bg-slate-900 border-slate-800 text-slate-400",
    outline: "bg-transparent border-slate-700 text-slate-300",
  };

  const dotColors = {
    critical: "bg-red-400 animate-pulse",
    high: "bg-orange-400",
    medium: "bg-amber-400",
    low: "bg-slate-400",
    info: "bg-cyan-400",
    success: "bg-emerald-400",
    warning: "bg-yellow-400",
    dark: "bg-slate-500",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      dir="rtl"
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: string; size?: 'sm' | 'md' | 'lg' }> = ({ severity, size = 'md' }) => {
  const norm = String(severity || '').toUpperCase();
  if (norm === 'CRITICAL' || norm === 'حرج') {
    return <Badge variant="critical" size={size} dot>حرج جداً</Badge>;
  }
  if (norm === 'HIGH' || norm === 'عالي') {
    return <Badge variant="high" size={size} dot>عالي الخطورة</Badge>;
  }
  if (norm === 'MEDIUM' || norm === 'متوسط') {
    return <Badge variant="medium" size={size} dot>متوسط الخطورة</Badge>;
  }
  if (norm === 'LOW' || norm === 'منخفض') {
    return <Badge variant="low" size={size} dot>منخفض</Badge>;
  }
  return <Badge variant="info" size={size} dot>معلوماتي</Badge>;
};

export const VerificationBadge: React.FC<{ verified: boolean; size?: 'sm' | 'md' | 'lg' }> = ({ verified, size = 'md' }) => {
  return verified ? (
    <Badge variant="success" size={size}>مؤكد الملكية</Badge>
  ) : (
    <Badge variant="warning" size={size}>في انتظار التأكيد</Badge>
  );
};
