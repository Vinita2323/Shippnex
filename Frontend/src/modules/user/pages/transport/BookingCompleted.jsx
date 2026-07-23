import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ClipboardList, Home, Clock } from 'lucide-react';

const BookingCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId || 'TRX89127391';

  return (
    <div className="h-[100dvh] bg-[#047857] font-sans text-white relative max-w-[480px] mx-auto flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      
      {/* Decorative circles */}
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full border-[30px] border-white/10"></div>
      <div className="absolute bottom-[-80px] left-[-50px] w-[250px] h-[250px] rounded-full border-[40px] border-white/10"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)] animate-bounce">
           <Check size={48} className="text-[#047857]" strokeWidth={3} />
        </div>
        
        <h1 className="text-[28px] font-extrabold mb-2">Booking Confirmed!</h1>
        <p className="text-[15px] text-emerald-100 mb-8 max-w-[80%]">Your vehicle is being assigned. The driver will reach the pickup location shortly.</p>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full mb-8">
           <div className="flex flex-col mb-4 pb-4 border-b border-white/20">
             <span className="text-[12px] font-bold text-emerald-200 uppercase tracking-wider mb-1">Booking ID</span>
             <span className="text-[20px] font-extrabold tracking-wide">{bookingId}</span>
           </div>
           
           <div className="flex justify-between items-center">
             <div className="flex flex-col items-start">
               <span className="text-[12px] text-emerald-200">Status</span>
               <span className="text-[15px] font-bold text-white flex items-center gap-1.5"><Clock size={14}/> Searching Driver</span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[12px] text-emerald-200">Est. Arrival</span>
               <span className="text-[15px] font-bold text-white">5-10 mins</span>
             </div>
           </div>
        </div>
        
        <div className="w-full flex flex-col gap-3">
          <button 
            className="w-full bg-white text-[#047857] border-none rounded-xl py-3.5 px-6 text-[15px] font-bold cursor-pointer shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            onClick={() => navigate('/orders', { state: { tab: 'transport' } })}
          >
            <ClipboardList size={20} />
            Track Booking
          </button>
          
          <button 
            className="w-full bg-transparent border-2 border-white/30 text-white rounded-xl py-3.5 px-6 text-[15px] font-bold cursor-pointer transition-colors active:bg-white/10 flex items-center justify-center gap-2"
            onClick={() => navigate('/')}
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default BookingCompleted;
