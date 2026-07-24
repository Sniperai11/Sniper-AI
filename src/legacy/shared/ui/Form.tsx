import React from 'react';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, required, className = '', ...props }) => (
  <label className={`block text-xs font-semibold text-slate-300 mb-1.5 text-right ${className}`} {...props}>
    {children}
    {required && <span className="text-red-400 mr-1">*</span>}
  </label>
);

export const FormHelper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-[11px] text-slate-400 mt-1 text-right ${className}`}>{children}</p>
);

export const FormError: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs text-red-400 font-medium mt-1 text-right ${className}`}>{children}</p>
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full text-right" dir="rtl">
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute right-3 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#0a0f1d] border text-slate-100 placeholder-slate-500 text-sm rounded-lg py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 ${
              icon ? 'pr-10 pl-3' : 'px-3'
            } ${
              error
                ? 'border-red-500/80 focus:border-red-500'
                : 'border-slate-800/80 focus:border-cyan-500/80'
            } ${className}`}
            {...props}
          />
        </div>
        {error ? <FormError>{error}</FormError> : helperText ? <FormHelper>{helperText}</FormHelper> : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full text-right" dir="rtl">
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <textarea
          ref={ref}
          className={`w-full bg-[#0a0f1d] border text-slate-100 placeholder-slate-500 text-sm rounded-lg p-3 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 min-h-[100px] ${
            error
              ? 'border-red-500/80 focus:border-red-500'
              : 'border-slate-800/80 focus:border-cyan-500/80'
          } ${className}`}
          {...props}
        />
        {error ? <FormError>{error}</FormError> : helperText ? <FormHelper>{helperText}</FormHelper> : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full text-right" dir="rtl">
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <select
          ref={ref}
          className={`w-full bg-[#0a0f1d] border text-slate-100 text-sm rounded-lg px-3 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 ${
            error
              ? 'border-red-500/80 focus:border-red-500'
              : 'border-slate-800/80 focus:border-cyan-500/80'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <FormError>{error}</FormError> : helperText ? <FormHelper>{helperText}</FormHelper> : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none text-right" dir="rtl">
        <input
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 rounded border-slate-700 text-cyan-600 bg-[#0a0f1d] focus:ring-cyan-500/50 focus:ring-2 ${className}`}
          {...props}
        />
        <span className="text-xs text-slate-300">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} dir="rtl">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-cyan-600' : 'bg-slate-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? '-translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
    </label>
  );
};
