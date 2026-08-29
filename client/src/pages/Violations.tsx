import React, { useState, useEffect } from 'react';
import { ChevronRight, Eye, ShieldAlert, Filter, CheckCircle2 } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const Violations: React.FC = () => {
  const { inspections, selectInspection, selectedCategoryFilter, setCategoryFilter } = useMetrologyStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(selectedCategoryFilter || 'Missing Declaration');

  useEffect(() => {
    if (selectedCategoryFilter) {
      setSelectedCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const categories = [
    { name: 'Missing Declaration', count: 35, color: 'border-red-300 bg-red-50/80 text-red-950 hover:bg-red-100/80' },
    { name: 'MRP Related', count: 25, color: 'border-amber-300 bg-amber-50/80 text-amber-950 hover:bg-amber-100/80' },
    { name: 'Quantity Related', count: 18, color: 'border-blue-300 bg-blue-50/80 text-blue-950 hover:bg-blue-100/80' },
    { name: 'Readability', count: 12, color: 'border-purple-300 bg-purple-50/80 text-purple-950 hover:bg-purple-100/80' },
    { name: 'All Violations', count: 102, color: 'border-slate-300 bg-slate-50/80 text-slate-950 hover:bg-slate-100/80' },
  ];

  const handleSelectCategory = (name: string) => {
    const isAll = name === 'All Violations';
    const nextCat = isAll ? null : name;
    setSelectedCategory(nextCat);
    setCategoryFilter(nextCat);
  };

  // Filter products matching selected violation category
  const matchingInspections = inspections.filter((item) =>
    item.violations.some((v) => !selectedCategory || v.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">VIOLATIONS ANALYTICS</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Commodity Rule 6 Breaches & Statutory Notice Tracking
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
          102 Total Potential Breaches
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const isSelected = (cat.name === 'All Violations' && selectedCategory === null) || selectedCategory === cat.name;
          return (
            <div
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 select-none btn-press ${cat.color} ${
                isSelected 
                  ? 'ring-2 ring-blue-700 shadow-md scale-[1.02] font-black' 
                  : 'hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider">{cat.name}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </div>
              <div className="text-3xl font-black font-mono mt-1">{cat.count}</div>
              <div className="text-[10px] mt-1 opacity-80 flex items-center gap-1 font-bold">
                <span>{isSelected ? 'Active filter' : 'Click to filter'}</span> 
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtered Products List */}
      <div className="gov-card p-6 border rounded-2xl space-y-4 shadow-xs bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Commodities Flagged under "{selectedCategory || 'All Categories'}"</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-lg">
            {matchingInspections.length} Affected Products
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {matchingInspections.map((item) => (
            <div 
              key={item.id} 
              onClick={() => selectInspection(item)}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 table-row-interactive rounded-xl px-3"
            >
              <div className="space-y-1">
                <div className="font-extrabold text-slate-900 text-sm">{item.productName}</div>
                <div className="text-xs text-slate-500 font-mono">
                  Brand: {item.brandName} • Inspector: {item.inspectorName} ({item.district})
                </div>
                <div className="text-xs font-bold text-red-700 pt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span>Breach: {item.violations[0]?.title || 'Non-compliant declaration under Rule 6'}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectInspection(item);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-2xs shrink-0 self-start sm:self-auto btn-ripple btn-press"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Audit</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
