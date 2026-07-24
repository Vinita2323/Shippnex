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
        {/* Compact Stats Section - Comfortable Top Spacing */}
        <section className="grid grid-cols-3 gap-2.5">
          {/* Today's Earnings */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-tight font-bold truncate">Earnings</p>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-secondary font-bold text-xs">$</span>
              <span className="text-primary font-bold text-lg md:text-xl leading-none">482.50</span>
            </div>
            <div className="mt-1.5 flex items-center text-secondary font-semibold text-[9px] truncate">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
              +12.4%
            </div>
          </div>

          {/* Today's Deliveries */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-tight font-bold truncate">Deliveries</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-primary font-bold text-lg md:text-xl leading-none">14</span>
              <span className="text-on-surface-variant font-medium text-[10px]">/18</span>
            </div>
            <div className="mt-2.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[78%] animate-pulse"></div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-tight font-bold truncate">Pending</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-primary font-bold text-lg md:text-xl leading-none">03</span>
            </div>
            <div className="mt-1.5 flex items-center text-on-surface-variant font-semibold text-[9px] truncate">
              <span className="material-symbols-outlined text-xs mr-0.5">schedule</span>
              14:00 PM
            </div>
          </div>
        </section>

        {/* Compact Action Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

          {/* Vehicle Status Action Card */}
          <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all border-white/60 overflow-hidden">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1 min-w-0">
                <h2 className="font-headline-md text-base font-bold text-primary">Vehicle Status</h2>
                <p className="text-on-surface-variant text-xs font-medium truncate">Volvo FH Electric • SNX-9921</p>
                <div className="flex items-center gap-1.5 mt-1.5 bg-secondary-container/20 px-2.5 py-1 rounded-full w-fit">
                  <span className="material-symbols-outlined text-xs text-secondary shrink-0">battery_charging_full</span>
                  <span className="font-label-sm text-[10px] font-bold text-secondary">82% Charged (240km)</span>
                </div>
              </div>
              <div className="p-2.5 bg-surface-container-high text-primary rounded-xl shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
            </div>
            <div className="mt-3.5 flex items-center justify-between border-t border-outline-variant/20 pt-3">
              <div className="flex -space-x-1.5">
                <img
                  className="w-6 h-6 rounded-full border border-white object-cover"
                  alt="Teammate 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd5wj2yg_PhD26YER33rbuXwSX59KAB8u-49_B-sFuIlko6rsetHLVrKXJyEQiE9jFPUgeOcaPikBTylvnIGWjsVkgrtblnxoZgF59dhNHgSpJLQY1EN4skKPBx8FWM9czK-bQbb86CmhqJCOIiY-cshErJtmwi1GruWtzUFizbIsfjfjz_8nrgO4qnbib-lg85YJcFdpS-jfgn0qRw01uBcxiOmlTHwxqxOaTwZBcQS2qTiccyjlrix_H-EjBC6uXtnQ71z2HEI8"
                />
                <img
                  className="w-6 h-6 rounded-full border border-white object-cover"
                  alt="Teammate 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-rEZr9X-0_e6DtWws8Li6k2u8elrNw5TruYjLrFi-h1Uci5Cym1-XHqFfhrBz2rYtPjqCV3K2FtHDABK9UdPWzxWCGfC1QFj3L1lejXSkru8bPm1tTD7Gd_uEUd9xm-FWoBj6kc-OERtEsPZvUtBYxH4VUrzvchCTns4wGOhdsrst4aiG2EpVqkO45mjxYSVzhSbcx_SlMa0XeXgyBGysCs956B2irW5LiDC0EgykEfWv_8vP3TssYi_JXWKRbgINuWGWo0RXuIA"
                />
                <div className="w-6 h-6 rounded-full border border-white bg-surface-container-highest flex items-center justify-center text-[9px] font-bold text-primary">
                  +2
                </div>
              </div>
              <button
                onClick={() => alert('Vehicle Telematics: All systems normal. Next service in 4,200km')}
                className="text-secondary font-bold font-label-sm text-[11px] flex items-center hover:underline cursor-pointer"
              >
                Dashboard
                <span className="material-symbols-outlined ml-0.5 text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Lower Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {/* Earnings Trend Chart */}
          <div className="lg:col-span-2 glass-panel rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-headline-md text-base font-bold text-primary">Earnings Trend</h2>
                <p className="text-[10px] text-on-surface-variant">Weekly payout summary</p>
              </div>
              <select className="bg-surface-container-low border-none text-[10px] font-semibold rounded-lg p-1.5 focus:ring-secondary text-primary cursor-pointer">
                <option>Last 7 Days</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-1.5 px-1">
              {earningsData.map((item) => {
                const isSelected = activeDay === item.day;
                return (
                  <div
                    key={item.day}
                    onClick={() => setActiveDay(item.day)}
                    style={{ height: item.height }}
                    className={`flex-1 rounded-t-md relative group transition-all duration-300 cursor-pointer ${
                      item.current
                        ? 'bg-secondary-container shadow-xs'
                        : isSelected
                        ? 'bg-secondary/80'
                        : 'bg-secondary-container/20 hover:bg-secondary-container/40'
                    }`}
                  >
                    <div
                      className={`absolute -top-7 left-1/2 -translate-x-1/2 font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-primary text-white shadow-xs transition-opacity duration-200 ${
                        item.current || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      ${item.value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-3 px-1 text-on-surface-variant font-label-sm text-[10px]">
              {earningsData.map((item) => (
                <span
                  key={item.day}
                  className={`cursor-pointer ${
                    item.day === activeDay ? 'font-bold text-primary border-b-2 border-secondary' : ''
                  }`}
                  onClick={() => setActiveDay(item.day)}
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-panel rounded-xl p-4">
            <h2 className="font-headline-md text-base font-bold text-primary mb-4">Activity</h2>
            <div className="space-y-4 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-0 before:w-[2px] before:bg-surface-container-high">
              <div className="flex gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-secondary border-2 border-surface shrink-0"></div>
                <div>
                  <p className="font-bold text-primary text-xs leading-none">Drop-off Completed</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Warehouse Zone B • 10:42 AM</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-secondary-container border-2 border-surface shrink-0"></div>
                <div>
                  <p className="font-bold text-primary text-xs leading-none">Pickup Verified</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Central Port Hub • 09:15 AM</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="w-5 h-5 rounded-full bg-surface-container-high border-2 border-surface shrink-0"></div>
                <div>
                  <p className="font-bold text-primary text-xs leading-none">Shift Started</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Industrial North • 08:00 AM</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Opening complete activity logs audit trail...')}
              className="w-full mt-4 py-1.5 text-secondary font-bold font-label-sm text-[10px] hover:bg-secondary/5 rounded-lg transition-colors cursor-pointer"
            >
              View All Logs
            </button>
          </div>
        </section>
      </main>

      {/* FAB for Quick Actions */}
      <button
        onClick={() => navigate('/driver/active-delivery')}
        className="fixed bottom-16 right-4 w-11 h-11 bg-primary text-secondary-fixed rounded-full shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform cursor-pointer hover:bg-primary-container"
        title="Start Delivery Navigation"
      >
        <span className="material-symbols-outlined text-xl">add</span>
      </button>

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverDashboard;
