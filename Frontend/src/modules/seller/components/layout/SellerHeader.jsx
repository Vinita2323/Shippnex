import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User } from 'lucide-react';

const SellerHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-[#ff5500] focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search orders, products..." 
            className="bg-transparent border-none outline-none text-[16px] font-normal text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <button 
          onClick={() => navigate('/seller/settings')}
          className="flex items-center gap-3 border-none bg-transparent cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors text-left select-none"
        >
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[16px] font-medium text-slate-800 leading-tight">FreshMart Warehouse</span>
            <span className="text-[14px] font-normal text-slate-500">Seller Account</span>
          </div>
          <div className="w-9 h-9 bg-orange-100 rounded-full border border-orange-200 flex items-center justify-center text-[#ff5500]">
            <User size={18} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default SellerHeader;
