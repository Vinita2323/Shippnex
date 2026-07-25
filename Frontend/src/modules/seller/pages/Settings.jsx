import React from 'react';
import { Store, Building, ShieldCheck, CreditCard, Bell } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Warehouse & Seller Settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage warehouse business profiles, tax credentials, and bank settlement details.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 space-y-6">
        {/* Business Profile */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#ff5500]">
            <Store size={20} />
            <h3 className="text-lg font-bold text-slate-900">Warehouse Business Profile</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Warehouse Name</label>
              <input type="text" defaultValue="FreshMart Bulk Warehouse" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Contact Phone</label>
              <input type="text" defaultValue="+91 98765 00000" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-medium" />
            </div>
          </div>
        </div>

        {/* GST & Legal */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#ff5500]">
            <ShieldCheck size={20} />
            <h3 className="text-lg font-bold text-slate-900">Tax & License Verification</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">GSTIN Number</label>
              <input type="text" defaultValue="07AAAAA0000A1Z5" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-mono font-bold text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">FSSAI License No.</label>
              <input type="text" defaultValue="10020011004567" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-medium" />
            </div>
          </div>
        </div>

        {/* Bank Account */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#ff5500]">
            <CreditCard size={20} />
            <h3 className="text-lg font-bold text-slate-900">Settlement Bank Account</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Bank Name</label>
              <input type="text" defaultValue="HDFC Bank" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Account Number</label>
              <input type="password" defaultValue="50100234567890" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none font-mono" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-6 rounded-md shadow-sm transition-colors cursor-pointer border-none text-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
