import React from 'react';
import { BarChart3, MapPin, Building, Box, TrendingUp, ChevronRight } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const Analytics: React.FC = () => {
  const { setActivePage, setCategoryFilter } = useMetrologyStore();

  const districtInspections = [
    { name: 'Pune District', count: 185, percentage: 92, color: 'bg-blue-700' },
    { name: 'Mumbai District', count: 142, percentage: 75, color: 'bg-indigo-600' },
    { name: 'Nashik District', count: 98, percentage: 55, color: 'bg-sky-600' },
    { name: 'Nagpur District', count: 65, percentage: 38, color: 'bg-purple-600' },
  ];

  const categoryBreaches = [
    { name: 'Edible Oils & Fats', count: 42 },
    { name: 'Personal Care Products', count: 28 },
    { name: 'Packaged Biscuits & Confectionery', count: 21 },
    { name: 'Household Detergents', count: 11 },
  ];

  const manufacturerTrends = [
    { name: 'ABC Foods India Pvt Ltd', compliance: '78% Compliant', breaches: 4 },
    { name: 'XYZ Bakery Goods Ltd', compliance: '98% Compliant', breaches: 0 },
    { name: 'DEF Hygiene Organics', compliance: '85% Compliant', breaches: 2 },
  ];

  const handleCategoryClick = (name: string) => {
    setCategoryFilter(name);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">STATE SURVEILLANCE ANALYTICS</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Legal Metrology Commodity Enforcement & Compliance Trends across Maharashtra
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
          Statewide Surveillance Live
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Products Scanned" 
          value="520" 
          subtext="State Total" 
          icon={<Box className="w-4 h-4 text-blue-700" />} 
          onClick={() => setActivePage('history')}
        />
        <StatCard 
          title="Compliance Rate" 
          value="75.2%" 
          subtext="Rule 6 Pass Rate" 
          variant="success" 
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />} 
          onClick={() => setActivePage('dashboard')}
        />
        <StatCard 
          title="Active Districts" 
          value="4 Districts" 
          subtext="Surveillance active" 
          icon={<MapPin className="w-4 h-4 text-sky-600" />} 
        />
        <StatCard 
          title="Manufacturer Audits" 
          value="48 Brands" 
          subtext="FMCG Companies" 
          icon={<Building className="w-4 h-4 text-purple-600" />} 
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District-Wise Inspections Bar Graph (6 cols) */}
        <div className="lg:col-span-6 gov-card p-6 border rounded-2xl space-y-4 shadow-xs bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>District-Wise Inspections</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-lg">
              Maharashtra Region
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {districtInspections.map((d, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded-xl border border-transparent space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1">
                    <span>{d.name}</span>
                  </span>
                  <span className="font-mono text-slate-600 text-[11px]">{d.count} inspections</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-500`}
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category-Wise Violations (6 cols) */}
        <div className="lg:col-span-6 gov-card p-6 border rounded-2xl space-y-4 shadow-xs bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              <span>Category-Wise Violations</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-lg">
              Risk Distribution
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {categoryBreaches.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => handleCategoryClick(cat.name)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-xs transition cursor-pointer btn-press select-none"
              >
                <span className="font-bold text-slate-900">{cat.name}</span>
                <span className="font-mono font-extrabold text-red-700 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-[11px]">
                  {cat.count} Breaches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manufacturer Trends Table (Full Width) */}
        <div className="lg:col-span-12 gov-card p-6 border rounded-2xl space-y-4 shadow-xs bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" />
              <span>Manufacturer Compliance Trends</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold">FMCG Audit History</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {manufacturerTrends.map((m, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-2 select-none"
              >
                <div className="font-extrabold text-slate-900 text-xs tracking-tight">{m.name}</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-emerald-700">{m.compliance}</span>
                  <span className="text-slate-500">{m.breaches} Breaches</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
