import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, Clock, MapPin, ChevronRight, Settings, Smartphone, Home } from 'lucide-react';

const TransportHome = () => {
  const navigate = useNavigate();

  const quickCategories = [
    { id: 1, name: 'Furniture', icon: <Home size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { id: 2, name: 'Electronics', icon: <Smartphone size={24} className="text-purple-500" />, bg: 'bg-purple-50' },
    { id: 3, name: 'Groceries', icon: <Package size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { id: 4, name: 'Hardware', icon: <Settings size={24} className="text-orange-500" />, bg: 'bg-orange-50' }
  ];

  const popularVehicles = [
    { id: 1, name: 'Mini Truck', capacity: '750 kg', time: '5 mins away', icon: <Truck size={32} className="text-slate-700" /> },
    { id: 2, name: 'Pickup 8ft', capacity: '1200 kg', time: '8 mins away', icon: <Truck size={32} className="text-slate-700" /> },
    { id: 3, name: '3 Wheeler', capacity: '500 kg', time: '3 mins away', icon: <Truck size={32} className="text-slate-700" /> }
  ];

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <h2 className="text-[18px] font-bold tracking-tight m-0 text-slate-900">Transport</h2>
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer">
          <Clock size={18} className="text-slate-600" />
        </div>
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
        <div className="px-5 mb-6 -mt-2 relative z-20">
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
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
              <div key={category.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-14 h-14 rounded-[16px] ${category.bg} flex items-center justify-center transition-transform group-active:scale-95 group-hover:-translate-y-1`}>
                  {category.icon}
                </div>
                <span className="text-[11px] font-medium text-slate-600 text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Vehicles */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-[15px] font-bold text-slate-800">Popular Vehicles</h3>
             <span className="text-[12px] font-bold text-[#ff5500] cursor-pointer">View All</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden -mx-5 px-5">
            {popularVehicles.map((vehicle) => (
              <div key={vehicle.id} className="min-w-[140px] bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col cursor-pointer hover:border-slate-200 transition-colors">
                <div className="w-full h-12 flex items-center justify-center mb-3">
                   {vehicle.icon}
                </div>
                <h4 className="text-[14px] font-bold text-slate-800 m-0 mb-1">{vehicle.name}</h4>
                <div className="flex items-center gap-1.5 mb-2 text-slate-500">
                  <Package size={12} />
                  <span className="text-[11px] font-medium">Up to {vehicle.capacity}</span>
                </div>
                <div className="bg-green-50 rounded text-green-700 text-[10px] font-bold py-1 px-2 w-fit">
                  {vehicle.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransportHome;
