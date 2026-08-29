import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const Navbar: React.FC = () => {
  const { activePage, currentUser, logoutUser } = useMetrologyStore();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Government Surveillance Dashboard';
      case 'scan': return 'Commodity Packaging AI Scanner';
      case 'analysis': return 'AI Compliance Processing Pipeline';
      case 'result': return 'Inspection Audit & Compliance Verdict';
      case 'history': return 'Inspection History & Record Ledger';
      case 'violations': return 'Potential Rule Violation Analytics';
      case 'reports': return 'Compliance Certificate Reports';
      case 'analytics': return 'State & District Surveillance Analytics';
      case 'login': return 'Portal Login';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs select-none">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
          {getPageTitle()}
        </h1>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          {currentUser.department}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* User Profile Tag */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold shadow-xs">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="hidden sm:block text-left pr-4 border-r border-slate-200">
            <div className="font-extrabold text-slate-900 leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 font-mono font-medium">{currentUser.badgeId}</div>
          </div>
          <button
            onClick={logoutUser}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-bold text-xs"
            title="Logout Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
