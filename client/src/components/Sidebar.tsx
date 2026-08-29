import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Scale,
  User,
  ChevronRight
} from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';
import { ViewPage } from '../types/metrology';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, currentUser } = useMetrologyStore();

  const navItems: { id: ViewPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Product', icon: Camera },
    { id: 'history', label: 'History Ledger', icon: History },
    { id: 'violations', label: 'Violations', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col min-h-screen shrink-0 select-none">
      
      {/* Official Government Metrology Header Logo */}
      <div 
        className="p-5 border-b border-slate-800 flex items-center gap-3 cursor-pointer group btn-press"
        onClick={() => setActivePage('dashboard')}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 border border-blue-500/40 shrink-0 group-hover:scale-105 transition-transform duration-200">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-extrabold text-white text-base tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
            LEGAL METROLOGY
          </div>
          <div className="text-[10px] text-blue-400 font-mono tracking-wider font-semibold uppercase flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Government Portal
          </div>
        </div>
      </div>

      {/* Navigation Links List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (activePage === 'result' && item.id === 'scan') || (activePage === 'analysis' && item.id === 'scan');
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 btn-press relative overflow-hidden ${
                isActive
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-900/30 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-300 rounded-r-full"></span>
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-white scale-110' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
            </button>
          );
        })}
      </nav>

      {/* Inspector Identity Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold shrink-0">
            <User className="w-4 h-4 text-blue-300" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white leading-tight truncate">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.district}</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
