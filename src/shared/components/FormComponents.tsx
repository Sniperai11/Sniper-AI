import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 7)}`;
  return (
    <div className="flex flex-col gap-1.5 w-full text-right" dir="rtl">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
          error
            ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
            : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
      {!error && helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', id, ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 7)}`;
  return (
    <div className="flex flex-col gap-1.5 w-full text-right" dir="rtl">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-slate-100 focus:outline-none transition-all ${
          error
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const areaId = id || `textarea-${Math.random().toString(36).substring(2, 7)}`;
  return (
    <div className="flex flex-col gap-1.5 w-full text-right" dir="rtl">
      {label && (
        <label htmlFor={areaId} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
          error
            ? 'border-rose-500/80 focus:border-rose-400'
            : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
    </div>
  );
};
