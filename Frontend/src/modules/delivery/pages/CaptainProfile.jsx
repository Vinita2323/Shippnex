import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import CaptainBottomNav from '../components/CaptainBottomNav';

const CaptainProfile = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [captainName, setCaptainName] = useState(() => localStorage.getItem('shippnex_captain_name') || 'vini');
  const [captainEmail, setCaptainEmail] = useState(() => localStorage.getItem('shippnex_captain_email') || 'vini@shippnex.com');
  const [captainPhone, setCaptainPhone] = useState(() => localStorage.getItem('shippnex_captain_phone') || '+91 9302841832');
  
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'settings' | 'help' | 'about' | 'logout' | null
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(captainName);
  const [editEmail, setEditEmail] = useState(captainEmail);
  const [editPhone, setEditPhone] = useState(captainPhone);

  const handleSaveProfile = () => {
    setCaptainName(editName);
    setCaptainEmail(editEmail);
    setCaptainPhone(editPhone);
    localStorage.setItem('shippnex_captain_name', editName);
    localStorage.setItem('shippnex_captain_email', editEmail);
    localStorage.setItem('shippnex_captain_phone', editPhone);
    setIsEditingProfile(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('shippnex_captain_token');
    localStorage.removeItem('shippnex_captain_data');
    navigate('/captain/login');
  };

  const handleItemClick = (id) => {
    if (id === 'wallet') {
      navigate('/captain/wallet');
    } else {
      setActiveModal(id);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
    { id: 'logout', label: 'Logout', icon: LogOut, isDanger: true }
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans pb-24 text-slate-800 flex flex-col justify-between">
      <div className="max-w-md mx-auto px-4 py-3.5 w-full space-y-3.5">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/70 p-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Green Circular Avatar with White User Icon */}
            <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0 shadow-xs">
              <User size={20} strokeWidth={2.2} />
            </div>

            {/* Name & Greeting */}
            <div>
              <span className="text-[11px] font-normal text-slate-400 block leading-none">Hello</span>
              <span className="text-sm font-bold text-slate-900 block leading-tight mt-1">{captainName}</span>
            </div>
          </div>

          {/* Online Toggle Pill */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-13 h-7 rounded-full p-0.5 transition-all duration-300 flex items-center cursor-pointer border-none outline-none ${
              isOnline ? 'bg-[#10b981] justify-end' : 'bg-slate-300 justify-start'
            }`}
            title={isOnline ? 'Status: Online' : 'Status: Offline'}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md transition-all"></div>
          </button>
        </div>

        {/* Menu Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2.5 px-1">Menu</h2>

          {/* Menu Cards Stack (Compact Spacing & Padding) */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-xl p-3 px-4 shadow-2xs border border-slate-200/60 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <IconComponent 
                      size={19} 
                      className={item.isDanger ? 'text-red-500' : 'text-slate-800'} 
                      strokeWidth={1.9}
                    />
                    <span className={`text-sm font-semibold ${item.isDanger ? 'text-red-500' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight 
                    size={18} 
                    className={item.isDanger ? 'text-red-500' : 'text-slate-400'} 
                    strokeWidth={2}
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modals for Menu Items */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {activeModal === 'logout' ? 'Confirm Logout' : activeModal}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors border-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'profile' && (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center text-white text-xl font-bold shadow-md">
                    <User size={28} />
                  </div>
                  <span className="bg-[#10b981]/15 text-[#10b981] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={13} /> Verified Captain
                  </span>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold outline-none focus:border-[#10b981]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold outline-none focus:border-[#10b981]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone</label>
                      <input 
                        type="text" 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold outline-none focus:border-[#10b981]"
                      />
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      className="w-full bg-[#10b981] text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#059669] transition-all cursor-pointer border-none"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Name</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{captainName}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Email</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{captainEmail}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-semibold">Phone</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{captainPhone}</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-slate-800 transition-all cursor-pointer border-none"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeModal === 'settings' && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Auto Accept Trips</p>
                    <p className="text-[10px] text-slate-500">Automatically accept high payout orders</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#10b981]" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Voice Navigation</p>
                    <p className="text-[10px] text-slate-500">Turn-by-turn auditory alerts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#10b981]" />
                </div>
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
                <div className="w-10 h-10 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center mx-auto text-xs">
                  SNX
                </div>
                <p className="font-bold text-slate-900 text-xs">ShippNex Captain v2.4.0</p>
                <p className="text-[11px] text-slate-500">Powered by ShippNex Logistics Platform Engine.</p>
              </div>
            )}

            {activeModal === 'logout' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-600 text-center font-medium">
                  Are you sure you want to log out of your Captain account?
                </p>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border-none cursor-pointer hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutConfirm}
                    className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-xs border-none cursor-pointer hover:bg-red-600 shadow-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <CaptainBottomNav />
    </div>
  );
};

export default CaptainProfile;
