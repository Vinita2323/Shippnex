import React from 'react';

const SplashScreen = ({ onGetStarted }) => {
  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100dvh] bg-[#f4f6f9] flex justify-center items-center p-3 font-sans box-border overflow-hidden z-[9999]">
      <div className="bg-white w-full max-w-[380px] h-full max-h-[850px] rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] py-6 px-5 flex flex-col items-center justify-between relative box-border">
        {/* Header Branding */}
        <div className="flex flex-col items-center">
          <img 
            src="/splashscreenlogo.png" 
            alt="ShippNex Logo" 
            className="max-w-[140px] h-auto object-contain"
          />
          <div className="flex items-center gap-[6px] mt-[6px]">
            <span className="w-4 h-[2px] bg-slate-500 rounded-sm"></span>
            <span className="text-[11.5px] font-semibold text-[#1e2b4f] italic tracking-[-0.2px]">The Next Move in Logistics.</span>
            <span className="w-4 h-[2px] bg-slate-500 rounded-sm"></span>
          </div>
        </div>

        {/* Hero 3D Shopping Cart Illustration */}
        <div className="w-full flex justify-center items-center flex-1 min-h-0 py-2.5">
          <img 
            src="/shopping_cart_illustration.png" 
            alt="Wholesale Shopping Cart" 
            className="w-full max-w-[220px] h-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.05)]"
          />
        </div>

        {/* Headline */}
        <h2 className="text-[16px] font-extrabold text-[#1e2b4f] text-center leading-[1.3] px-1">
          Your Trusted<br />
          Partner for Wholesale<br />
          Shopping & Fast Delivery
        </h2>

        {/* Feature Badges */}
        <div className="flex justify-around items-start w-full my-4">
          <div className="flex flex-col items-center flex-1 text-center relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-slate-100">
            <div className="w-[38px] h-[38px] rounded-full bg-white border border-slate-200 shadow-[0_3px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-[1.15]">Quality<br />Products</span>
          </div>

          <div className="flex flex-col items-center flex-1 text-center relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-slate-100">
            <div className="w-[38px] h-[38px] rounded-full bg-white border border-slate-200 shadow-[0_3px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-[1.15]">Best<br />Prices</span>
          </div>

          <div className="flex flex-col items-center flex-1 text-center relative">
            <div className="w-[38px] h-[38px] rounded-full bg-white border border-slate-200 shadow-[0_3px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <polyline points="12 6 12 12 15.5 15.5"/>
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-[1.15]">On Time<br />Delivery</span>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-1.5 items-center mb-4">
          <span className="bg-[#1e2b4f] w-[7px] h-[7px] rounded-full"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        </div>

        {/* Primary CTA */}
        <button 
          className="w-full bg-gradient-to-b from-[#ff6000] to-[#ff4500] text-white px-5 py-3.5 rounded-[30px] text-[15px] font-bold shadow-[0_6px_16px_rgba(255,69,0,0.28)] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(255,69,0,0.35)] active:translate-y-[1px] mt-auto transition-all cursor-pointer"
          onClick={onGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
