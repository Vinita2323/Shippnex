import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Pencil, Camera, Package, Heart, Gift, Headphones, 
  ChevronRight, Wallet, User, MapPin, Lock, FileText, HelpCircle, 
  PhoneCall, LogOut, Trash2, Sparkles 
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const [profileImage, setProfileImage] = useState(null);
  
  const getUserDisplayName = () => {
    const storedName = localStorage.getItem('shippnex_user_name');
    if (storedName) return storedName;
    const userDataRaw = localStorage.getItem('shippnex_user_data');
    if (userDataRaw) {
      try {
        const u = JSON.parse(userDataRaw);
        if (u.name) return u.name;
        if (u.phone) return u.phone;
      } catch (e) {}
    }
    return 'User';
  };

  const [userName, setUserName] = useState(getUserDisplayName);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    setUserName(getUserDisplayName());
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleLogout = () => {
    authService.logout('user');
    clearCart();
    refreshWishlist();
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-10">
      
      {/* Orange Background Header */}
      <div className="absolute top-0 left-0 w-full h-[180px] bg-[#ea580c] rounded-b-[40px] z-0"></div>

      {/* Top Nav */}
      <header className="flex justify-between items-center pt-5 px-5 relative z-10">
        <button 
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border-none shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="text-[#1e1b4b] pr-[1px]" />
        </button>
        <button 
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border-none shadow-sm"
          onClick={() => navigate('/account-information')}
        >
          <Pencil size={15} className="text-[#1e1b4b]" />
        </button>
      </header>

      {/* Profile Info Container */}
      <div className="relative z-10 flex flex-col items-center mt-2 px-5">
        
        {/* Avatar Area */}
        <div className="relative mb-2">
          <div className="w-[70px] h-[70px] rounded-full border-[4px] border-white bg-[#fff5f0] flex items-center justify-center shadow-md overflow-hidden relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-[#ea580c]" strokeWidth={1.5} />
            )}
          </div>
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          {/* Camera Badge */}
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-none cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={14} className="text-[#ea580c]" />
          </button>
        </div>
        
        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[18px] font-extrabold text-white m-0 tracking-tight">{userName}</h2>
        </div>

        {/* 4 Grid Actions Card */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/orders')}>
            <Package size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">Orders</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/wishlist')}>
            <Heart size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">My Picks</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors">
            <Gift size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">Coupons</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-indigo-100 transition-colors">
            <Headphones size={18} className="text-[#1e1b4b]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">Help Center</span>
          </button>
        </div>

        {/* Account Settings Section */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4">
          <h4 className="text-[12px] font-extrabold text-[#1e1b4b] uppercase tracking-wider mb-4">Account Settings</h4>
          
          <div className="flex flex-col gap-3">

            {/* Account Info */}
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => navigate('/account-information')}
            >
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[12px] bg-[#ffedd5] flex items-center justify-center shrink-0">
                  <User size={16} className="text-[#ea580c]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-[#1e1b4b]">Account Information</span>
                  <span className="text-[11px] font-medium text-slate-400">Manage your email, phone, a...</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            {/* Saved Addresses */}
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => navigate('/saved-addresses')}
            >
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[12px] bg-[#ffe4e6] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#e11d48]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-[#1e1b4b]">Saved Addresses</span>
                  <span className="text-[11px] font-medium text-slate-400">Manage your delivery addres...</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

            {/* Security */}
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => navigate('/security')}
            >
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[12px] bg-[#fef3c7] flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-[#d97706]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-[#1e1b4b]">Security & Password</span>
                  <span className="text-[11px] font-medium text-slate-400">Change password and secure...</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

          </div>
        </div>

        {/* Feedback Section */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4">
          <h4 className="text-[12px] font-extrabold text-[#1e1b4b] uppercase tracking-wider mb-1">Feedback & Information</h4>
          
          <div className="flex flex-col">
            <div 
              className="flex items-center justify-between py-3 border-b border-slate-50 cursor-pointer group"
              onClick={() => navigate('/terms')}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#1e1b4b]" />
                <span className="text-[14px] font-bold text-[#1e1b4b]">Terms, Policies and Licenses</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            
            <div 
              className="flex items-center justify-between py-3 border-b border-slate-50 cursor-pointer group"
              onClick={() => navigate('/faqs')}
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-[#1e1b4b]" />
                <span className="text-[14px] font-bold text-[#1e1b4b]">Browse FAQs</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            
            <div 
              className="flex items-center justify-between py-3 cursor-pointer group"
              onClick={() => navigate('/support')}
            >
              <div className="flex items-center gap-3">
                <PhoneCall size={16} className="text-[#1e1b4b]" />
                <span className="text-[14px] font-bold text-[#1e1b4b]">Help & Support</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Danger Section */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-3">
          <div className="flex items-center justify-between cursor-pointer group" onClick={handleLogout}>
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-[12px] bg-[#fee2e2] flex items-center justify-center shrink-0">
                <LogOut size={16} className="text-[#e11d48]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#e11d48]">Log Out</span>
                <span className="text-[11px] font-medium text-slate-400">Safely terminate session</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-300 transition-colors" />
          </div>

          <div className="flex items-center justify-between cursor-pointer group" onClick={handleLogout}>
            <div className="flex items-center gap-3">
              <div className="w-[36px] h-[36px] rounded-[12px] bg-[#fee2e2] flex items-center justify-center shrink-0">
                <Trash2 size={16} className="text-[#e11d48]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#e11d48]">Delete Account</span>
                <span className="text-[11px] font-medium text-slate-400">Permanently remove your account</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-300 transition-colors" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
