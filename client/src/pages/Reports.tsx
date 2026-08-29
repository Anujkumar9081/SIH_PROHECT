import React, { useState } from 'react';
import { FileDown, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';
import { generateInspectionPDF } from '../utils/pdfGenerator';
import { ProductInspection } from '../types/metrology';

export const Reports: React.FC = () => {
  const { inspections, selectInspection } = useMetrologyStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleExportPDF = async (item: ProductInspection) => {
    setDownloadingId(item.id);
    try {
      await generateInspectionPDF(item);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportSummary = async () => {
    setDownloadingId('summary');
    try {
      await generateInspectionPDF(inspections[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">COMPLIANCE CERTIFICATE REPORTS</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Official Legal Metrology Inspection Certificates under Packaged Commodities Rules 2011
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          disabled={downloadingId === 'summary'}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md shadow-blue-700/20 transition btn-ripple btn-press"
        >
          {downloadingId === 'summary' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate Summary Report</span>
            </>
          )}
        </button>
      </div>

      {/* Reports Table */}
      <div className="gov-card border rounded-2xl overflow-hidden shadow-xs bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Product Name & Identifier</th>
              <th className="px-5 py-3.5">Inspection Date</th>
              <th className="px-5 py-3.5">Compliance Verdict</th>
              <th className="px-5 py-3.5 text-right">Report Document</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
            {inspections.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => selectInspection(item)}
                className="table-row-interactive"
              >
                <td className="px-5 py-4">
                  <div className="font-extrabold text-slate-900 text-sm">{item.productName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">Barcode: {item.barcode} • {item.brandName}</div>
                </td>

                <td className="px-5 py-4 font-mono font-bold text-slate-600">
                  {new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>

                <td className="px-5 py-4 font-bold">
                  {item.overallStatus === 'COMPLIANT' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Compliant
                    </span>
                  ) : item.overallStatus === 'NEEDS_REVIEW' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Needs Review
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      Potential Violation
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportPDF(item);
                    }}
                    disabled={downloadingId === item.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white font-extrabold text-xs shadow-2xs transition btn-ripple btn-press"
                  >
                    {downloadingId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
