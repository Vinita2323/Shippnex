import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [activeDay, setActiveDay] = useState('Sun');

  const earningsData = [
    { day: 'Mon', value: 210, height: '40%' },
    { day: 'Tue', value: 340, height: '65%' },
    { day: 'Wed', value: 290, height: '55%' },
    { day: 'Thu', value: 420, height: '80%' },
    { day: 'Fri', value: 230, height: '45%' },
    { day: 'Sat', value: 495, height: '95%' },
    { day: 'Sun', value: 482, height: '90%', current: true },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Compact TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2.5 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <img
              className="w-8 h-8 rounded-full border border-secondary-container object-cover shadow-xs"
              alt="Marcus Reed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWXL3Qu0JRKDr039sF-aSx5rQfnGlz0S99DOqkSfKyAgFhfUIw6hAHglW9IK7FrROv33gWnGtkkeVe68aWnWRPo_JlvATZfBAwj3J1cTKNvZ2mkDmumyw4cVA5K8nxu-TyA-YCKB_Te10l5t920ethYbEdBGNGETh4MD316jQl5JqOZ1J-KxaJv4EH7uz0OkhKAME-QMK4hcqD20kyxCmIHXk2cGjM4GlLzhbLWAUTyPQalJ1U5BYsmrA2EGL2nH15ow7kn24EAxA"
            />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-white rounded-full ${isOnline ? 'bg-secondary-fixed' : 'bg-outline'}`}></div>
          </div>
          <div className="leading-tight">
            <span className="text-[10px] text-on-surface-variant block font-medium">Good Morning,</span>
            <h1 className="font-headline-md text-sm font-bold text-primary truncate max-w-[130px]">Marcus Reed</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            <span className={`ms-1.5 font-label-sm text-[10px] font-bold tracking-wider ${isOnline ? 'text-secondary' : 'text-on-surface-variant'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </label>
          <button
            onClick={() => alert('Notifications: 2 pending route updates')}
            className="relative p-1.5 text-on-surface-variant hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Container - Added comfortable top padding & margin */}
      <main className="pt-16 md:pt-20 px-3.5 max-w-7xl mx-auto space-y-3.5 mt-2">
        {/* 4 Metric Cards Grid Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Today's Earning */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Today's Earning</p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-secondary font-bold text-xs">₹</span>
              <span className="text-primary font-extrabold text-lg md:text-xl leading-none">4,825.00</span>
            </div>
            <div className="mt-1.5 flex items-center text-secondary font-bold text-[10px] truncate">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
              +12.4%
            </div>
          </div>

          {/* Total Rides */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Total Rides</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-primary font-extrabold text-lg md:text-xl leading-none">24</span>
              <span className="text-on-surface-variant font-semibold text-[10px]">Rides</span>
            </div>
            <div className="mt-1.5 flex items-center text-secondary font-bold text-[10px] truncate">
              <span className="material-symbols-outlined text-xs mr-0.5">alt_route</span>
              +3 Today
            </div>
          </div>

          {/* Deliveries */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Deliveries</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-primary font-extrabold text-lg md:text-xl leading-none">14</span>
              <span className="text-on-surface-variant font-semibold text-[10px]">/18</span>
            </div>
            <div className="mt-2.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[78%] animate-pulse"></div>
            </div>
          </div>

          {/* Pending */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Pending</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-primary font-extrabold text-lg md:text-xl leading-none">03</span>
              <span className="text-on-surface-variant font-semibold text-[10px]">Tasks</span>
            </div>
            <div className="mt-1.5 flex items-center text-on-surface-variant font-bold text-[10px] truncate">
              <span className="material-symbols-outlined text-xs mr-0.5">schedule</span>
              14:00 PM
            </div>
          </div>
        </section>

        {/* Action Card Section */}
        <section className="grid grid-cols-1 gap-3.5">
          {/* New Jobs Action Card */}
          <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all border-white/60">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-headline-md text-base font-bold text-primary">New Jobs</h2>
                  <div className="w-2 h-2 bg-secondary-fixed rounded-full pulse-lime"></div>
                </div>
                <p className="text-on-surface-variant text-xs">4 deliveries near your area.</p>
              </div>
              <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl shadow-xs shrink-0">
                <span className="material-symbols-outlined text-lg">near_me</span>
              </div>
            </div>
            <div className="mt-3.5 flex gap-2">
              <button
                onClick={() => navigate('/driver/active-delivery')}
                className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-xs flex-1 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View Queue
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
              <button
                onClick={() => alert('Filtering jobs by weight, distance, and payout...')}
                className="bg-surface-container-high text-primary p-2.5 rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">filter_list</span>
              </button>
            </div>
          </div>
        </section>

        {/* Today's Pending Orders Section */}
        <section className="glass-panel p-4 rounded-xl border border-white/60 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-base font-bold text-primary">Today's Pending Orders</h2>
              <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                3 Pending
              </span>
            </div>
            <button
              onClick={() => navigate('/driver/jobs')}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'SNX-1024',
                payout: '₹1,250.00',
                time: '14:00 PM',
                type: 'Cold Chain Pharma',
                pickup: 'BioLogix Central Hub, Bay 14',
                dropoff: 'St. Jude Regional Medical Depot',
                status: 'IN TRANSIT',
                badgeColor: 'bg-[#ff6000]/15 text-[#ff6000]',
              },
              {
                id: 'SNX-1028',
                payout: '₹850.50',
                time: '15:30 PM',
                type: 'Electronics Freight',
                pickup: 'TechPort Warehouses, Gate 2',
                dropoff: 'Metro Distribution Hub B',
                status: 'PENDING PICKUP',
                badgeColor: 'bg-amber-100 text-amber-800',
              },
              {
                id: 'SNX-1035',
                payout: '₹640.00',
                time: '17:00 PM',
                type: 'Automotive Spare Parts',
                pickup: 'Industrial Parts Plant 4',
                dropoff: 'Apex Fleet Motors Workshop',
                status: 'SCHEDULED',
                badgeColor: 'bg-blue-100 text-blue-800',
              },
            ].map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-low/90 p-3 rounded-xl border border-outline-variant/20 hover:border-secondary/40 transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-primary">{order.id}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${order.badgeColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{order.type} • {order.time}</p>
                  </div>
                  <span className="font-extrabold text-sm text-secondary">{order.payout}</span>
                </div>

                <div className="space-y-1 text-xs bg-white/70 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-secondary text-xs shrink-0">warehouse</span>
                    <span className="font-bold text-on-surface text-[11px] shrink-0">From:</span>
                    <span className="text-on-surface-variant text-[11px] truncate">{order.pickup}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-secondary text-xs shrink-0">location_on</span>
                    <span className="font-bold text-on-surface text-[11px] shrink-0">To:</span>
                    <span className="text-on-surface-variant text-[11px] truncate">{order.dropoff}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/driver/active-delivery')}
                  className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  Start Delivery Route
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverDashboard;
