import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  position = 'right',
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: position === 'bottom' ? 'h-1/3' : 'w-80',
    md: position === 'bottom' ? 'h-1/2' : 'w-96',
    lg: position === 'bottom' ? 'h-2/3' : 'w-[28rem]',
    xl: position === 'bottom' ? 'h-3/4' : 'w-[36rem]',
  };

  const positionClasses = {
    right: 'top-0 right-0 h-full border-l',
    left: 'top-0 left-0 h-full border-r',
    bottom: 'bottom-0 left-0 right-0 w-full border-t rounded-t-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm" dir="rtl">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`fixed ${positionClasses[position]} ${sizeClasses[size]} bg-[#0a0f1d] border-slate-800 shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/40 shrink-0">
          <div>
            {title && <h3 className="text-base font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200 text-sm grow">
          {children}
        </div>

        {/* Drawer Footer */}
        {footer && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
