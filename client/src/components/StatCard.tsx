import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon?: string | React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'default',
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950 hover:border-emerald-300';
      case 'warning':
        return 'bg-amber-50/60 border-amber-200/80 text-amber-950 hover:border-amber-300';
      case 'danger':
        return 'bg-red-50/60 border-red-200/80 text-red-950 hover:border-red-300';
      default:
        return 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-300';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'success': return 'text-emerald-700';
      case 'warning': return 'text-amber-700';
      case 'danger': return 'text-red-700';
      default: return 'text-blue-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 border rounded-2xl shadow-xs transition-all duration-200 ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] select-none' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 shadow-2xs">{icon}</div>}
      </div>
      <div className={`text-2xl sm:text-3xl font-black font-mono mt-2 tracking-tight ${getValueColor()}`}>
        {value}
      </div>
      {subtext && <div className="text-[11px] text-slate-500 mt-1 font-medium">{subtext}</div>}
    </div>
  );
};
