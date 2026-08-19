import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, Crosshair, Navigation, Plus, X } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const LocationSelection = () => {
  const navigate = useNavigate();
  const { updateActiveBooking, activeBooking } = useTransport();

  const [pickup, setPickup] = useState(activeBooking.pickup || '');
  const [stops, setStops] = useState(activeBooking.stops || []);
  const [drop, setDrop] = useState(activeBooking.drop || '');
  const [activeInput, setActiveInput] = useState('drop'); // 'pickup', 'drop', or 'stop_0', 'stop_1', etc.

  const savedAddresses = [
    { id: 1, title: 'Home', address: '123 Palm Avenue, Green Park', icon: <MapPin size={16} /> },
    { id: 2, title: 'Warehouse A', address: 'Plot 45, Industrial Estate', icon: <MapPin size={16} /> }
  ];

  const handleAddStop = () => {
    if (stops.length >= 3) return;
    const newStops = [...stops, ''];
    setStops(newStops);
    setActiveInput(`stop_${newStops.length - 1}`);
  };

  const handleRemoveStop = (index, e) => {
    e.stopPropagation();
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
    if (activeInput === `stop_${index}`) {
      setActiveInput('drop');
    } else if (activeInput.startsWith('stop_')) {
      const activeIdx = parseInt(activeInput.split('_')[1], 10);
      if (activeIdx > index) {
        setActiveInput(`stop_${activeIdx - 1}`);
      }
    }
  };

  const handleUpdateStop = (index, value) => {
    setStops(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSelectAddress = (address) => {
    if (activeInput === 'pickup') {
      setPickup(address);
    } else if (activeInput === 'drop') {
      setDrop(address);
    } else if (activeInput.startsWith('stop_')) {
      const idx = parseInt(activeInput.split('_')[1], 10);
      handleUpdateStop(idx, address);
    }
  };

  const handleNext = () => {
    if (!pickup || !drop) return;
    updateActiveBooking('pickup', pickup);
    updateActiveBooking('stops', stops.filter(s => s && s.trim()));
    updateActiveBooking('drop', drop);
    navigate('/transport/goods');
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100">
        <div className="flex items-center">
          <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Select Location</h2>
        </div>

        {/* Add Stop Header Action */}
        {stops.length < 3 && (
          <button
            type="button"
            onClick={handleAddStop}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-200 px-2.5 py-1 rounded-lg text-[12px] font-bold cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>Add Stop</span>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pb-[100px] [&::-webkit-scrollbar]:hidden">
        
        {/* Input Card */}
        <div className="bg-white p-5 rounded-b-[20px] shadow-sm mb-4 relative z-10">
          <div className="flex gap-3.5">
            
            {/* Dynamic vertical timeline visual */}
            <div className="flex flex-col items-center mt-3.5 mb-3.5 shrink-0">
              {/* Pickup dot */}
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></div>
              
              {/* Intermediate stops dots */}
              {stops.map((_, idx) => (
                <React.Fragment key={`dot_${idx}`}>
                  <div className="w-0.5 flex-1 min-h-[22px] bg-slate-200 my-1"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100 shrink-0"></div>
                </React.Fragment>
              ))}

              <div className="w-0.5 flex-1 min-h-[22px] bg-slate-200 my-1"></div>
              {/* Drop dot */}
              <div className="w-3 h-3 rounded-sm bg-orange-500 ring-2 ring-orange-100 shrink-0"></div>
            </div>
            
            {/* Inputs Container */}
            <div className="flex-1 flex flex-col gap-3">
              
              {/* Pickup Location */}
              <div 
                className={`bg-slate-50 border ${activeInput === 'pickup' ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30' : 'border-slate-200'} rounded-xl p-3 flex items-center gap-2 cursor-text transition-all`}
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

              {/* Dynamic Stops */}
              {stops.map((stopVal, idx) => (
                <div 
                  key={idx}
                  className={`bg-slate-50 border ${activeInput === `stop_${idx}` ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/30' : 'border-slate-200'} rounded-xl p-3 flex items-center justify-between gap-2 cursor-text transition-all`}
                  onClick={() => setActiveInput(`stop_${idx}`)}
                >
                  <input 
                    type="text" 
                    placeholder={`Stop ${idx + 1} Location`}
                    value={stopVal}
                    onChange={(e) => handleUpdateStop(idx, e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveStop(idx, e)}
                    className="w-6 h-6 rounded-full bg-slate-200/70 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
                    title="Remove Stop"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {/* Drop Location */}
              <div 
                className={`bg-slate-50 border ${activeInput === 'drop' ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500/30' : 'border-slate-200'} rounded-xl p-3 flex items-center gap-2 cursor-text transition-all`}
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

              {/* In-Card Add Stop Button */}
              {stops.length < 3 && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="flex items-center gap-1.5 text-[#047857] hover:text-[#065f46] font-bold text-[12.5px] bg-transparent border-none cursor-pointer py-1 px-1 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[#047857]">
                      <Plus size={13} strokeWidth={3} />
                    </div>
                    <span>+ Add Stop {stops.length > 0 ? `(${stops.length}/3)` : ''}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Location Action Tabs */}
        <div className="px-5 mb-5 grid grid-cols-2 gap-2.5">
          <button 
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.03)] cursor-pointer transition-all active:scale-[0.98]"
            onClick={() => handleSelectAddress('Current Location (123 Palm Ave)')}
          >
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Crosshair size={14} />
            </div>
            <span className="text-[12.5px] font-bold text-blue-600 truncate">Current Location</span>
          </button>
          
          <button 
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.03)] cursor-pointer transition-all active:scale-[0.98]"
            onClick={() => handleSelectAddress('Selected from Map (MG Road, Central)')}
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Navigation size={14} />
            </div>
            <span className="text-[12.5px] font-bold text-slate-700 truncate">Select from Map</span>
          </button>
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
          Confirm Locations {stops.length > 0 ? `(${stops.length + 2} stops total)` : ''}
        </button>
      </div>

    </div>
  );
};

export default LocationSelection;
