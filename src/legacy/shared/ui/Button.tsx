import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variantStyles = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/30 active:scale-95 border border-cyan-500/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 border border-slate-700/50",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/30 active:scale-95 border border-red-500/30",
    outline: "bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 hover:text-white",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-100",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 active:scale-95 border border-emerald-500/30",
  };

  const sizeStyles = {
    xs: "px-2.5 py-1 text-xs rounded-md",
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
