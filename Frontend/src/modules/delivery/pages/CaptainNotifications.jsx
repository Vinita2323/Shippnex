import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptainNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Traffic delay detected',
      message: 'Heavy traffic on I-90 E. Route recalculated to save 6 minutes.',
      time: '10 mins ago',
      read: false,
      icon: 'warning'
    },
    {
      id: 2,
      type: 'job',
      title: 'Incoming urgent freight alert',
      message: 'New high-priority load available near your location. Payout: ₹4,500.',
      time: '1 hour ago',
      read: false,
      icon: 'local_shipping'
    },
    {
      id: 3,
      type: 'system',
      title: '2 pending route updates',
      message: 'Please review your upcoming schedule for changes.',
      time: '2 hours ago',
      read: true,
      icon: 'map'
    },
    {
      id: 4,
      type: 'success',
      title: 'All items clear for handoff',
      message: 'Verification complete for Order #ORD-8821.',
      time: 'Yesterday',
      read: true,
      icon: 'check_circle'
    }
  ]);

  const getIconColor = (type, read) => {
    if (read) return 'text-slate-400 bg-slate-100';
    switch(type) {
      case 'alert': return 'text-red-500 bg-red-100';
      case 'job': return 'text-[#15803d] bg-[#97fc43]/20';
      case 'success': return 'text-emerald-500 bg-emerald-100';
      default: return 'text-blue-500 bg-blue-100';
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-slate-50 font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-3xl px-4 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-black text-white tracking-tight">Notifications</h1>
          </div>
        </div>
        <button 
          onClick={markAllRead}
          className="text-[#97fc43] text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
        >
          Mark all read
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 w-full max-w-md mx-auto flex-1 flex flex-col gap-3">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
              notification.read 
                ? 'bg-white border-slate-100' 
                : 'bg-[#97fc43]/5 border-[#15803d]/20 shadow-sm'
            }`}
            onClick={() => {
              setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
            }}
          >
            <div className="flex gap-4">
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${getIconColor(notification.type, notification.read)}`}>
                <span className="material-symbols-outlined text-lg">{notification.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${notification.read ? 'text-slate-700' : 'text-[#002625]'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                    {notification.time}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">notifications_off</span>
            <p className="font-bold text-slate-500">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CaptainNotifications;
