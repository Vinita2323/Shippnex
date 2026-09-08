import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Pencil, Camera, Package, Heart, Gift, Headphones, 
  ChevronRight, Wallet, User, MapPin, Lock, FileText, HelpCircle, 
  PhoneCall, LogOut, Trash2, Sparkles, Clock, ShoppingBag, Loader2, Star, ShieldCheck 
} from 'lucide-react';
import { authService, orderService, getCachedUserOrders } from '../../../services/authService';
import RatingBreakdownModal from '../../../components/RatingBreakdownModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const formatRawOrders = (rawList = []) => {
  return rawList.map(o => ({
    id: o.orderId || o._id,
    _id: o._id,
    date: o.createdAt 
      ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Recent',
    status: o.orderStatus || o.status || 'Placed',
    rejectionReason: o.rejectionReason || '',
    items: o.items || [],
    total: o.grandTotal || o.total || 0,
    itemCount: (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
    rawOrder: o,
  }));
};

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const [profileImage, setProfileImage] = useState(null);
  
  // Instant Initial State from Cache (0ms latency)
  const [orders, setOrders] = useState(() => {
    const cached = getCachedUserOrders();
    if (cached && Array.isArray(cached.orders) && cached.orders.length > 0) {
      return formatRawOrders(cached.orders);
    }
    return [];
  });
  const [loadingOrders, setLoadingOrders] = useState(() => {
    const cached = getCachedUserOrders();
    return !(cached && Array.isArray(cached.orders) && cached.orders.length > 0);
  });
  
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
  const [userProfile, setUserProfile] = useState(null);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    setUserName(getUserDisplayName());

    // Fetch user profile for rating stats
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        if (res && res.user) {
          setUserProfile(res.user);
          if (res.user.name) setUserName(res.user.name);
        }
      } catch (err) {
        console.warn('Failed to fetch profile in Profile.jsx:', err);
      }
    };
    fetchProfile();

    // Fetch user order history
    const fetchUserOrders = async () => {
      try {
        const res = await orderService.getOrders();
        if (res && res.success && Array.isArray(res.orders)) {
          setOrders(formatRawOrders(res.orders));
        }
      } catch (err) {
        console.error('Failed to fetch user order history on profile:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchUserOrders();
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
          {/* Rating Badge */}
          <button 
            onClick={() => setShowBreakdownModal(true)}
            className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full text-[12px] font-bold border border-white/30 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Star size={13} className="fill-amber-300 text-amber-300" />
            <span>
              {userProfile?.ratingCount > 0 
                ? `${Number(userProfile.ratingAverage || 5).toFixed(1)} ★ (${userProfile.ratingCount} ${userProfile.ratingCount === 1 ? 'ride' : 'rides'})` 
                : '★ New Rider'}
            </span>
            <ChevronRight size={12} className="opacity-80 ml-0.5" />
          </button>
        </div>

        {/* 4 Grid Actions Card */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <button className="flex items-center justify-between bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/orders')}>
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[#ea580c]" />
              <span className="text-[13px] font-bold text-[#1e1b4b]">Orders</span>
            </div>
            {orders.length > 0 && (
              <span className="text-[10px] font-extrabold bg-[#ea580c] text-white px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            )}
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/wishlist')}>
            <Heart size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">My Picks</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/cart')}>
            <Gift size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">Coupons</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 rounded-[12px] p-3 shadow-sm cursor-pointer hover:border-orange-100 transition-colors" onClick={() => navigate('/support')}>
            <Headphones size={18} className="text-[#ea580c]" />
            <span className="text-[13px] font-bold text-[#1e1b4b]">Help Center</span>
          </button>
        </div>

        {/* Order History Preview Card */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock size={15} className="text-[#ea580c]" />
              </div>
              <div>
                <h4 className="text-[13px] font-extrabold text-[#1e1b4b] tracking-tight m-0">Order History</h4>
                <span className="text-[10px] font-medium text-slate-400">Previous purchases & deliveries</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/order-history')} 
              className="text-[12px] font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
            >
              View All {orders.length > 0 && `(${orders.length})`} <ChevronRight size={14} />
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 size={22} className="animate-spin text-[#ea580c]" />
              <span className="text-[12px] font-medium">Loading order history...</span>
            </div>
          ) : orders.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {orders.slice(0, 3).map((order, idx) => {
                const statusColors = {
                  Placed: 'bg-orange-50 text-orange-600 border-orange-200',
                  Accepted: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  Processing: 'bg-amber-50 text-amber-600 border-amber-200',
                  'Out for Delivery': 'bg-blue-50 text-blue-600 border-blue-200',
                  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
                  Rejected: 'bg-rose-50 text-rose-600 border-rose-200',
                }[order.status] || 'bg-slate-50 text-slate-600 border-slate-200';

                const firstItem = order.items?.[0];
                const itemTitle = firstItem?.name || firstItem?.product?.name || `${order.itemCount} Items`;

                return (
                  <div 
                    key={order.id || idx}
                    onClick={() => navigate('/track-order', { state: { order } })}
                    className="p-3 rounded-[14px] bg-[#f8fafc] border border-slate-100 hover:border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[42px] h-[42px] rounded-[10px] bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {firstItem?.image || firstItem?.product?.mainImage ? (
                          <img 
                            src={firstItem?.image || firstItem?.product?.mainImage} 
                            alt="Product" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Package size={20} className="text-[#ea580c]" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{order.id}</span>
                        <span className="text-[11px] font-medium text-slate-500 truncate">{itemTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{order.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-[13px] font-extrabold text-slate-900">₹{order.total}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${statusColors}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {orders.length > 3 && (
                <button 
                  onClick={() => navigate('/order-history')}
                  className="w-full py-2 bg-orange-50/60 hover:bg-orange-100/60 text-[#ea580c] text-[12px] font-bold rounded-xl border border-orange-200/50 cursor-pointer transition-colors text-center"
                >
                  View All {orders.length} Orders
                </button>
              )}
            </div>
          ) : (
            <div className="py-5 px-3 bg-[#f8fafc] rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center">
              <Package size={28} className="text-slate-300 mb-1.5" />
              <p className="text-[12px] font-bold text-slate-700 m-0">No Order History Found</p>
              <p className="text-[11px] text-slate-400 m-0 mt-0.5">You haven't placed any orders yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-2.5 px-3.5 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold rounded-lg border-none cursor-pointer transition-colors shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Account Settings Section */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4">
          <h4 className="text-[12px] font-extrabold text-[#1e1b4b] uppercase tracking-wider mb-4">Account Settings</h4>
          
          <div className="flex flex-col gap-3">

            {/* Order History */}
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => navigate('/order-history')}
            >
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-[12px] bg-[#ffedd5] flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-[#ea580c]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#1e1b4b]">Order History</span>
                    {orders.length > 0 && (
                      <span className="text-[10px] font-bold bg-[#ea580c]/10 text-[#ea580c] px-2 py-0.2 rounded-full">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">View past orders & purchase history</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>

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
              onClick={() => navigate('/privacy')}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#1e1b4b]" />
                <span className="text-[14px] font-bold text-[#1e1b4b]">Privacy Policy</span>
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
        
        {/* Rating Breakdown Modal */}
        <RatingBreakdownModal
          isOpen={showBreakdownModal}
          onClose={() => setShowBreakdownModal(false)}
          targetId={userProfile?._id}
          targetType="user"
          targetName={userName}
        />
      </div>
    </div>
  );
};

export default Profile;
