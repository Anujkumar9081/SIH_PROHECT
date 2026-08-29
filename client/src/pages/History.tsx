import React, { useState } from 'react';
import { Search, X, Filter, ArrowRight } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';
import { ComplianceStatus } from '../types/metrology';

export const History: React.FC = () => {
  const { inspections, selectInspection } = useMetrologyStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ComplianceStatus>('ALL');

  const filtered = inspections.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(search.toLowerCase()) ||
                          item.brandName.toLowerCase().includes(search.toLowerCase()) ||
                          item.inspectorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (st: 'ALL' | ComplianceStatus) => {
    setStatusFilter(st);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">INSPECTION HISTORY</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Surveillance Ledger & Product Compliance Inspection Archive
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          {filtered.length} Archived Records
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product, brand or inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 btn-press"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs overflow-x-auto max-w-full">
          {(['ALL', 'COMPLIANT', 'NEEDS_REVIEW', 'POTENTIAL_VIOLATION'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs btn-press select-none whitespace-nowrap ${
                statusFilter === st 
                  ? 'bg-blue-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {st === 'ALL' ? 'All Records' : st === 'COMPLIANT' ? 'Compliant' : st === 'NEEDS_REVIEW' ? 'Pending Review' : 'Violations'}
            </button>
          ))}
        </div>

      </div>

      {/* Inspection Ledger Table */}
      <div className="gov-card border rounded-2xl overflow-hidden shadow-xs bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Product & Brand</th>
              <th className="px-5 py-3.5">Inspection Date</th>
              <th className="px-5 py-3.5">Verdict</th>
              <th className="px-5 py-3.5">Enforcement Officer</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
            {filtered.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => selectInspection(item)}
                className="table-row-interactive"
              >
                <td className="px-5 py-4">
                  <div className="font-extrabold text-slate-900 text-sm">{item.productName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.brandName} • Barcode: {item.barcode}</div>
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

                <td className="px-5 py-4 text-slate-700 font-bold">
                  <div>{item.inspectorName}</div>
                  <div className="text-[10px] text-slate-400 font-mono font-normal">{item.district} District</div>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectInspection(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-2xs btn-ripple btn-press"
                  >
                    View Audit
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
