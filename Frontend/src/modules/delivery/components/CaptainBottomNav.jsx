import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CaptainBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/captain/dashboard', icon: 'home', label: 'Home' },
    { path: '/captain/jobs', icon: 'local_shipping', label: 'Jobs' },
    { path: '/captain/active-delivery', icon: 'explore', label: 'Orders' },
    { path: '/captain/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
    { path: '/captain/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface/90 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-outline-variant/20">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-95'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-[12px] leading-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default CaptainBottomNav;
