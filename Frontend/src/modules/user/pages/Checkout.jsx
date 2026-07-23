import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-3 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} color="white" />
        </button>
        <h2 className="text-[20px] font-semibold m-0 text-white text-center">Checkout</h2>
        <div className="w-[22px]"></div> {/* Spacer for centering */}
      </header>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center py-4 px-5 pb-6 bg-white">
        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-full bg-[#ff5500] text-white flex items-center justify-center text-[12px] font-bold">1</div>
          <span className="text-[12px] font-bold text-slate-900">Address</span>
        </div>
        <div className="h-px w-[30px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[12px] font-bold">2</div>
          <span className="text-[12px] font-semibold text-slate-500">Payment</span>
        </div>
        <div className="h-px w-[30px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[12px] font-bold">3</div>
          <span className="text-[12px] font-semibold text-slate-500">Confirm</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden">
        {/* Delivery Address Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-bold text-slate-800 m-0">Delivery Address</h3>
            <button className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer p-0">Change</button>
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[13px] font-bold text-slate-900 m-0">Rahul Sharma</h4>
            <p className="text-[12px] leading-relaxed text-slate-500 m-0">
              221B Baker Street, Marylebone,<br />
              London NW1 5XE, United Kingdom
            </p>
            <p className="text-[12px] text-slate-500 m-0">+44 7700 900123</p>
          </div>
        </div>

        {/* Delivery Slot Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-bold text-slate-800 m-0">Delivery Slot</h3>
            <button className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer p-0">Change</button>
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[13px] font-bold text-slate-900 m-0">Tomorrow, 15 May</h4>
            <p className="text-[12px] font-semibold text-slate-900 m-0">10:00 AM - 12:00 PM</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-bold text-slate-800 m-0">Order Summary</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">4 items</span>
              <span className="text-[12px] font-semibold text-slate-900">₹490.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">Delivery Charges</span>
              <span className="text-[12px] font-bold text-green-500">FREE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">You Saved</span>
              <span className="text-[12px] font-bold text-green-500">- ₹60.00</span>
            </div>
            <div className="flex justify-between items-center mt-1 pt-4 border-t border-dashed border-slate-200">
              <span className="text-[14px] font-extrabold text-slate-900">Grand Total</span>
              <span className="text-[16px] font-extrabold text-slate-900">₹490.00</span>
            </div>
          </div>
        </div>
        
        <div className="h-[100px]"></div>
      </div>

      {/* Checkout Action Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-gradient-to-t from-white via-white/80 to-transparent z-[90]">
        <button 
          className="w-full bg-[#ff5500] text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.2)] transition-transform duration-200 active:scale-[0.98]"
          onClick={() => navigate('/payment')}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
