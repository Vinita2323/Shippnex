import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, Check, Package, IndianRupee, Clock, Navigation } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const TransportBookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transportBookings } = useTransport();
  
  const bookingId = location.state?.bookingId;
  const booking = transportBookings.find(b => b.id === bookingId);

  if (!booking) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Booking Details</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-[40px] [&::-webkit-scrollbar]:hidden flex flex-col gap-5">
        
        {/* Top Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1">
               <h3 className="text-[14px] font-extrabold text-slate-900 m-0">{booking.id}</h3>
               <span className="text-[12px] font-medium text-slate-500">{booking.date}</span>
             </div>
             <span className="text-[11px] font-bold uppercase tracking-wide bg-orange-100 text-orange-600 px-2.5 py-1 rounded">
               {booking.status}
             </span>
           </div>

           <div className="w-full h-px bg-slate-100 my-1"></div>

           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
                  {booking.vehicle.icon || <Truck size={20} />}
               </div>
               <div className="flex flex-col">
                 <span className="text-[14px] font-bold text-slate-800">{booking.vehicle.name}</span>
                 <span className="text-[12px] text-slate-500">{booking.goods.category} • {booking.goods.weight}KG</span>
               </div>
             </div>
             <span className="text-[16px] font-extrabold text-slate-900 flex items-center">
               <IndianRupee size={14} strokeWidth={3} /> {booking.fare}
             </span>
           </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
           <h3 className="text-[14px] font-bold text-slate-800 mb-5">Booking Status</h3>
           <div className="relative pl-3">
             {/* Timeline background line */}
             <div className="absolute left-[23px] top-2 bottom-6 w-0.5 bg-slate-100"></div>
             
             {booking.timeline.map((step, idx) => (
               <div key={idx} className={`relative flex gap-4 ${idx !== booking.timeline.length - 1 ? 'mb-6' : ''}`}>
                 <div className="relative z-10">
                   {step.completed ? (
                     <div className="w-6 h-6 rounded-full bg-[#047857] flex items-center justify-center border-2 border-white shadow-sm">
                       <Check size={12} className="text-white" strokeWidth={4} />
                     </div>
                   ) : (
                     <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white">
                       <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                     </div>
                   )}
                 </div>
                 <div className="flex flex-col flex-1 pb-1">
                   <span className={`text-[13px] font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>{step.status}</span>
                   {step.time && <span className="text-[11px] text-slate-500 mt-0.5">{step.time}</span>}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Locations Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
          <div className="flex flex-col items-center mt-1.5 mb-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-[#047857]"></div>
             <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-[#ff5500]"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4 py-0.5">
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup Address</span>
               <span className="text-[13px] font-medium text-slate-800 leading-snug">{booking.pickup}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop Address</span>
               <span className="text-[13px] font-medium text-slate-800 leading-snug">{booking.drop}</span>
             </div>
          </div>
        </div>

        {/* Goods Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
           <h3 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2"><Package size={16} className="text-[#047857]"/> Goods Information</h3>
           <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 font-medium mb-0.5">Category</span>
                <span className="text-[13px] font-semibold text-slate-800">{booking.goods.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 font-medium mb-0.5">Total Weight</span>
                <span className="text-[13px] font-semibold text-slate-800">{booking.goods.weight} KG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 font-medium mb-0.5">Packages</span>
                <span className="text-[13px] font-semibold text-slate-800">{booking.goods.packages} Boxes</span>
              </div>
           </div>
           {booking.goods.instructions && (
             <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col">
                <span className="text-[11px] text-slate-500 font-medium mb-1">Instructions</span>
                <span className="text-[12px] italic text-slate-700">{booking.goods.instructions}</span>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default TransportBookingDetails;
