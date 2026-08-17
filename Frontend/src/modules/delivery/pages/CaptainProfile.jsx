import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  X,
  ShieldCheck,
  MapPin,
  FileText
} from 'lucide-react';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService, authService } from '../../../services/authService';

const CaptainProfile = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('shippnex_captain_online');
    return saved !== null ? saved === 'true' : true;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await captainService.getProfile();
      if (res.captain) {
        setProfile(res.captain);
        const onlineState = res.captain.isOnline !== undefined ? res.captain.isOnline : true;
        setIsOnline(onlineState);
        localStorage.setItem('shippnex_captain_online', String(onlineState));
        localStorage.setItem('shippnex_captain_name', res.captain.name || '');
        localStorage.setItem('shippnex_captain_phone', res.captain.phone || '');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlineToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    localStorage.setItem('shippnex_captain_online', String(newStatus));
    try {
      await captainService.updateOnlineStatus(newStatus);
    } catch (err) {
      setIsOnline(!newStatus);
      localStorage.setItem('shippnex_captain_online', String(!newStatus));
    }
  };

  const handleLogoutConfirm = () => {
    authService.logout('captain');
    navigate('/captain/login');
  };

  const handleItemClick = (id) => {
    if (id === 'personal-info') {
      navigate('/captain/personal-details');
    } else if (id === 'wallet') {
      navigate('/captain/wallet');
    } else if (id === 'service-areas') {
      navigate('/captain/service-areas');
    } else {
      setActiveModal(id);
    }
  };

  const menuItems = [
    {
      id: 'personal-info',
      label: 'Personal Information',
      sub: 'All registration details & uploaded docs',
      icon: User,
      badge: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'wallet',
      label: 'Wallet & Payouts',
      sub: `Balance: ₹${(profile?.walletBalance || 0).toFixed(2)}`,
      icon: Wallet,
    },
    {
      id: 'service-areas',
      label: 'Active Service Areas',
      sub: 'View sellers in your delivery range',
      icon: MapPin,
    },
    {
      id: 'settings',
      label: 'Settings & Alerts',
      sub: 'Trip auto-accept & audio navigation',
      icon: Settings,
    },
    {
      id: 'help',
      label: 'Help & 24/7 Support',
      sub: 'Toll-free dispatch helpline',
      icon: HelpCircle,
    },
    {
      id: 'about',
      label: 'About ShippNex',
      sub: 'v3.0.0 partner engine',
      icon: Info,
    },
    {
      id: 'logout',
      label: 'Logout Account',
      sub: 'Sign out of partner session',
      icon: LogOut,
      isDanger: true,
    },
  ];

  const captainName = profile?.name || localStorage.getItem('shippnex_captain_name') || 'Captain Partner';
  const captainPhone = profile?.phone || localStorage.getItem('shippnex_captain_phone') || '';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-28 text-slate-800 flex flex-col justify-between">
      <div className="max-w-md mx-auto px-4 py-3.5 w-full space-y-3.5">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-2xs border border-slate-200/80 p-4 flex items-center justify-between">
          <div
            onClick={() => navigate('/captain/personal-details')}
            className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#002625] to-[#15803d] flex items-center justify-center text-white text-lg font-black shadow-xs shrink-0">
              {captainName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Account</span>
              <span className="text-sm font-black text-slate-900 block truncate leading-tight mt-0.5">{captainName}</span>
              <span className="text-[11px] text-slate-500 font-medium block">{captainPhone}</span>
            </div>
          </div>

          <button
            onClick={handleOnlineToggle}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-all duration-300 flex items-center cursor-pointer border-none outline-none shrink-0 ${
              isOnline ? 'bg-[#10b981] justify-end' : 'bg-slate-300 justify-start'
            }`}
            title={isOnline ? 'Status: Online' : 'Status: Offline'}
          >
            <div className="w-5.5 h-5.5 rounded-full bg-white shadow-md transition-all"></div>
          </button>
        </div>

        {/* Verification Status Card */}
        {!loading && profile?.status === 'approved' && (
          <div
            onClick={() => navigate('/captain/personal-details')}
            className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 px-4 cursor-pointer hover:bg-emerald-100/50 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-700" />
              <div>
                <span className="text-xs font-black text-emerald-800 block leading-tight">Verified Captain Partner</span>
                <span className="text-[10px] text-emerald-600 font-medium">All KYC documents verified & active</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-700" />
          </div>
        )}

        {/* Menu Items List */}
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1">Account & Settings</h2>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-2xl p-3 px-4 shadow-2xs border border-slate-200/70 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.isDanger ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <IconComponent size={18} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${item.isDanger ? 'text-red-500' : 'text-slate-900'} leading-tight truncate`}>
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.sub}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={16} className={item.isDanger ? 'text-red-400' : 'text-slate-400'} strokeWidth={2} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals for Settings, Help, About, Logout */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {activeModal === 'logout' ? 'Confirm Logout' : activeModal}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer border-none">
                <X size={16} />
              </button>
            </div>

            {activeModal === 'settings' && (
              <div className="space-y-3 py-1">
                {[
                  { label: 'Auto Accept Trips', sub: 'Automatically accept high payout orders' },
                  { label: 'Voice Navigation', sub: 'Turn-by-turn auditory alerts' },
                ].map(({ label, sub }) => (
                  <div key={label} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-500">{sub}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#10b981]" />
                  </div>
                ))}
              </div>
            )}

            {activeModal === 'help' && (
              <div className="space-y-2.5 py-1 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Need assistance with your deliveries?</p>
                <p>Contact ShippNex Captain Dispatch Support anytime 24/7:</p>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-emerald-800 font-bold text-center">
                  📞 Toll Free: 1800-SHIPPNEX
                </div>
              </div>
            )}

            {activeModal === 'about' && (
              <div className="space-y-2 py-1 text-center text-slate-600">
                <div className="w-10 h-10 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center mx-auto text-xs">SNX</div>
                <p className="font-bold text-slate-900 text-xs">ShippNex Captain v3.0.0</p>
                <p className="text-[11px] text-slate-500">Powered by ShippNex Logistics Platform Engine.</p>
              </div>
            )}

            {activeModal === 'logout' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-600 text-center font-medium">Are you sure you want to log out of your Captain account?</p>
                <div className="flex gap-2.5">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border-none cursor-pointer hover:bg-slate-200">
                    Cancel
                  </button>
                  <button onClick={handleLogoutConfirm} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs border-none cursor-pointer shadow-md">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {!activeModal && <CaptainBottomNav />}
    </div>
  );
};

export default CaptainProfile;
