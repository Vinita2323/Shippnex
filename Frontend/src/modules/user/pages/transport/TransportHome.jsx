import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Bike, Package, Clock, MapPin, ChevronRight, Settings, Smartphone, Home, Loader2, IndianRupee } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';
import { transportService } from '../../../../services/transportService';

const TransportHome = () => {
  const navigate = useNavigate();
  const { updateActiveBooking } = useTransport();
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const quickCategories = [
    { id: 1, name: 'Furniture', icon: <Home size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { id: 2, name: 'Electronics', icon: <Smartphone size={24} className="text-purple-500" />, bg: 'bg-purple-50' },
    { id: 3, name: 'Groceries', icon: <Package size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { id: 4, name: 'Hardware', icon: <Settings size={24} className="text-orange-500" />, bg: 'bg-orange-50' }
  ];

  // Fetch active vehicles dynamically from backend
  useEffect(() => {
    const fetchActiveVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const data = await transportService.getVehicles();
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic transport vehicles:', err);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchActiveVehicles();
  }, []);

  const handleCategorySelect = (categoryName) => {
    updateActiveBooking('goods', { category: categoryName, weight: '', packages: '', instructions: '' });
    navigate('/transport/location');
  };

  const handleVehicleSelect = (vehicle) => {
    updateActiveBooking('vehicle', vehicle);
    navigate('/transport/location');
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <h2 className="text-[18px] font-bold tracking-tight m-0 text-slate-900">Transport</h2>
        <button
          onClick={() => navigate('/orders', { state: { tab: 'transport' } })}
          title="Past Transport Bookings"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors border-none"
        >
          <Clock size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-[100px] [&::-webkit-scrollbar]:hidden">
        
        {/* Hero Banner */}
        <div className="px-5 pt-4 pb-2">
          <div className="bg-gradient-to-br from-[#115e59] to-[#047857] rounded-[20px] p-6 text-white relative overflow-hidden shadow-[0_8px_24px_rgba(4,120,87,0.2)]">
            {/* Decorative circles */}
            <div className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] rounded-full border-[15px] border-white/10"></div>
            <div className="absolute bottom-[-30px] right-[40px] w-[80px] h-[80px] rounded-full border-[12px] border-white/10"></div>
            
            <div className="relative z-10">
              <h1 className="text-[22px] font-extrabold mb-1">Move Anything, Anywhere</h1>
              <p className="text-[13px] text-emerald-100 mb-5 max-w-[80%]">Reliable goods transport at your fingertips.</p>
              
              <button 
                className="bg-white text-[#047857] border-none rounded-xl py-3 px-6 text-[14px] font-bold cursor-pointer shadow-md transition-transform duration-200 active:scale-95 flex items-center gap-2"
                onClick={() => navigate('/transport/location')}
              >
                <Truck size={18} />
                Book Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Quick Location Input (Floating Card) */}
        <div className="px-5 mb-6 mt-4 relative z-20">
          <div 
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate('/transport/location')}
          >
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <MapPin size={20} className="text-[#ff5500]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-slate-800">Where to transport?</span>
                  <span className="text-[12px] text-slate-500">Enter drop location</span>
                </div>
             </div>
             <ChevronRight size={20} className="text-slate-400" />
          </div>
        </div>

        {/* Quick Categories */}
        <div className="px-5 mb-8">
          <h3 className="text-[15px] font-bold text-slate-800 mb-4">What are you sending?</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickCategories.map((category) => (
              <div 
                key={category.id} 
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => handleCategorySelect(category.name)}
              >
                <div className={`w-14 h-14 rounded-[16px] ${category.bg} flex items-center justify-center transition-transform group-active:scale-95 group-hover:-translate-y-1`}>
                  {category.icon}
                </div>
                <span className="text-[11px] font-medium text-slate-600 text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Popular Vehicles from Backend */}
        <div className="px-5 mb-6">
          <div className="mb-3 flex items-center justify-between">
             <h3 className="text-[15px] font-bold text-slate-800 m-0">Available Vehicles</h3>
             <span className="text-[11px] font-bold text-[#047857]">Live Fleet</span>
          </div>
          
          {loadingVehicles ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin text-[#047857]" />
              <span className="text-[13px]">Loading fleet types…</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {vehicles.slice(0, 4).map((vehicle) => (
                <div 
                  key={vehicle._id} 
                  className="bg-white rounded-xl p-3 shadow-2xs border border-slate-100 flex flex-col cursor-pointer hover:border-slate-200 hover:shadow-xs transition-all active:scale-[0.98]"
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="w-full flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#047857] shrink-0 font-bold">
                      {vehicle.icon === 'bike' ? <Bike size={18} /> : <Truck size={18} />}
                    </div>
                    <span className="bg-emerald-50 text-[#047857] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      ₹{vehicle.perKmFare}/km
                    </span>
                  </div>

                  <h4 className="text-[13px] font-bold text-slate-800 m-0 mb-0.5">{vehicle.name}</h4>
                  <div className="flex items-center justify-between text-slate-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Package size={11} className="text-slate-400 shrink-0" />
                      <span className="text-[10.5px] font-medium text-slate-500">Up to {vehicle.capacityKg} kg</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">
                      ₹{vehicle.minimumFare}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TransportHome;
