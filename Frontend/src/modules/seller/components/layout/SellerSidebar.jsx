import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Box, ShoppingCart, 
  Truck, Users, FileText, Settings, HelpCircle, LogOut 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
  { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
  { name: 'Products', path: '/seller/products', icon: Package },
  { name: 'Inventory', path: '/seller/inventory', icon: Box },
  { name: 'Dispatch', path: '/seller/dispatch', icon: Truck },
  { name: 'Customers', path: '/seller/customers', icon: Users },
  { name: 'Reports', path: '/seller/reports', icon: FileText },
];

const SellerSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-full shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-40 shrink-0`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 px-4 py-2">
        <div className="flex items-center w-full justify-center">
          <img src="/Logo.png" alt="ShippNex" className={`${isOpen ? 'h-12' : 'h-10 w-10 object-contain'} transition-all`} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5 [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-all cursor-pointer select-none ${isActive ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              title={!isOpen ? item.name : undefined}
            >
              <Icon size={20} className={`pointer-events-none shrink-0 ${isActive ? 'text-[#ff5500]' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
              {isOpen && <span className={`pointer-events-none font-medium text-[17px] tracking-wide ${isActive ? 'text-orange-700' : ''}`}>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 flex flex-col gap-1.5">
        <Link to="/seller/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-slate-600 hover:bg-slate-50 transition-all cursor-pointer select-none">
          <Settings size={20} className="text-slate-400 pointer-events-none shrink-0" />
          {isOpen && <span className="font-medium text-[17px] tracking-wide pointer-events-none">Settings</span>}
        </Link>
        <button 
          onClick={() => navigate('/seller/login')}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-red-600 hover:bg-red-50 transition-all cursor-pointer select-none bg-transparent border-none w-full text-left"
        >
          <LogOut size={20} className="text-red-500 pointer-events-none shrink-0" />
          {isOpen && <span className="font-medium text-[17px] tracking-wide pointer-events-none">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
