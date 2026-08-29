import React from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const Analysis: React.FC = () => {
  const { analysisProgress } = useMetrologyStore();

  const steps = [
    { label: 'Package image processed & unwarped', minProgress: 20 },
    { label: 'Text detected via computer vision', minProgress: 40 },
    { label: 'OCR completed & font height measured', minProgress: 60 },
    { label: 'Mandatory declarations extracted', minProgress: 80 },
    { label: 'Verifying Legal Metrology (Packaged Commodities) Rules 2011...', minProgress: 100 },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="gov-card max-w-lg w-full p-8 sm:p-9 space-y-6 text-center border-2 border-blue-200/80 bg-white shadow-xl rounded-3xl relative overflow-hidden">
        
        {/* Glow pulse background */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-18 h-18 mx-auto rounded-3xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center shadow-inner relative">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-blue-700 text-white">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analyzing Packaging...</h2>
          <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">
            AI Optical Pipeline & Rule 6 Verification Engine
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
            <span>Inspection Progress</span>
            <span className="text-blue-700">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/80">
            <div
              className="h-full bg-blue-700 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step AI Process Checklist */}
        <div className="space-y-3 text-left pt-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
          {steps.map((step, idx) => {
            const isDone = analysisProgress >= step.minProgress;
            const isCurrent = analysisProgress < step.minProgress && (idx === 0 || analysisProgress >= steps[idx - 1].minProgress);

            return (
              <div key={idx} className="flex items-center gap-3 text-xs font-semibold transition-all">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={isDone ? 'text-slate-900 font-bold' : isCurrent ? 'text-blue-900 font-black' : 'text-slate-400'}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
