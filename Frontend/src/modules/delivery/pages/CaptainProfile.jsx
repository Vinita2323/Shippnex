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
  FileText,
  Star,
  Trash2,
  Crown,
} from 'lucide-react';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService, authService } from '../../../services/authService';
import RatingBreakdownModal from '../../../components/RatingBreakdownModal';

const CaptainProfile = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('shippnex_captain_online');
    return saved !== null ? saved === 'true' : true;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

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
    if (id === 'membership') {
      navigate('/captain/membership');
    } else if (id === 'personal-info') {
      navigate('/captain/personal-details');
    } else if (id === 'wallet') {
      navigate('/captain/wallet');
    } else if (id === 'ratings') {
      setShowBreakdownModal(true);
    } else if (id === 'service-areas') {
      navigate('/captain/service-areas');
    } else if (id === 'privacy') {
      navigate('/captain/privacy');
    } else if (id === 'help') {
      navigate('/captain/support');
    } else if (id === 'delete-account') {
      navigate('/captain/delete-account');
    } else {
      setActiveModal(id);
    }
  };

  const hasActiveMembership = profile?.membershipStatus === 'active';
  const isPendingMembership = profile?.membershipStatus === 'pending_payment';

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
      id: 'membership',
      label: 'Captain Membership',
      sub: hasActiveMembership
        ? 'Active Plan • View details & benefits'
        : isPendingMembership
        ? 'Payment request submitted • Pending admin approval'
        : '⚠️ Plan not purchased — Tap to choose plan',
      icon: Crown,
      badge: hasActiveMembership
        ? 'Active'
        : isPendingMembership
        ? 'Pending'
        : 'Not Purchased',
      badgeColor: hasActiveMembership
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : isPendingMembership
        ? 'bg-amber-100 text-amber-800 border-amber-300'
        : 'bg-amber-500 text-white border-amber-600',
    },
    {
      id: 'ratings',
      label: 'Captain Rating & Reviews',
      sub: profile?.ratingCount > 0
        ? `⭐ ${profile.ratingAverage.toFixed(1)} based on ${profile.ratingCount} ratings`
        : 'No customer ratings yet',
      icon: Star,
      badge: profile?.ratingCount > 0 ? `⭐ ${profile.ratingAverage.toFixed(1)}` : 'New',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
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
      id: 'privacy',
      label: 'Privacy Policy',
      sub: 'Driver data & platform privacy terms',
      icon: ShieldCheck,
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
    {
      id: 'delete-account',
      label: 'Delete Account',
      sub: 'Permanently remove captain profile & data',
      icon: Trash2,
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
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Account</span>
                {profile?.ratingCount > 0 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBreakdownModal(true);
                    }}
                    className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.2 rounded-full text-[10px] font-black cursor-pointer hover:bg-amber-100"
                  >
                    <span>⭐</span> {profile.ratingAverage.toFixed(1)} ({profile.ratingCount})
                  </span>
                )}
              </div>
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

        {/* Highlighted Membership Plan Banner when not purchased */}
        {!loading && !hasActiveMembership && (
          <div
            onClick={() => navigate('/captain/membership')}
            className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-400 rounded-3xl p-4 cursor-pointer hover:border-amber-500 transition-all shadow-md shadow-amber-500/10 group"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <Crown size={22} className="text-white drop-shadow-xs" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    Captain Membership
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {isPendingMembership ? 'Verification Pending' : 'Plan Not Purchased'}
                  </span>
                </div>

                <p className="text-xs text-amber-900/90 font-medium mt-1 leading-snug">
                  {isPendingMembership
                    ? 'Your membership payment request has been submitted and is awaiting admin approval.'
                    : 'A membership plan is required to activate captain benefits, order delivery allocation, and live earnings.'}
                </p>

                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors shadow-2xs">
                  <span>{isPendingMembership ? 'View Membership Status' : 'Choose Membership Plan'}</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1">Account & Settings</h2>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isMembershipItem = item.id === 'membership';
              const isHighlighted = isMembershipItem && !hasActiveMembership;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`rounded-2xl p-3 px-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-2 border-amber-400 shadow-md shadow-amber-500/10 ring-2 ring-amber-300/40 hover:border-amber-500'
                      : 'bg-white shadow-2xs border border-slate-200/70 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.isDanger
                        ? 'bg-red-50 text-red-500'
                        : isHighlighted
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs'
                        : isMembershipItem && hasActiveMembership
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <IconComponent size={18} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-tight truncate ${
                        item.isDanger
                          ? 'text-red-500'
                          : isHighlighted
                          ? 'text-amber-950 font-black'
                          : 'text-slate-900'
                      }`}>
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className={`text-[10px] font-medium truncate mt-0.5 ${
                          isHighlighted ? 'text-amber-800 font-semibold' : 'text-slate-400'
                        }`}>
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${item.badgeColor}`}>
                        {isHighlighted && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={16} className={
                      item.isDanger
                        ? 'text-red-400'
                        : isHighlighted
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    } strokeWidth={2} />
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

      {/* Rating Breakdown Modal */}
      <RatingBreakdownModal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        targetId={profile?._id}
        targetType="captain"
        targetName={captainName}
      />

      {/* Bottom Navigation */}
      {!activeModal && <CaptainBottomNav />}
    </div>
  );
};

export default CaptainProfile;
