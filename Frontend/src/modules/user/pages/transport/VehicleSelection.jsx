import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, Clock, IndianRupee, Check } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const VehicleSelection = () => {
  const navigate = useNavigate();
  const { updateActiveBooking, activeBooking } = useTransport();

  const [selectedVehicleId, setSelectedVehicleId] = useState(activeBooking.vehicle?.id || null);

  const availableVehicles = [
    { id: 1, name: '3 Wheeler', capacity: '500 kg', price: 350, eta: '3 mins', icon: <Truck size={32} /> },
    { id: 2, name: 'Mini Truck', capacity: '750 kg', price: 450, eta: '5 mins', icon: <Truck size={32} /> },
    { id: 3, name: 'Pickup 8ft', capacity: '1200 kg', price: 800, eta: '8 mins', icon: <Truck size={32} /> },
    { id: 4, name: 'Truck 14ft', capacity: '2000 kg', price: 1500, eta: '15 mins', icon: <Truck size={32} /> }
  ];

  const handleNext = () => {
    if (!selectedVehicleId) return;
    const vehicle = availableVehicles.find(v => v.id === selectedVehicleId);
    updateActiveBooking('vehicle', vehicle);
    navigate('/transport/summary');
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Select Vehicle</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-[100px] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
        
        {availableVehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            className={`bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${selectedVehicleId === vehicle.id ? 'border-[#ff5500] bg-orange-50/20' : 'border-transparent hover:border-slate-200'}`}
            onClick={() => setSelectedVehicleId(vehicle.id)}
          >
             <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
                  {vehicle.icon}
                </div>
                <div className="flex flex-col gap-1">
                   <h3 className="text-[15px] font-bold text-slate-800 m-0">{vehicle.name}</h3>
                   <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                     <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Up to {vehicle.capacity}</span>
                   </div>
                   <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 mt-0.5">
                     <Clock size={12} /> {vehicle.eta} away
                   </div>
                </div>
             </div>

             <div className="flex flex-col items-end justify-between h-full gap-4">
                {selectedVehicleId === vehicle.id ? (
                   <div className="w-5 h-5 rounded-full bg-[#ff5500] flex items-center justify-center">
                     <Check size={14} className="text-white" strokeWidth={3} />
                   </div>
                ) : (
                   <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                )}
                <div className="flex items-center text-[18px] font-extrabold text-slate-900 mt-2">
                   <IndianRupee size={16} strokeWidth={2.5} /> {vehicle.price}
                </div>
             </div>
          </div>
        ))}

      </div>

      {/* Next Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[90]">
        <button 
          className={`w-full rounded-xl py-3.5 px-8 text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${selectedVehicleId ? 'bg-[#ff5500] text-white shadow-[0_4px_12px_rgba(255,85,0,0.2)] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={!selectedVehicleId}
        >
          Review Fare Summary
        </button>
      </div>

    </div>
  );
};

export default VehicleSelection;
