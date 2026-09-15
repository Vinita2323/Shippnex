import React from 'react';
import { useSuperAdmin } from '../context/SuperAdminContext';
import { ShieldCheck, Bell, RefreshCw, Lock } from 'lucide-react';

export const SuperAdminHeader = ({ title, subtitle, onRefresh, refreshing }) => {
  const { superAdmin, logout } = useSuperAdmin();

  return (
    <header className="h-18 bg-[#040e0e] border-b border-emerald-950/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight m-0">{title || 'Treasury & Ledger'}</h1>
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} /> SECURE TREASURY
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-400 m-0 mt-0.5 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold border border-emerald-500/20 cursor-pointer transition-all"
            title="Refresh financial data"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        )}

        <div className="h-6 w-px bg-emerald-950/80 mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white m-0 leading-tight">{superAdmin?.name || 'CFO Super Admin'}</p>
            <p className="text-[10px] text-emerald-400 font-mono m-0 flex items-center justify-end gap-1">
              <Lock size={10} /> Authorized Authority
            </p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
