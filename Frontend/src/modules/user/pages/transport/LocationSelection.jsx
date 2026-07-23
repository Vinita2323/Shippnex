import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, Crosshair, Navigation } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const LocationSelection = () => {
  const navigate = useNavigate();
  const { updateActiveBooking, activeBooking } = useTransport();

  const [pickup, setPickup] = useState(activeBooking.pickup || '');
  const [drop, setDrop] = useState(activeBooking.drop || '');
  const [activeInput, setActiveInput] = useState('drop'); // 'pickup' or 'drop'

  const savedAddresses = [
    { id: 1, title: 'Home', address: '123 Palm Avenue, Green Park', icon: <MapPin size={16} /> },
    { id: 2, title: 'Warehouse A', address: 'Plot 45, Industrial Estate', icon: <MapPin size={16} /> }
  ];

  const handleSelectAddress = (address) => {
    if (activeInput === 'pickup') setPickup(address);
    else setDrop(address);
  };

  const handleNext = () => {
    if (!pickup || !drop) return;
    updateActiveBooking('pickup', pickup);
    updateActiveBooking('drop', drop);
    navigate('/transport/goods');
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Select Location</h2>
      </header>

      <div className="flex-1 overflow-y-auto pb-[100px] [&::-webkit-scrollbar]:hidden">
        
        {/* Input Card */}
        <div className="bg-white p-5 rounded-b-[20px] shadow-sm mb-4 relative z-10">
          <div className="flex gap-4">
            {/* Vertical timeline visual */}
            <div className="flex flex-col items-center mt-3 mb-3">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
               <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
               <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
            </div>
            
            {/* Inputs */}
            <div className="flex-1 flex flex-col gap-4">
              <div 
                className={`bg-slate-50 border ${activeInput === 'pickup' ? 'border-green-500 bg-green-50/30' : 'border-slate-200'} rounded-xl p-3 flex items-center gap-2 cursor-text`}
                onClick={() => setActiveInput('pickup')}
              >
                <input 
                  type="text" 
                  placeholder="Pickup Location" 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
              <div 
                className={`bg-slate-50 border ${activeInput === 'drop' ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200'} rounded-xl p-3 flex items-center gap-2 cursor-text`}
                onClick={() => setActiveInput('drop')}
              >
                <input 
                  type="text" 
                  placeholder="Drop Location" 
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Location Action */}
        <div className="px-5 mb-4">
           <div 
            className="flex items-center gap-3 py-3 border-b border-slate-200 cursor-pointer active:bg-slate-100 transition-colors"
            onClick={() => handleSelectAddress('Current Location (123 Palm Ave)')}
           >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                 <Crosshair size={18} />
              </div>
              <span className="text-[14px] font-bold text-blue-600">Use Current Location</span>
           </div>
           
           <div className="flex items-center gap-3 py-3 border-b border-slate-200 cursor-pointer active:bg-slate-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                 <Navigation size={18} />
              </div>
              <span className="text-[14px] font-bold text-slate-700">Select from Map</span>
           </div>
        </div>

        {/* Saved Addresses */}
        <div className="px-5 mb-6">
           <h3 className="text-[14px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Saved Addresses</h3>
           <div className="flex flex-col gap-3">
             {savedAddresses.map((addr) => (
               <div 
                  key={addr.id} 
                  className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  onClick={() => handleSelectAddress(addr.address)}
               >
                 <div className="w-10 h-10 rounded-full bg-[#f0f9f6] flex items-center justify-center text-[#047857] shrink-0">
                   {addr.icon}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[14px] font-bold text-slate-800">{addr.title}</span>
                   <span className="text-[12px] text-slate-500 truncate max-w-[250px]">{addr.address}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* Next Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[90]">
        <button 
          className={`w-full rounded-xl py-3.5 px-8 text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${pickup && drop ? 'bg-[#047857] text-white shadow-[0_4px_12px_rgba(4,120,87,0.2)] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={!pickup || !drop}
        >
          Confirm Locations
        </button>
      </div>

    </div>
  );
};

export default LocationSelection;
