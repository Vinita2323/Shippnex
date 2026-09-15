import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Fingerprint, ShieldCheck } from 'lucide-react';

const Security = () => {
  const navigate = useNavigate();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <div className="h-[100dvh] md:h-auto md:min-h-screen bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] md:max-w-3xl mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] md:shadow-none flex flex-col md:py-8 md:px-6 overflow-hidden md:overflow-visible">
      {/* Mobile Header */}
      <header className="flex md:hidden justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Security & Password</h2>
        <div className="w-6"></div>
      </header>

      {/* Desktop Breadcrumbs & Header */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button onClick={() => navigate('/profile')} className="hover:text-orange-600 font-medium cursor-pointer border-none bg-transparent flex items-center gap-1">
              <ArrowLeft size={16} /> Profile
            </button>
            <span>/</span>
            <span className="text-slate-800 font-bold">Security</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 m-0">Security & Password</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <ShieldCheck size={16} className="text-emerald-600" />
          Account Protected
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-0 py-6 md:py-0 pb-24 md:pb-12 [&::-webkit-scrollbar]:hidden flex flex-col gap-6 md:overflow-visible">
        
        {/* Change Password Card */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[12px] bg-[#fef3c7] flex items-center justify-center shrink-0">
              <Lock size={20} className="text-[#d97706]" />
            </div>
            <div>
              <h3 className="text-[16px] md:text-lg font-extrabold text-slate-900 m-0">Change Password</h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Ensure your account uses a strong, unique password</p>
            </div>
          </div>

          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password"
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 px-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#d97706] focus:bg-white transition-colors"
            />
          </div>

          {/* New Password and Confirm in 2 columns on md */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 px-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#d97706] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password"
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 px-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#d97706] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button className="w-full md:w-auto md:px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-[16px] py-3.5 font-bold text-[14px] cursor-pointer active:scale-[0.98] transition-all border-none shadow-sm">
              Update Password
            </button>
          </div>
        </div>

        {/* Biometric Settings */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-[12px] bg-[#e0e7ff] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-[#4338ca]" />
            </div>
            <div>
              <h3 className="text-[16px] md:text-lg font-extrabold text-slate-900 m-0">Login Methods</h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Manage biometric and fast-login preferences</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Fingerprint size={28} className="text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[14px] md:text-base font-bold text-slate-800">Biometric Login</span>
                <span className="text-[12px] font-medium text-slate-500">Use fingerprint or Face ID for fast sign in</span>
              </div>
            </div>
            
            {/* Toggle switch */}
            <div 
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors relative ${biometricEnabled ? 'bg-[#10b981]' : 'bg-slate-300'}`}
              onClick={() => setBiometricEnabled(!biometricEnabled)}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Security;
