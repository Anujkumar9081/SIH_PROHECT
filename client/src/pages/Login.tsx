import React, { useState } from 'react';
import { Scale, Lock, User, ArrowRight, ShieldCheck, Sparkles, Loader2, CheckCircle2, MapPin } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';
import { indiaStatesAndDistricts, statesList } from '../utils/indiaStates';

export const Login: React.FC = () => {
  const [badge, setBadge] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stateLocation, setStateLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [error, setError] = useState('');
  
  const { loginUser: storeLoginUser } = useMetrologyStore();
  
  // Need to import apiService at top
  // we will add that in another chunk

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUpMode) {
        // We need to import apiService from api.ts
        const { apiService } = await import('../services/api');
        const res = await apiService.signupUser({ badgeId: badge, password, name, state: stateLocation, district });
        // After signup, automatically login
        storeLoginUser({
          id: `insp-${Date.now()}`,
          name: res.user.name,
          badgeId: res.user.badgeId,
          district: `${res.user.district}, ${res.user.state}`,
          role: 'Enforcement Officer',
          department: 'Dept. of Legal Metrology, Maharashtra',
        });
      } else {
        const { apiService } = await import('../services/api');
        const res = await apiService.loginUser({ badgeId: badge, password });
        storeLoginUser({
          id: `insp-${Date.now()}`,
          name: res.user.name,
          badgeId: res.user.badgeId,
          district: res.user.district ? `${res.user.district}, ${res.user.state}` : 'Headquarters',
          role: 'Enforcement Officer',
          department: 'Dept. of Legal Metrology, Maharashtra',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-9 space-y-6 border border-slate-200/80 relative z-10 animate-fade-in-up">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-700/30 border border-blue-500/50 transform hover:scale-105 transition-transform duration-200">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-bold tracking-wide uppercase font-mono mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              Official Surveillance Portal
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              LEGAL METROLOGY AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Department of Legal Metrology • Ministry of Consumer Affairs
            </p>
          </div>
        </div>



        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          {isSignUpMode && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                    required={isSignUpMode}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">State</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={stateLocation}
                    onChange={(e) => {
                      setStateLocation(e.target.value);
                      setDistrict('');
                    }}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition appearance-none"
                    required={isSignUpMode}
                  >
                    <option value="" disabled>Select State</option>
                    {statesList.map(stateName => (
                      <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {stateLocation && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">District</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition appearance-none"
                      required={isSignUpMode}
                    >
                      <option value="" disabled>Select District</option>
                      {indiaStatesAndDistricts[stateLocation]?.map(distName => (
                        <option key={distName} value={distName}>{distName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Inspector Badge ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Secure Passcode</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-700/30 transition-all flex items-center justify-center gap-2 mt-4 btn-ripple btn-press disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isSignUpMode ? 'Register Officer' : 'Authorize Secure Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button" 
            onClick={() => {
              setIsSignUpMode(!isSignUpMode);
              setError('');
            }}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors btn-press"
          >
            {isSignUpMode ? 'Already registered? Login here' : 'Need an account? Register Officer'}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-200 text-center space-y-1">
          <div className="text-[11px] text-slate-500 font-mono">
            Government of Maharashtra • Metrology Division
          </div>
          <div className="text-[10px] text-slate-400">
            Complies with Legal Metrology (Packaged Commodities) Rules, 2011
          </div>
        </div>

      </div>

    </div>
  );
};
