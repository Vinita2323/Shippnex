import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../context/SuperAdminContext';
import { superAdminService } from '../../../services/superAdminService';
import { Shield, Lock, Mail, ArrowRight, Building2, AlertCircle, Loader2 } from 'lucide-react';

export const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useSuperAdmin();

  const [email, setEmail] = useState('superadmin@shippnex.com');
  const [password, setPassword] = useState('SuperAdmin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await superAdminService.login({ email, password });
      if (res.success && res.token) {
        login(res.token, res.superAdmin);
        navigate('/super-admin/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to connect to Super Admin authentication service'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020909] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-800/30 border border-emerald-500/30 shadow-2xl text-emerald-400">
          <Building2 size={36} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Super Admin Treasury
        </h2>
        <p className="text-xs sm:text-sm text-emerald-400/80 font-medium max-w-sm mx-auto">
          Central financial control, transaction ledgers, seller & captain payouts, and platform settlements.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#051716] border border-emerald-950/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl shadow-black/80 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs font-semibold animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/70 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@shippnex.com"
                  className="w-full bg-[#020b0b] border border-emerald-950/90 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/70 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#020b0b] border border-emerald-950/90 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 border-none cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Treasury Access</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="pt-2 border-t border-emerald-950/60 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('superadmin@shippnex.com');
                setPassword('SuperAdmin@123');
              }}
              className="text-[11px] text-emerald-400/80 hover:text-emerald-300 underline bg-transparent border-none cursor-pointer font-mono"
            >
              Autofill Root Super Admin Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
