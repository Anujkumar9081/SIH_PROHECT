import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { ComplianceStatus } from '../types/metrology';

interface ComplianceCardProps {
  declarations: {
    manufacturer: boolean;
    netQuantity: boolean;
    mrp: boolean;
    mfgDate: boolean;
    consumerCare: boolean;
  };
  overallStatus: ComplianceStatus;
  confidenceScore: number;
}

export const ComplianceCard: React.FC<ComplianceCardProps> = ({
  declarations,
  overallStatus,
  confidenceScore,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const items = [
    { 
      label: 'Manufacturer Name & Address', 
      ok: declarations.manufacturer,
      rule: 'Rule 6(1)(a)',
      detail: 'Name and complete address of the manufacturer or packer clearly printed on Principal Display Panel (PDP).'
    },
    { 
      label: 'Net Quantity & Unit Symbol', 
      ok: declarations.netQuantity,
      rule: 'Rule 6(1)(e) & Rule 7',
      detail: 'Standard units of weight or measure (g, kg, ml, l) with prescribed minimum numeral font height.'
    },
    { 
      label: 'Maximum Retail Price (MRP)', 
      ok: declarations.mrp,
      rule: 'Rule 6(1)(m)',
      detail: 'Inclusive of all taxes in standard INR format without tampering or unauthorized dual pricing.'
    },
    { 
      label: 'Date of Manufacture / Import', 
      ok: declarations.mfgDate,
      rule: 'Rule 6(1)(d)',
      detail: 'Month and year of manufacture or packaging distinctly legible to the consumer.'
    },
    { 
      label: 'Consumer Care Cell Details', 
      ok: declarations.consumerCare,
      rule: 'Rule 6(1)(k)',
      detail: 'Telephone number, email address, and physical address for consumer complaint redressal.'
    },
  ];

  const toggleItem = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getBadgeStyle = () => {
    switch (overallStatus) {
      case 'COMPLIANT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'NEEDS_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'POTENTIAL_VIOLATION':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getBadgeText = () => {
    switch (overallStatus) {
      case 'COMPLIANT': return 'COMPLIANT';
      case 'NEEDS_REVIEW': return 'NEEDS REVIEW';
      case 'POTENTIAL_VIOLATION': return 'POTENTIAL VIOLATION';
    }
  };

  return (
    <div className="gov-card p-6 border rounded-2xl space-y-4 shadow-sm bg-white animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">COMPLIANCE STATUS</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle()}`}>
              {getBadgeText()}
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">
              Confidence: {confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mandatory Declarations</h4>
          <span className="text-[10px] text-slate-400 font-mono">Click row for Rule specs</span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`rounded-xl border transition-all duration-200 cursor-pointer select-none btn-press overflow-hidden ${
                  isExpanded
                    ? 'border-blue-300 bg-blue-50/40 shadow-xs ring-1 ring-blue-400/50'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                      {item.rule}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.ok ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-red-700">
                        <XCircle className="w-4 h-4 text-red-600" /> Missing
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium leading-relaxed bg-white/60">
                    <div className="flex items-start gap-1.5">
                      {item.ok ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{item.detail}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
