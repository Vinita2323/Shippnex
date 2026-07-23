import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Fingerprint, ShieldCheck } from 'lucide-react';

const Security = () => {
  const navigate = useNavigate();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Security & Password</h2>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 [&::-webkit-scrollbar]:hidden flex flex-col gap-6">
        
        {/* Change Password Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[12px] bg-[#fef3c7] flex items-center justify-center shrink-0">
              <Lock size={20} className="text-[#d97706]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Change Password</h3>
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

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 px-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#d97706] focus:bg-white transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 px-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#d97706] focus:bg-white transition-colors"
            />
          </div>

          <button className="w-full bg-slate-900 text-white rounded-[16px] py-3.5 font-bold text-[14px] mt-2 cursor-pointer active:scale-[0.98] transition-transform border-none shadow-sm">
            Update Password
          </button>
        </div>

        {/* Biometric Settings */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-[12px] bg-[#e0e7ff] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-[#4338ca]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Login Methods</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Fingerprint size={24} className="text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-800">Biometric Login</span>
                <span className="text-[12px] font-medium text-slate-500">Use fingerprint or Face ID</span>
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
