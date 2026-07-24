import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Component Tree:', error, errorInfo);
  }

  private handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
  };

  public render() {
    const state = (this as any).state as ErrorBoundaryState;
    const props = (this as any).props as ErrorBoundaryProps;

    if (state.hasError) {
      if (props.fallback) {
        return props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 m-6" dir="rtl">
          <div className="max-w-md text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/30">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">استثناء غير متوقع في الواجهة</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              حدث خطأ في النظام أثناء معالجة عناصر الواجهة. تم عزله بأمان صوناً لاستقرار المنصة.
            </p>
            {state.error && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-rose-300 text-right w-full mb-6 overflow-x-auto">
                {state.error.toString()}
              </div>
            )}
            <Button variant="primary" onClick={this.handleReset}>
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة تحميل المكون
            </Button>
          </div>
        </div>
      );
    }

    return props.children;
  }
}
