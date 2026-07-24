import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'accent' | 'danger' | 'warning' | 'glass';
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  title,
  subtitle,
  headerAction,
  className = '',
  ...props
}) => {
  const baseStyle = "p-5 rounded-xl border transition-all text-right backdrop-blur-sm";
  
  const variantStyles = {
    default: "bg-[#090d16]/90 border-slate-800/80 text-white shadow-xl shadow-black/40",
    muted: "bg-[#050811]/90 border-slate-900 text-slate-300",
    accent: "bg-cyan-950/20 border-cyan-500/30 text-cyan-200 shadow-lg shadow-cyan-950/10",
    danger: "bg-red-950/20 border-red-500/30 text-red-200 shadow-lg shadow-red-950/10",
    warning: "bg-amber-950/20 border-amber-500/30 text-amber-200 shadow-lg shadow-amber-950/10",
    glass: "bg-slate-900/60 border-slate-700/40 text-slate-100 shadow-2xl backdrop-blur-md"
  };

  return (
    <div 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`} 
      dir="rtl"
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div>
            {title && <h4 className="text-sm font-bold text-slate-100">{title}</h4>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`pb-3 mb-4 border-b border-slate-800/80 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-base font-bold text-slate-100 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-slate-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
