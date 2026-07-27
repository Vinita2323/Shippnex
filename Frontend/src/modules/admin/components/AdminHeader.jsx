import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { X, Menu, Settings, Bell, LogOut } from 'lucide-react';

export const AdminHeader = () => {
  const { sidebarOpen, toggleSidebar, activeTab, setActiveTab, notificationsCount } = useAdmin();

  const navLinks = [
    { id: 'orders', label: 'Orders' },
    { id: 'sellers', label: 'Sellers' },
    { id: 'payments', label: 'Wallet & Payouts' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-sm font-sans">
      {/* Left Section: Toggle Button */}
      <div className="flex items-center gap-5">
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
        </button>
      </div>

      {/* Middle Section: Quick Nav Links like Seller Header */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`text-[15px] font-semibold transition-colors cursor-pointer bg-transparent border-none ${
              activeTab === link.id ? 'text-[#002625] font-bold border-b-2 border-[#ff5500] pb-0.5' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right Section: Settings, Notifications, Logout Icons */}
      <div className="flex items-center gap-5 text-slate-700">
        <button 
          onClick={() => setActiveTab('notifications')}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer relative"
          title="Notifications"
        >
          <Bell size={22} />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5500] rounded-full" />
          )}
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Settings"
        >
          <Settings size={22} />
        </button>

        <button 
          onClick={() => alert('Super Admin logged out')}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};
