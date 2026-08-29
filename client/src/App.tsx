import React from 'react';
import { useMetrologyStore } from './store/useMetrologyStore';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ScanProduct } from './pages/ScanProduct';
import { Analysis } from './pages/Analysis';
import { Result } from './pages/Result';
import { History } from './pages/History';
import { Violations } from './pages/Violations';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';

export function App() {
  const { activePage, currentUser } = useMetrologyStore();

  // If on login page or not logged in, render the Login portal
  if (activePage === 'login' || !currentUser.isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Vertical Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Router with Entrance Animations */}
        <main className="flex-1 overflow-y-auto">
          <div key={activePage} className="animate-fade-in-up">
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'scan' && <ScanProduct />}
            {activePage === 'analysis' && <Analysis />}
            {activePage === 'result' && <Result />}
            {activePage === 'history' && <History />}
            {activePage === 'violations' && <Violations />}
            {activePage === 'reports' && <Reports />}
            {activePage === 'analytics' && <Analytics />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
