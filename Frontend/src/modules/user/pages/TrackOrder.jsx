import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, ChevronRight, Check, Truck, MapPin, CreditCard } from 'lucide-react';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';

const TrackOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] bg-[#f2f2f2] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-x-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-4 bg-white border-b border-slate-200 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <h2 className="text-[14px] font-bold tracking-wide m-0 text-slate-700 uppercase">Order Details</h2>
        </div>
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center gap-1 text-[#8b3d7a] font-bold text-[13px]">
          <HelpCircle size={16} />
          HELP
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-[20px] [&::-webkit-scrollbar]:hidden">
        
        {/* Order Info Card */}
        <div className="bg-white px-4 py-4 mb-2 flex items-center justify-between border-b border-slate-200 cursor-pointer active:bg-slate-50 transition-colors">
          <div className="flex gap-3 items-center">
            <div className="w-[60px] h-[60px] rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
               <img src={grainsImg} alt="Product" className="w-[80%] h-[80%] object-contain mix-blend-multiply" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[14px] font-bold text-slate-800 m-0">Order #311024801366082560</h3>
              <p className="text-[13px] text-slate-600 truncate max-w-[200px] m-0">Premium Basmati Rice 5kg Pack</p>
              <p className="text-[12px] text-slate-500 m-0">Free Size • Prepaid</p>
              <p className="text-[11px] text-slate-500 m-0">All issue easy returns</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </div>

        {/* Tracking Section */}
        <div className="bg-white px-4 py-5 mb-2 border-b border-slate-200 flex flex-col gap-5">
          {/* Status Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded flex items-center justify-center shrink-0">
               <Truck size={20} className="text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-800">On the way</span>
              <span className="text-[13px] text-slate-600">Delivery by Fri, 31 Jul</span>
            </div>
          </div>

          {/* Location Bubble */}
          <div className="flex justify-center -mb-2 z-10 relative">
             <div className="bg-[#323643] text-white rounded-lg px-4 py-2 flex flex-col items-center relative shadow-md">
                <span className="text-[11px] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-400"></div> Rajkot_Amargadh_</span>
                <span className="text-[12px] font-bold flex items-center gap-1 cursor-pointer">View Details <ChevronRight size={14}/></span>
                {/* little triangle pointing down */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#323643] rotate-45"></div>
             </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="relative mt-2 pb-2">
            {/* Background Line */}
            <div className="absolute top-[11px] left-8 right-8 h-1 bg-slate-200 rounded-full z-0"></div>
            {/* Active Line */}
            <div className="absolute top-[11px] left-8 right-1/2 h-1 bg-[#059669] rounded-full z-0"></div>

            <div className="flex justify-between relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="w-[24px] h-[24px] rounded-full bg-[#059669] flex items-center justify-center border-2 border-white text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Ordered</span>
                <span className="text-[10px] text-slate-500">21 Jul</span>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="w-[24px] h-[24px] rounded-full bg-[#059669] flex items-center justify-center border-2 border-white text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Shipped</span>
                <span className="text-[10px] text-slate-500">23 Jul</span>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="w-[24px] h-[24px] rounded-full bg-white border-2 border-[#059669] flex items-center justify-center text-[#059669]">
                  <Truck size={12} strokeWidth={1} fill="currentColor" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Out for Delivery</span>
                <span className="text-[10px] text-slate-500">31 Jul</span>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center gap-1.5 w-1/4 opacity-40">
                <div className="w-[24px] h-[24px] rounded-full bg-slate-200 flex items-center justify-center border-2 border-white text-slate-400">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Delivery</span>
                <span className="text-[10px] text-slate-500">31 Jul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions section */}
        <div className="bg-white px-4 py-4 mb-2 flex justify-between items-center border-b border-slate-200">
          <span className="text-[13px] text-slate-700">Order shipped, cancel unavailable.</span>
          <span className="text-[13px] font-bold text-[#8b3d7a] cursor-pointer">KNOW MORE</span>
        </div>

        {/* Address section */}
        <div className="bg-white px-4 py-4 mb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
              <MapPin size={12} className="text-blue-500" fill="#3b82f6" color="white" />
            </div>
            <span className="text-[14px] font-bold text-slate-800">Delivery Address</span>
          </div>
          <div className="pl-7 flex flex-col gap-1 mb-4">
            <span className="text-[13px] font-medium text-slate-800">Vini Jinodiya</span>
            <span className="text-[12px] text-slate-600 leading-relaxed pr-4">
              Corporate House Block C, Film Colony, Chhoti Gwaltol, RNT Marg, Indore, Indore District, Indore, Indore, Madhya Pradesh, 452001
            </span>
            <span className="text-[12px] text-slate-600 mt-1">9302841832</span>
          </div>
          
          <div className="w-full h-px bg-slate-100 my-3"></div>
          
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-slate-500">Address change unavailable!</span>
            <span className="text-[13px] font-bold text-[#8b3d7a] cursor-pointer">KNOW MORE</span>
          </div>
        </div>



        {/* Price Breakdown */}
        <div className="bg-white px-4 py-5 mb-6">
           <div className="flex justify-between items-center mb-1.5">
             <span className="text-[14px] font-medium text-slate-700">Total Product Price</span>
             <span className="text-[14px] font-bold text-slate-800">₹2499</span>
           </div>
           <div className="flex justify-between items-center mb-5">
             <span className="text-[12px] text-green-600 font-medium">You saved ₹499</span>
             <span className="text-[12px] font-bold text-[#8b3d7a] cursor-pointer">VIEW BILL</span>
           </div>
           
           <div className="bg-[#f8fafc] rounded-xl p-3 flex justify-between items-center border border-slate-200">
              <div className="flex items-center gap-3">
                 <CreditCard size={18} className="text-slate-500" />
                 <span className="text-[14px] font-medium text-slate-700">Prepaid</span>
              </div>
              <span className="text-[14px] font-bold text-slate-800">₹2499</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
