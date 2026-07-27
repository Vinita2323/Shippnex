import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Truck, 
  Warehouse, 
  FolderTree, 
  Package, 
  Boxes, 
  ShoppingCart, 
  Navigation, 
  CreditCard, 
  Ticket, 
  BarChart3, 
  Bell, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = () => {
  const { sidebarOpen, activeTab, setActiveTab } = useAdmin();
  const [expandedMenus, setExpandedMenus] = useState({ catalog: true });

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store, badge: '9' },
    { id: 'drivers', label: 'Drivers', icon: Truck, badge: '15' },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    {
      id: 'catalog',
      label: 'Catalog & Products',
      icon: Package,
      submenu: [
        { id: 'categories', label: 'Categories', icon: FolderTree },
        { id: 'products', label: 'Products & Stock', icon: Boxes },
      ]
    },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'deliveries', label: 'Deliveries', icon: Navigation },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Roles & Access', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#002625] text-slate-200 border-r border-[#0b3d3b] transition-all duration-300 flex flex-col h-screen sticky top-0 z-40 shrink-0 select-none shadow-2xl font-sans`}
    >
      {/* Brand Header with white background and /Logo.png matching Seller Sidebar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-center px-3 shrink-0">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center justify-center w-full py-1 bg-transparent border-none cursor-pointer"
        >
          <img 
            src="/Logo.png" 
            alt="ShippNex Logo" 
            className={`${sidebarOpen ? 'h-11' : 'h-8'} max-w-full object-contain transition-all`} 
          />
        </button>
      </div>

      {/* Navigation Links with enhanced text size */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-[#0b3d3b]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = activeTab === item.id || (item.submenu && item.submenu.some(sub => sub.id === activeTab));

          if (item.submenu) {
            const isExpanded = expandedMenus[item.id];
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => sidebarOpen ? toggleSubmenu(item.id) : setActiveTab('products')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-[15px] border-none cursor-pointer ${
                    isItemActive 
                      ? 'bg-[#0b3d3b] text-white shadow-sm border-l-4 border-[#ff5500]' 
                      : 'text-slate-200 hover:bg-[#0b3d3b]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isItemActive ? 'text-[#ff5500]' : 'text-slate-300'} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && (
                    isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                  )}
                </button>

                {/* Submenu Children */}
                {sidebarOpen && isExpanded && (
                  <div className="pl-8 space-y-1 border-l-2 border-[#0b3d3b] ml-4 my-1">
                    {item.submenu.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all border-none cursor-pointer ${
                            isSubActive 
                              ? 'bg-[#ff5500] text-white font-bold shadow-md' 
                              : 'text-slate-300 hover:text-white hover:bg-[#0b3d3b]/40'
                          }`}
                        >
                          <SubIcon size={16} />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-[15px] border-none cursor-pointer ${
                isItemActive 
                  ? 'bg-[#0b3d3b] text-white font-bold border-l-4 border-[#ff5500] shadow-sm' 
                  : 'text-slate-200 hover:bg-[#0b3d3b]/60'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isItemActive ? 'text-[#ff5500]' : 'text-slate-300'} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && item.badge && (
                <span className="bg-[#ff5500]/20 text-[#ff5500] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#ff5500]/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin User Footer Profile */}
      <div className="p-3 border-t border-[#0b3d3b] bg-[#00201f]">
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} gap-2`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="Admin Avatar"
                className="w-9 h-9 rounded-xl border border-[#97fc43] object-cover shrink-0" 
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">Elena Vance</p>
                <p className="text-[10px] text-[#97fc43] truncate font-mono font-semibold">Root Administrator</p>
              </div>
            </div>
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              alt="Admin Avatar"
              className="w-9 h-9 rounded-xl border border-[#97fc43] object-cover" 
            />
          )}

          {sidebarOpen && (
            <button 
              onClick={() => alert('Admin session ended.')}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
