import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, PhoneCall, Mail } from 'lucide-react';

const HelpSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Help & Support</h2>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 [&::-webkit-scrollbar]:hidden flex flex-col items-center">
        
        {/* Banner/Graphic */}
        <div className="w-full flex flex-col items-center justify-center py-8 mb-4">
          <div className="w-24 h-24 bg-[#fff5f0] rounded-full flex items-center justify-center mb-5 shadow-[0_8px_30px_rgba(234,88,12,0.1)]">
            <MessageSquare size={40} className="text-[#ea580c]" />
          </div>
          <h2 className="text-[22px] font-extrabold text-slate-900 mb-2">We're here to help</h2>
          <p className="text-[14px] font-medium text-slate-500 text-center px-4">
            Have an issue with your order or want to share feedback? Connect with us through any of the channels below.
          </p>
        </div>

        {/* Action Cards */}
        <div className="w-full flex flex-col gap-4">
          
          <button className="flex items-center gap-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] cursor-pointer hover:border-orange-200 transition-colors group">
            <div className="w-12 h-12 rounded-[14px] bg-[#fff5f0] flex items-center justify-center shrink-0 group-hover:bg-[#ea580c] transition-colors">
              <MessageSquare size={22} className="text-[#ea580c] group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-[16px] font-bold text-slate-900">Live Chat</span>
              <span className="text-[13px] font-medium text-slate-500">Wait time: ~2 mins</span>
            </div>
          </button>
          
          <button className="flex items-center gap-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] cursor-pointer hover:border-blue-200 transition-colors group">
            <div className="w-12 h-12 rounded-[14px] bg-[#e0e7ff] flex items-center justify-center shrink-0 group-hover:bg-[#4338ca] transition-colors">
              <PhoneCall size={22} className="text-[#4338ca] group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-[16px] font-bold text-slate-900">Call Us</span>
              <span className="text-[13px] font-medium text-slate-500">Mon-Fri, 9am - 8pm</span>
            </div>
          </button>
          
          <button className="flex items-center gap-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] cursor-pointer hover:border-pink-200 transition-colors group">
            <div className="w-12 h-12 rounded-[14px] bg-[#ffe4e6] flex items-center justify-center shrink-0 group-hover:bg-[#e11d48] transition-colors">
              <Mail size={22} className="text-[#e11d48] group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-[16px] font-bold text-slate-900">Email Support</span>
              <span className="text-[13px] font-medium text-slate-500">support@shippnex.com</span>
            </div>
          </button>

        </div>
        
      </div>
    </div>
  );
};

export default HelpSupport;
