import React from 'react';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Box, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const Dashboard: React.FC = () => {
  const { currentUser, inspections, selectInspection, setActivePage, setCategoryFilter } = useMetrologyStore();

  const totalScanned = 520;
  const compliantCount = 391;
  const flaggedCount = 102;
  const pendingReviews = 27;
  const monthInspections = 184;

  const violationCategories = [
    { name: 'Missing Declaration', count: 35, percentage: 85, color: 'bg-red-600' },
    { name: 'MRP Related', count: 25, percentage: 65, color: 'bg-amber-500' },
    { name: 'Quantity Related', count: 18, percentage: 45, color: 'bg-blue-600' },
    { name: 'Readability', count: 12, percentage: 30, color: 'bg-indigo-600' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-in-up">
      
      {/* Welcome Inspector Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[10px] font-mono font-bold uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Surveillance Terminal Active
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Good Day, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {currentUser.district} • Department of Legal Metrology, Maharashtra
          </p>
        </div>

        <button
          onClick={() => setActivePage('scan')}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-700/25 transition btn-ripple btn-press"
        >
          <Camera className="w-4 h-4" />
          <span>Scan New Product</span>
        </button>
      </div>

      {/* 5 KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Scanned"
          value={totalScanned}
          subtext="All-time scans"
          icon={<Box className="w-4 h-4 text-blue-700" />}
          onClick={() => setActivePage('history')}
        />
        <StatCard
          title="Compliant"
          value={compliantCount}
          subtext="Passed Rule 6"
          variant="success"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          onClick={() => setActivePage('history')}
        />
        <StatCard
          title="Potential Violations"
          value={flaggedCount}
          subtext="Flagged for notice"
          variant="danger"
          icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          onClick={() => setActivePage('violations')}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          subtext="Awaiting officer"
          variant="warning"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          onClick={() => setActivePage('history')}
        />
        <StatCard
          title="Inspections Month"
          value={monthInspections}
          subtext="August 2026"
          icon={<TrendingUp className="w-4 h-4 text-blue-700" />}
          onClick={() => setActivePage('analytics')}
        />
      </div>

      {/* Main Content Grid: Violations Graph + Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Violations by Category Bar Graph (5 cols) */}
        <div className="lg:col-span-5 gov-card p-6 border rounded-2xl space-y-4 shadow-sm bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Violations by Category</h3>
              <p className="text-[11px] text-slate-500">Click a category to filter commodities</p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-lg">102 Flagged</span>
          </div>

          <div className="space-y-3 pt-1">
            {violationCategories.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => setCategoryFilter(cat.name)}
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer select-none btn-press space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="font-mono text-slate-600 text-[11px]">{cat.count} items</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Inspections Table (7 cols) */}
        <div className="lg:col-span-7 gov-card p-6 border rounded-2xl space-y-4 shadow-sm bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Recent Inspections</h3>
              <p className="text-[11px] text-slate-500">Click any row to open audit breakdown</p>
            </div>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 btn-press"
            >
              <span>Full History</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                {inspections.slice(0, 4).map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => selectInspection(item)}
                    className="table-row-interactive"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{item.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{item.brandName}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {item.overallStatus === 'COMPLIANT' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Pass
                        </span>
                      ) : item.overallStatus === 'NEEDS_REVIEW' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Review
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                          Violation
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectInspection(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-2xs btn-ripple btn-press"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
