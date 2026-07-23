import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'accent' | 'danger' | 'warning';
  title?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  title,
  className = '',
  ...props
}) => {
  const baseStyle = "p-5 rounded-xl border transition-all text-right";
  
  const variantStyles = {
    default: "bg-[#090d16] border-slate-800/80 text-white",
    muted: "bg-[#050811] border-slate-900 text-slate-300",
    accent: "bg-cyan-950/20 border-cyan-500/20 text-cyan-300",
    danger: "bg-red-950/20 border-red-500/20 text-red-300",
    warning: "bg-amber-950/20 border-amber-500/20 text-amber-300",
  };

  return (
    <div 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`} 
      dir="rtl"
      {...props}
    >
      {title && (
        <h4 className="text-sm font-bold text-slate-100 mb-3 border-b border-slate-800 pb-2">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};
