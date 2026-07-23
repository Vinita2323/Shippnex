import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  const mockNotifications = [
    {
      id: 1,
      title: 'Order Delivered Successfully!',
      message: 'Your order #ORD-8492 has been delivered. Thank you for shopping with us!',
      time: '2 hours ago',
      isNew: true
    },
    {
      id: 2,
      title: 'Exclusive Weekend Sale \uD83C\uDF89',
      message: 'Get up to 40% off on all Grocery Essentials this weekend. Hurry up!',
      time: '1 day ago',
      isNew: false
    },
    {
      id: 3,
      title: 'Item back in stock',
      message: 'Premium Basmati Rice from your wishlist is back in stock. Buy it now before it sells out.',
      time: '3 days ago',
      isNew: false
    }
  ];

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 py-4 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <ArrowLeft size={22} color="white" className="cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="text-[20px] font-semibold m-0 text-white">Notifications</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden flex flex-col gap-3">
        {mockNotifications.map((notif) => (
          <div key={notif.id} className={`bg-white rounded-[16px] p-4 flex gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border-l-[4px] ${notif.isNew ? 'border-[#ff5500]' : 'border-slate-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isNew ? 'bg-orange-50 text-[#ff5500]' : 'bg-slate-100 text-slate-400'}`}>
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-[14px] font-bold m-0 ${notif.isNew ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</h4>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed m-0">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
