import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Menu, Settings, MapPin, LogOut } from 'lucide-react';
import { authService } from '../../../../services/authService';

const SellerHeader = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(() => {
    try {
      const cached = localStorage.getItem('shippnex_seller_data');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await authService.getSellerProfile();
        if (res?.seller) setSeller(res.seller);
      } catch (err) {}
    };
    fetchSeller();
  }, []);

  const handleLogout = () => {
    authService.logout('seller');
    navigate('/seller/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLocationClick = () => {
    const loc = seller?.warehouseLocation?.storeAddress || seller?.city || 'Main City Logistics Hub';
    alert(`Warehouse Location: ${loc}`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-sm font-sans">
      {/* Left Section: Toggle Button */}
      <div className="flex items-center gap-5">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Toggle Sidebar"
        >
          {isSidebarOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
        </button>
      </div>

      {/* Middle Section: Orders, Return Order, Wallet Links */}
      <div className="hidden md:flex items-center gap-10">
        <Link 
          to="/seller/orders" 
          className={`text-[15px] font-semibold transition-colors ${
            isActive('/seller/orders') ? 'text-[#002625] font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Orders
        </Link>
        <Link 
          to="/seller/return" 
          className={`text-[15px] font-semibold transition-colors ${
            isActive('/seller/return') || isActive('/seller/returns') ? 'text-[#002625] font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Return Order
        </Link>
        <Link 
          to="/seller/wallet" 
          className={`text-[15px] font-semibold transition-colors ${
            isActive('/seller/wallet') ? 'text-[#002625] font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Wallet
        </Link>
      </div>

      {/* Right Section: Settings, Location, Logout Icons */}
      <div className="flex items-center gap-5 text-slate-700">
        <button 
          onClick={() => navigate('/seller/settings')}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Settings"
        >
          <Settings size={22} />
        </button>

        <button 
          onClick={handleLocationClick}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Location"
        >
          <MapPin size={22} />
        </button>

        <button 
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default SellerHeader;
