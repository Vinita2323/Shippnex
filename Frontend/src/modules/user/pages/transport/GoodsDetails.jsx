import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Weight, Info } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const GoodsDetails = () => {
  const navigate = useNavigate();
  const { updateActiveBooking, activeBooking } = useTransport();

  const [category, setCategory] = useState(activeBooking.goods?.category || '');
  const [weight, setWeight] = useState(activeBooking.goods?.weight || '');
  const [packages, setPackages] = useState(activeBooking.goods?.packages || '');
  const [instructions, setInstructions] = useState(activeBooking.goods?.instructions || '');

  const categories = ['Furniture', 'Electronics', 'Groceries', 'Textiles', 'Hardware', 'Other'];

  const handleNext = () => {
    if (!category || !weight || !packages) return;
    
    updateActiveBooking('goods', { category, weight, packages, instructions });
    navigate('/transport/vehicle');
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800 ml-3">Goods Details</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-[100px] [&::-webkit-scrollbar]:hidden">
        
        {/* Category Selection */}
        <div className="mb-6">
          <label className="text-[14px] font-bold text-slate-700 mb-3 block flex items-center gap-2">
             <Package size={18} className="text-[#047857]" /> 
             Goods Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div 
                key={cat}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer border transition-all ${category === cat ? 'bg-[#047857] text-white border-[#047857] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Weight & Packages */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex flex-col gap-2">
             <label className="text-[13px] font-bold text-slate-600 flex items-center gap-1.5">
               <Weight size={16} /> Total Weight
             </label>
             <div className="bg-white border border-slate-200 rounded-xl p-1 pr-3 flex items-center shadow-sm">
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full bg-transparent border-none outline-none text-[15px] font-bold text-slate-800 px-3 py-2"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <span className="text-[13px] font-bold text-slate-400">KG</span>
             </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
             <label className="text-[13px] font-bold text-slate-600 flex items-center gap-1.5">
               <Package size={16} /> Total Packages
             </label>
             <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full bg-transparent border-none outline-none text-[15px] font-bold text-slate-800 px-3 py-2 text-center"
                  value={packages}
                  onChange={(e) => setPackages(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
           <label className="text-[13px] font-bold text-slate-600 mb-2 block flex items-center gap-1.5">
             <Info size={16} /> Special Instructions (Optional)
           </label>
           <textarea 
             className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-[14px] text-slate-700 shadow-sm resize-none min-h-[100px]"
             placeholder="E.g. Fragile items, keep upright..."
             value={instructions}
             onChange={(e) => setInstructions(e.target.value)}
           ></textarea>
        </div>

      </div>

      {/* Next Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[90]">
        <button 
          className={`w-full rounded-xl py-3.5 px-8 text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${category && weight && packages ? 'bg-[#047857] text-white shadow-[0_4px_12px_rgba(4,120,87,0.2)] active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={!category || !weight || !packages}
        >
          Select Vehicle
        </button>
      </div>

    </div>
  );
};

export default GoodsDetails;
