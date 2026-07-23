import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, IndianRupee, CreditCard, Package } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const FareSummary = () => {
  const navigate = useNavigate();
  const { activeBooking, createBooking, clearActiveBooking } = useTransport();

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleBookVehicle = () => {
    // Generate a booking object using the active data
    const bookingData = {
      pickup: activeBooking.pickup,
      drop: activeBooking.drop,
      goods: activeBooking.goods,
      vehicle: activeBooking.vehicle,
      fare: activeBooking.vehicle?.price || 0,
      paymentMethod,
      distance: '4.5 km', // Mock distance
    };

    const newBooking = createBooking(bookingData);
    clearActiveBooking();
    
    // Pass booking ID to the success screen via state
    navigate('/transport/success', { state: { bookingId: newBooking.id } });
  };

  if (!activeBooking.vehicle) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-5 text-center">
        <h2 className="text-[18px] font-bold text-slate-800 mb-2">No Booking Data</h2>
        <p className="text-[14px] text-slate-500 mb-6">Please start your booking from the Transport Home.</p>
        <button className="bg-[#047857] text-white px-6 py-2 rounded-lg font-bold" onClick={() => navigate('/transport')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Fare Summary</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-[100px] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
        
        {/* Locations */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
          <div className="flex flex-col items-center mt-1.5 mb-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-[#047857]"></div>
             <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-[#ff5500]"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4 py-0.5">
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup</span>
               <span className="text-[14px] font-semibold text-slate-800">{activeBooking.pickup}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop</span>
               <span className="text-[14px] font-semibold text-slate-800">{activeBooking.drop}</span>
             </div>
          </div>
        </div>

        {/* Selected Vehicle & Goods */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 border border-slate-100">
                {activeBooking.vehicle.icon}
             </div>
             <div className="flex flex-col">
               <h3 className="text-[14px] font-bold text-slate-800 m-0 mb-0.5">{activeBooking.vehicle.name}</h3>
               <span className="text-[12px] text-slate-500 flex items-center gap-1">
                 <Package size={12} /> {activeBooking.goods.category} • {activeBooking.goods.weight}KG
               </span>
             </div>
           </div>
           <div className="text-[13px] font-bold text-[#ff5500] bg-orange-50 px-2 py-1 rounded">
             4.5 KM
           </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mt-2">
           <h3 className="text-[14px] font-bold text-slate-800 mb-4">Fare Breakdown</h3>
           
           <div className="flex justify-between items-center mb-3">
             <span className="text-[13px] text-slate-600">Base Fare</span>
             <span className="text-[13px] font-medium text-slate-800">₹{activeBooking.vehicle.price - 50}</span>
           </div>
           <div className="flex justify-between items-center mb-3">
             <span className="text-[13px] text-slate-600">Distance Charges</span>
             <span className="text-[13px] font-medium text-slate-800">₹50</span>
           </div>
           
           <div className="w-full h-px bg-slate-100 my-4"></div>
           
           <div className="flex justify-between items-center">
             <span className="text-[15px] font-bold text-slate-800">Total Amount</span>
             <span className="text-[18px] font-extrabold text-slate-900 flex items-center">
               <IndianRupee size={16} strokeWidth={3} /> {activeBooking.vehicle.price}
             </span>
           </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer active:scale-95 transition-transform">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <CreditCard size={18} />
             </div>
             <div className="flex flex-col">
               <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Payment</span>
               <span className="text-[14px] font-bold text-slate-800 capitalize">{paymentMethod}</span>
             </div>
           </div>
           <span className="text-[12px] font-bold text-blue-600">Change</span>
        </div>

      </div>

      {/* Book Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[90]">
        <button 
          className="w-full rounded-xl py-4 px-8 text-[16px] font-bold flex items-center justify-between cursor-pointer transition-all duration-200 bg-[#047857] text-white shadow-[0_4px_12px_rgba(4,120,87,0.2)] active:scale-[0.98]"
          onClick={handleBookVehicle}
        >
          <span>Book Vehicle</span>
          <span className="flex items-center text-[18px] font-black"><IndianRupee size={16} strokeWidth={3} /> {activeBooking.vehicle.price}</span>
        </button>
      </div>

    </div>
  );
};

export default FareSummary;
