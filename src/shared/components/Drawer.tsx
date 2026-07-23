import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]',
  };

  const posClasses = {
    right: 'right-0 top-0 bottom-0 border-l border-slate-800',
    left: 'left-0 top-0 bottom-0 border-r border-slate-800',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`fixed ${posClasses[position]} ${widthClasses[width]} bg-slate-900 shadow-2xl flex flex-col z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          {typeof title === 'string' ? (
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
          ) : (
            title
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
