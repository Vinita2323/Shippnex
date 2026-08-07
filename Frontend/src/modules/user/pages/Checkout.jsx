import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Check, Plus, Clock, ChevronRight, X, CreditCard, Wallet, Banknote, Building2, ShieldCheck, Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocationContext } from '../../../context/LocationContext';
import { addressService, orderService } from '../../../services/authService';

const availableSlots = [
  { id: 's1', date: 'Today', time: 'Express (Within 30 Mins)', badge: 'Fastest' },
  { id: 's2', date: 'Today', time: '05:00 PM - 07:00 PM' },
  { id: 's3', date: 'Tomorrow', time: '10:00 AM - 12:00 PM', isDefault: true },
  { id: 's4', date: 'Tomorrow', time: '04:00 PM - 06:00 PM' },
];

const paymentMethods = [
  { id: 'COD', name: 'Cash on Delivery', icon: Banknote, description: 'Pay cash upon delivery' },
  { id: 'UPI', name: 'UPI (GPay / PhonePe / Paytm)', icon: Wallet, description: 'Instant UPI payment' },
  { id: 'CARD', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'NETBANKING', name: 'Net Banking', icon: Building2, description: 'All major banks supported' },
  { id: 'WALLET', name: 'Mobile Wallets', icon: Wallet, description: 'Paytm Wallet, Mobikwik, etc.' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, originalTotal, cartCount, clearCart, fetchCart } = useCart();
  const { currentLocation } = useLocationContext();

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(availableSlots[2]);
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Modals & States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Profile Form State for incomplete profiles
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // New Address Form State
  const [newAddrForm, setNewAddrForm] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    country: 'India',
    addressType: 'Home',
  });

  // Load addresses from backend / localStorage
  const loadAddresses = async () => {
    const currentName = localStorage.getItem('shippnex_user_name') || '';
    const cleanCurrentName = currentName && currentName !== 'User' && currentName !== 'Customer' ? currentName : '';

    const normalizeAddress = (a) => {
      const isPlaceholder = !a.fullName || a.fullName === 'User' || a.fullName === 'Customer';
      return {
        ...a,
        fullName: isPlaceholder && cleanCurrentName ? cleanCurrentName : a.fullName || cleanCurrentName || 'Customer',
      };
    };

    let fetchedAddresses = [];
    try {
      const res = await addressService.getAddresses();
      if (res && res.success && res.addresses && res.addresses.length > 0) {
        fetchedAddresses = res.addresses.map(normalizeAddress);
      }
    } catch (err) {
      console.error('Failed to fetch addresses from backend:', err);
    }

    if (fetchedAddresses.length === 0) {
      const saved = localStorage.getItem('shippnex_saved_addresses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            fetchedAddresses = parsed.map(normalizeAddress);
          }
        } catch (err) {}
      }
    }

    if (fetchedAddresses.length > 0) {
      setAddresses(fetchedAddresses);

      // Check if there is an active selection in localStorage
      const savedSelStr = localStorage.getItem('shippnex_selected_checkout_address');
      if (savedSelStr) {
        try {
          const parsedSel = JSON.parse(savedSelStr);
          const found = fetchedAddresses.find(
            (a) =>
              (a._id && parsedSel._id && String(a._id) === String(parsedSel._id)) ||
              (a.id && parsedSel.id && String(a.id) === String(parsedSel.id)) ||
              ((a.addressLine1 || a.address) === (parsedSel.addressLine1 || parsedSel.address) &&
                (a.pincode || a.zip) === (parsedSel.pincode || parsedSel.zip))
          );
          if (found) {
            setSelectedAddress(found);
            return;
          }
        } catch (e) {}
      }

      const def = fetchedAddresses.find((a) => a.isDefault) || fetchedAddresses[0];
      setSelectedAddress(def);
      localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(def));
    }
  };

  useEffect(() => {
    const userDataStr = localStorage.getItem('shippnex_user_data');
    let name = localStorage.getItem('shippnex_user_name') || '';
    let phone = localStorage.getItem('shippnex_user_phone') || '';
    let email = localStorage.getItem('shippnex_user_email') || '';

    if (userDataStr) {
      try {
        const u = JSON.parse(userDataStr);
        if (!name && u.name) name = u.name;
        if (!phone && u.phone) phone = u.phone;
        if (!email && u.email) email = u.email;
      } catch (e) {}
    }

    setUserName(name);
    setUserPhone(phone);
    setProfileForm({
      fullName: name && name !== 'Customer' && name !== 'User' ? name : '',
      email: email || '',
      phone: phone || '',
    });
    setNewAddrForm((prev) => ({ ...prev, fullName: name, phone: phone }));

    // Check if profile is incomplete
    if (!name || name === 'Customer' || name === 'User' || name.trim() === '') {
      setIsProfileModalOpen(true);
    }

    loadAddresses();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.fullName || profileForm.fullName.trim().length < 2) {
      setErrorMsg('Please enter a valid Full Name to complete your profile.');
      return;
    }

    const cleanName = profileForm.fullName.trim();
    const cleanEmail = profileForm.email.trim();
    const cleanPhone = profileForm.phone.trim() || userPhone;

    localStorage.setItem('shippnex_user_name', cleanName);
    localStorage.setItem('shippnex_user_email', cleanEmail);
    localStorage.setItem('shippnex_user_phone', cleanPhone);

    const userDataStr = localStorage.getItem('shippnex_user_data');
    if (userDataStr) {
      try {
        const u = JSON.parse(userDataStr);
        u.name = cleanName;
        u.email = cleanEmail;
        u.phone = cleanPhone;
        localStorage.setItem('shippnex_user_data', JSON.stringify(u));
      } catch (err) {}
    }

    setUserName(cleanName);
    setUserPhone(cleanPhone);
    setNewAddrForm((prev) => ({ ...prev, fullName: cleanName, phone: cleanPhone }));

    if (selectedAddress) {
      const updatedSel = {
        ...selectedAddress,
        fullName: (!selectedAddress.fullName || selectedAddress.fullName === 'User' || selectedAddress.fullName === 'Customer') ? cleanName : selectedAddress.fullName,
        phone: selectedAddress.phone || cleanPhone,
      };
      setSelectedAddress(updatedSel);
      localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(updatedSel));
    }

    setAddresses((prevAddrs) =>
      prevAddrs.map((a) => ({
        ...a,
        fullName: (!a.fullName || a.fullName === 'User' || a.fullName === 'Customer') ? cleanName : a.fullName,
        phone: a.phone || cleanPhone,
      }))
    );

    setIsProfileModalOpen(false);
    setErrorMsg('');
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(addr));
    setIsAddressModalOpen(false);
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const cleanName = newAddrForm.fullName || userName || 'Customer';
      const cleanPhone = newAddrForm.phone || userPhone;
      const payload = {
        ...newAddrForm,
        fullName: cleanName,
        phone: cleanPhone,
        isDefault: true,
      };

      const res = await addressService.addAddress(payload);
      let created = payload;
      if (res && res.success) {
        if (res.address) created = res.address;
        else if (res.addresses && Array.isArray(res.addresses) && res.addresses.length > 0) {
          created = res.addresses[res.addresses.length - 1];
        }
      }

      // Automatically set newly created address as selected address for Checkout
      setSelectedAddress(created);
      localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(created));

      await loadAddresses();
      setIsNewAddressModalOpen(false);
    } catch (err) {
      console.error('Failed to create address via API:', err);
      const fallbackCreated = {
        ...newAddrForm,
        id: `local_addr_${Date.now()}`,
        fullName: newAddrForm.fullName || userName || 'Customer',
        phone: newAddrForm.phone || userPhone,
      };
      setSelectedAddress(fallbackCreated);
      localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(fallbackCreated));
      setIsNewAddressModalOpen(false);
    }
  };

  // Order Placement Action
  const handlePlaceOrder = async () => {
    setErrorMsg('');

    // Require complete profile before placing order
    if (!userName || userName === 'Customer' || userName === 'User' || userName.trim() === '') {
      setErrorMsg('Please complete your profile details before placing an order.');
      setIsProfileModalOpen(true);
      return;
    }
    if (!selectedAddress) {
      setErrorMsg('Please select or add a delivery address to proceed.');
      setIsAddressModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    try {
      setPlacingOrder(true);

      const userEmail = profileForm.email || localStorage.getItem('shippnex_user_email') || (selectedAddress && selectedAddress.email) || '';

      const orderPayload = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        items: cartItems.map((item) => ({
          product: item.productId || item.id || item._id,
          name: item.name,
          price: Number(item.price || 0),
          originalPrice: Number(item.originalPrice || item.mrp || item.price || 0),
          quantity: item.quantity,
          image: item.image || item.mainImage || '',
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName || selectedAddress.name || userName,
          phone: selectedAddress.phone || userPhone,
          altPhone: selectedAddress.altPhone || '',
          email: selectedAddress.email || userEmail,
          addressLine1: selectedAddress.addressLine1 || selectedAddress.address,
          addressLine2: selectedAddress.addressLine2 || '',
          landmark: selectedAddress.landmark || '',
          city: selectedAddress.city || 'Noida',
          state: selectedAddress.state || 'Uttar Pradesh',
          pincode: selectedAddress.pincode || selectedAddress.zip || '201301',
          country: selectedAddress.country || 'India',
          addressType: selectedAddress.addressType || selectedAddress.type || 'Home',
        },
        deliverySlot: {
          date: selectedSlot.date,
          time: selectedSlot.time,
        },
        deliveryInstructions,
        paymentMethod: selectedPayment,
      };

      const res = await orderService.placeOrder(orderPayload);
      if (res && res.success && res.order) {
        // Sync returned updated user document to localStorage
        if (res.user) {
          if (res.user.name) localStorage.setItem('shippnex_user_name', res.user.name);
          if (res.user.email) localStorage.setItem('shippnex_user_email', res.user.email);
          if (res.user.phone) localStorage.setItem('shippnex_user_phone', res.user.phone);
          localStorage.setItem('shippnex_user_data', JSON.stringify(res.user));
          if (res.user.addresses && Array.isArray(res.user.addresses)) {
            localStorage.setItem('shippnex_saved_addresses', JSON.stringify(res.user.addresses));
          }
        }
        setPlacedOrder(res.order);
        await clearCart();
      } else {
        setErrorMsg(res.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      setErrorMsg(err.response?.data?.message || 'Order placement failed. Please check stock and try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Calculation summaries
  const itemCount = cartCount || cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const safeTotal = cartTotal || 0;
  const deliveryCharge = safeTotal >= 500 || safeTotal === 0 ? 0 : 40;
  const savings = originalTotal > safeTotal ? originalTotal - safeTotal : 0;
  const finalGrandTotal = safeTotal + deliveryCharge;

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-3 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} color="white" />
        </button>
        <h2 className="text-[20px] font-semibold m-0 text-white text-center">Checkout</h2>
        <div className="w-[22px]"></div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden">
        
        {(!userName || userName === 'Customer' || userName === 'User') && (
          <div className="bg-orange-50 border border-orange-200 text-[#ea580c] px-4 py-3 rounded-xl text-[12px] font-bold flex items-center justify-between shadow-xs">
            <span>⚠️ Complete your profile details to place order.</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-[#ff5500] text-white border-none rounded-lg px-3 py-1.5 text-[11px] font-bold cursor-pointer hover:bg-[#e04b00] transition-colors"
            >
              Complete Now
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[12px] font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 1. Delivery Address Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin size={18} className="text-[#ff5500]" />
              <h3 className="text-[14px] font-bold text-slate-800 m-0">Delivery Address</h3>
            </div>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-transparent border-none text-[#ff5500] text-[12px] font-bold cursor-pointer p-0 hover:underline"
            >
              {selectedAddress ? 'Change' : '+ Select'}
            </button>
          </div>

          {selectedAddress ? (
            <div className="flex flex-col gap-1 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-900">
                  {(!selectedAddress.fullName || selectedAddress.fullName === 'User' || selectedAddress.fullName === 'Customer')
                    ? (userName && userName !== 'User' && userName !== 'Customer' ? userName : selectedAddress.fullName || 'Customer')
                    : selectedAddress.fullName}
                </span>
                <span className="bg-orange-50 text-[#ff5500] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200/60">
                  {selectedAddress.addressType || selectedAddress.type || 'Home'}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-600 m-0 mt-0.5">
                {selectedAddress.addressLine1 || selectedAddress.address}
                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                {selectedAddress.landmark && ` (Near ${selectedAddress.landmark})`}
                <br />
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode || selectedAddress.zip}
              </p>
              <p className="text-[11px] font-medium text-slate-500 m-0 mt-1">
                📞 {selectedAddress.phone || userPhone}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full py-3 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-[#ff5500] font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} /> Add Delivery Address
            </button>
          )}
        </div>

        {/* 3. Delivery Instructions (Optional) */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="text-[13px] font-bold text-slate-800 m-0 mb-2">Delivery Instructions (Optional)</h3>
          <input
            type="text"
            placeholder="e.g. Leave at gate, don't ring bell"
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-medium text-slate-800 outline-none focus:border-[#ff5500]"
          />
        </div>

        {/* 4. Payment Method Selection Section */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="text-[14px] font-bold text-slate-800 m-0 mb-3">Select Payment Method</h3>
          <div className="flex flex-col gap-2.5">
            {paymentMethods.map((pm) => {
              const IconComp = pm.icon;
              const isSelected = selectedPayment === pm.id;
              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#ff5500] bg-orange-50/40 ring-1 ring-[#ff5500]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#ff5500] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComp size={16} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 m-0">{pm.name}</h4>
                      <p className="text-[11px] text-slate-500 m-0">{pm.description}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#ff5500] bg-[#ff5500] text-white' : 'border-slate-300'}`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Order Summary Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="text-[14px] font-bold text-slate-800 m-0 mb-3">Order Summary</h3>

          {/* Cart Items List */}
          <div className="flex flex-col gap-2 mb-3 pb-3 border-b border-slate-100 max-h-[160px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {cartItems.map((item) => (
              <div key={item.id || item._id} className="flex justify-between items-center py-1">
                <span className="text-[12px] font-medium text-slate-700 truncate max-w-[200px]">
                  {item.name} <strong className="text-slate-900">x{item.quantity}</strong>
                </span>
                <span className="text-[12px] font-bold text-slate-900">
                  ₹{(Number(item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">Items Total ({itemCount} items)</span>
              <span className="text-[12px] font-semibold text-slate-900">₹{safeTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">Delivery Charges</span>
              {deliveryCharge === 0 ? (
                <span className="text-[12px] font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="text-[12px] font-bold text-slate-900">₹{deliveryCharge.toFixed(2)}</span>
              )}
            </div>
            {savings > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-slate-500">Total Savings</span>
                <span className="text-[12px] font-bold text-emerald-600">- ₹{savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-dashed border-slate-300">
              <span className="text-[14px] font-extrabold text-slate-900">Grand Total</span>
              <span className="text-[16px] font-extrabold text-slate-900">₹{finalGrandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Extra bottom padding to ensure Order Summary is fully visible above sticky footer */}
        <div className="h-[140px] shrink-0"></div>
      </div>

      {/* Sticky Place Order Footer */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-white border-t border-slate-200/80 z-[80] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Total Payable</span>
          <span className="text-[18px] font-extrabold text-slate-900">₹{finalGrandTotal.toFixed(2)}</span>
        </div>
        <button
          disabled={placingOrder}
          className="bg-[#ff5500] hover:bg-[#e04b00] disabled:opacity-60 text-white border-none rounded-xl py-3.5 px-7 text-[15px] font-bold cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.25)] transition-transform duration-200 active:scale-[0.98] flex items-center gap-2"
          onClick={handlePlaceOrder}
        >
          {placingOrder ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Placing Order...
            </>
          ) : (
            <>
              <span>Place Order</span>
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Complete Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-fade-in-up flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Complete Your Profile</h3>
              {userName && userName !== 'Customer' && userName !== 'User' && (
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-none cursor-pointer hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <p className="text-[12px] text-slate-500 font-medium mb-4">
              Please enter your full name and contact information to proceed with placing your order.
            </p>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={profileForm.phone || userPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5500] hover:bg-[#e04b00] text-white rounded-xl py-3.5 mt-2 font-bold text-[14px] cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.2)]"
              >
                Save Profile & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-fade-in-up flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Select Delivery Address</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-none cursor-pointer hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex flex-col gap-3 py-1 [&::-webkit-scrollbar]:hidden">
              {addresses.map((addr, idx) => {
                const isSelected = selectedAddress && (
                  (selectedAddress._id && addr._id && String(selectedAddress._id) === String(addr._id)) ||
                  (selectedAddress.id && addr.id && String(selectedAddress.id) === String(addr.id)) ||
                  ((selectedAddress.addressLine1 || selectedAddress.address) === (addr.addressLine1 || addr.address) &&
                   (selectedAddress.pincode || selectedAddress.zip) === (addr.pincode || addr.zip))
                );

                const displayName = (!addr.fullName || addr.fullName === 'User' || addr.fullName === 'Customer')
                  ? (userName && userName !== 'User' && userName !== 'Customer' ? userName : addr.fullName || 'Customer')
                  : addr.fullName;

                return (
                  <div
                    key={addr._id || addr.id || idx}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-[#ff5500] bg-orange-50/40 shadow-sm ring-1 ring-[#ff5500]' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${isSelected ? 'border-[#ff5500] bg-[#ff5500] text-white' : 'border-slate-300'}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-slate-900">{displayName}</span>
                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <span className="text-[9px] font-extrabold uppercase bg-[#ff5500] text-white px-2 py-0.5 rounded-md">
                              Selected
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {addr.addressType || addr.type || 'Home'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-snug m-0">
                        {addr.addressLine1 || addr.address}, {addr.city}, {addr.state} - {addr.pincode || addr.zip}
                      </p>
                      <p className="text-[11px] text-slate-400 m-0 mt-1">{addr.phone || userPhone}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsAddressModalOpen(false);
                setIsNewAddressModalOpen(true);
              }}
              className="mt-4 w-full py-3 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-[#ff5500] font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              <Plus size={16} /> Add New Address
            </button>
          </div>
        </div>
      )}

      {/* New Address Modal */}
      {isNewAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Add New Delivery Address</h3>
              <button
                onClick={() => setIsNewAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Address Tag</label>
                  <select
                    value={newAddrForm.addressType}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, addressType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-bold text-slate-800 outline-none"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={newAddrForm.fullName}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Street Address *</label>
                <input
                  required
                  type="text"
                  placeholder="Flat No, Building, Street"
                  value={newAddrForm.addressLine1}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, addressLine1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">City *</label>
                  <input
                    required
                    type="text"
                    placeholder="City"
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">State *</label>
                  <input
                    required
                    type="text"
                    placeholder="State"
                    value={newAddrForm.state}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Pincode *</label>
                  <input
                    required
                    type="text"
                    placeholder="Pincode"
                    value={newAddrForm.pincode}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    value={newAddrForm.phone}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[12px] font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5500] text-white rounded-xl py-3 mt-2 font-bold text-[14px] cursor-pointer"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center px-5 overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full max-w-[400px]">
            <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg mb-4">
              <Check size={40} color="white" strokeWidth={3.5} />
            </div>

            <h2 className="text-[20px] font-extrabold text-slate-900 mb-1 text-center">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-[12px] font-medium text-slate-500 mb-6 text-center">
              Thank you {placedOrder.shippingAddress?.fullName || userName}. Your order is confirmed.
            </p>

            <div className="w-full bg-white border border-slate-100 rounded-[16px] p-4 mb-6 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Order ID</span>
                <span className="text-[14px] font-extrabold text-slate-900">{placedOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Grand Total</span>
                <span className="text-[15px] font-extrabold text-slate-900">₹{placedOrder.grandTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Payment Mode</span>
                <span className="text-[12px] font-bold text-slate-800">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Delivery</span>
                <span className="text-[12px] font-bold text-emerald-600">{placedOrder.deliverySlot?.date} ({placedOrder.deliverySlot?.time})</span>
              </div>
            </div>

            <button
              className="w-full bg-[#0f172a] text-white border-none rounded-xl py-3.5 text-[14px] font-bold cursor-pointer mb-3"
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </button>
            <button
              className="bg-transparent border-none text-[#ff5500] text-[13px] font-semibold cursor-pointer py-2"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
