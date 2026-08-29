import React from 'react';
import { AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { FlaggedViolation } from '../types/metrology';
import { useMetrologyStore } from '../store/useMetrologyStore';

interface ViolationCardProps {
  violation: FlaggedViolation;
}

export const ViolationCard: React.FC<ViolationCardProps> = ({ violation }) => {
  const { setExplainableViolation } = useMetrologyStore();

  const handleOpenExplainability = () => {
    setExplainableViolation(violation);
  };

  return (
    <div 
      onClick={handleOpenExplainability}
      className="p-4 border-2 border-amber-200/90 bg-amber-50/50 hover:bg-amber-50/80 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer select-none btn-press hover:border-amber-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-red-100 text-red-600">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-blue-900 transition-colors">
            {violation.title}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
          {violation.category}
        </span>
      </div>

      <div className="text-xs text-slate-700 space-y-1 bg-white/70 p-2.5 rounded-xl border border-amber-200/50">
        <div><strong className="text-slate-900">Status:</strong> <span className="text-red-700 font-bold">{violation.statusText}</span></div>
        <div><strong className="text-slate-900">Evidence:</strong> <span className="text-slate-600">{violation.evidenceImageSide} Packaging Label</span></div>
      </div>

      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenExplainability();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-xs transition btn-ripple btn-press"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-200" />
          <span>Why was this flagged?</span>
        </button>

        <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          AI Evidence <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
