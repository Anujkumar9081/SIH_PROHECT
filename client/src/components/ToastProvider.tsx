import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useMetrologyStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white/95 text-emerald-950';
            case 'warning':
              return 'border-amber-200 bg-white/95 text-amber-950';
            case 'error':
              return 'border-red-200 bg-white/95 text-red-950';
            default:
              return 'border-blue-200 bg-white/95 text-blue-950';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transform transition-all duration-300 animate-slide-up ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-extrabold tracking-tight leading-tight">{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
