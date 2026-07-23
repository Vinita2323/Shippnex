import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldAlert, Scale } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0 border-b border-slate-100">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Terms & Policies</h2>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:hidden flex flex-col gap-8 pb-12">
        
        {/* Intro */}
        <div>
          <p className="text-[13px] text-slate-500 leading-relaxed m-0">
            Last updated: May 24, 2024. Please read these terms and conditions carefully before using our service.
          </p>
        </div>

        {/* Section 1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-[#1e3a8a]" />
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Terms of Service</h3>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed m-0 font-medium text-justify">
            By accessing or using the Shippnex platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service. Our service allows you to browse, purchase, and track grocery deliveries.
          </p>
          <p className="text-[14px] text-slate-600 leading-relaxed m-0 font-medium text-justify">
            We reserve the right to modify or replace these terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={18} className="text-[#ea580c]" />
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Privacy Policy</h3>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed m-0 font-medium text-justify">
            Your privacy is important to us. It is Shippnex's policy to respect your privacy regarding any information we may collect from you across our application. We only ask for personal information when we truly need it to provide a service to you.
          </p>
          <p className="text-[14px] text-slate-600 leading-relaxed m-0 font-medium text-justify">
            We collect it by fair and lawful means, with your knowledge and consent. We don't share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Scale size={18} className="text-[#059669]" />
            <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Licenses & Copyright</h3>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed m-0 font-medium text-justify">
            The app and its original content, features, and functionality are and will remain the exclusive property of Shippnex and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Shippnex.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;
