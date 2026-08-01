import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { authService } from '../../../services/authService';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await authService.adminLogin(email, password);
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#002625] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#001a19] border border-[#0d4a48] rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-md mb-2">
            <img src="/Logo.png" alt="ShippNex Logo" className="h-10 object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={20} className="text-[#ff5500]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Super Admin Portal</h1>
          </div>
          <p className="text-xs text-teal-300/70">Enter your credentials to access the system panel</p>
        </div>

        {/* Login Form */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-300/60 pointer-events-none" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shippnex.com"
                className="w-full bg-[#002625] border border-[#0d4a48] focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-teal-300/40 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-300/60 pointer-events-none" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#002625] border border-[#0d4a48] focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-teal-300/40 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff5500] hover:bg-[#e04a00] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg shadow-[#ff5500]/20 mt-2"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-teal-300/50 font-mono">ShippNex Secure Gateway v2.4</p>
        </div>
      </div>
    </div>
  );
};
