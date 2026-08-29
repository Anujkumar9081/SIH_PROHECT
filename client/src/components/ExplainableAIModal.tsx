import React, { useState } from 'react';
import { X, HelpCircle, FileCheck, ShieldAlert, CheckCircle2, ZoomIn, ZoomOut } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const ExplainableAIModal: React.FC = () => {
  const { activeViolationForExplainability, setExplainableViolation, selectedInspection } = useMetrologyStore();
  const [isZoomed, setIsZoomed] = useState(false);

  if (!activeViolationForExplainability || !selectedInspection) return null;

  const v = activeViolationForExplainability;

  const handleClose = () => {
    setExplainableViolation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in-up">
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-6 p-6 sm:p-7 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100/80 text-blue-800 border border-blue-200">
              <HelpCircle className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Why was this flagged?</h3>
              <p className="text-[11px] text-slate-500 font-mono font-medium">AI Explainability & Legal Metrology Evidence</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-90 transition btn-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Grid */}
        <div className="space-y-4 text-xs">
          
          {/* Requirement Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-700" />
              Statutory Requirement
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">
              {v.requirement}
            </p>
          </div>

          {/* Evidence Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Evidence & Optical Analysis
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs btn-press"
              >
                {isZoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                <span>{isZoomed ? 'Reset View' : 'Zoom Inspection'}</span>
              </button>
            </div>

            <p className="text-slate-700 text-xs">{v.evidenceText}</p>
            
            <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group cursor-pointer" onClick={() => setIsZoomed(!isZoomed)}>
              <img 
                src={selectedInspection.backImage} 
                alt="Evidence" 
                className={`max-h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`} 
              />
              <div className="absolute inset-0 border-2 border-dashed border-red-500/80 bg-red-500/10 pointer-events-none flex items-center justify-center">
                <span className="bg-red-600 text-white text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg shadow-md animate-pulse">
                  FLAGGED: {v.title}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendation Section */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1">
            <div className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Officer Corrective Action / Notice
            </div>
            <p className="text-blue-950 font-bold leading-relaxed">
              {v.recommendation}
            </p>
          </div>

        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Inspector Guidance • Legal Metrology Act 2009
          </span>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-blue-700 text-white font-extrabold text-xs hover:bg-blue-800 transition shadow-sm btn-ripple btn-press"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
