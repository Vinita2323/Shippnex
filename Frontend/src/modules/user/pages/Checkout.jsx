import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, Plus, Clock, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocationContext } from '../../../context/LocationContext';

const defaultSavedAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'Sarah Jenkins',
    address: '123, Palm Grove Apartment, Sector 45',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zip: '201301',
    phone: '+91 98765 43210',
    isDefault: true
  },
  {
    id: 2,
    type: 'Work',
    name: 'Sarah Jenkins',
    address: 'Tech Park, Building 5, 8th Floor',
    city: 'Gurugram',
    state: 'Haryana',
    zip: '122001',
    phone: '+91 98765 43210',
    isDefault: false
  }
];

const availableSlots = [
  { id: 's1', date: 'Today', time: 'Express (Within 30 Mins)', badge: 'Fastest' },
  { id: 's2', date: 'Today', time: '05:00 PM - 07:00 PM' },
  { id: 's3', date: 'Tomorrow', time: '10:00 AM - 12:00 PM', isDefault: true },
  { id: 's4', date: 'Tomorrow', time: '04:00 PM - 06:00 PM' }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, originalTotal, cartCount } = useCart();
  const { currentLocation } = useLocationContext();

  // Dynamic User Details
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(availableSlots[2]);

  // Modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch User details from local storage or defaults
    const name = localStorage.getItem('shippnex_user_name') || 'Sarah Jenkins';
    const phone = localStorage.getItem('shippnex_user_phone') || '+91 98765 43210';
    setUserName(name);
    setUserPhone(phone);

    // 2. Fetch saved addresses or initialize defaults
    const saved = localStorage.getItem('shippnex_saved_addresses');
    let addrList = defaultSavedAddresses;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          addrList = parsed;
        }
      } catch (err) {
        console.error('Error parsing saved addresses:', err);
      }
    }
    setAddresses(addrList);

    // 3. Set selected address from locationContext or default address
    const storedSelected = localStorage.getItem('shippnex_selected_checkout_address');
    if (storedSelected) {
      try {
        setSelectedAddress(JSON.parse(storedSelected));
      } catch (err) {
        setSelectedAddress(addrList[0]);
      }
    } else if (currentLocation && currentLocation.address) {
      setSelectedAddress({
        id: 'loc_current',
        type: 'Current Location',
        name: name,
        address: currentLocation.address || currentLocation.formattedAddress,
        city: currentLocation.city || 'Noida',
        state: currentLocation.state || 'Uttar Pradesh',
        zip: currentLocation.zip || '201301',
        phone: phone
      });
    } else {
      const def = addrList.find(a => a.isDefault) || addrList[0];
      setSelectedAddress({
        ...def,
        name: name,
        phone: phone
      });
    }
  }, [currentLocation]);

  const handleSelectAddress = (addr) => {
    const updatedAddr = { ...addr, name: userName || addr.name, phone: userPhone || addr.phone };
    setSelectedAddress(updatedAddr);
    localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(updatedAddr));
    setIsAddressModalOpen(false);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setIsSlotModalOpen(false);
  };

  // Calculations
  const itemCount = cartCount || (cartItems ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) : 4);
  const totalAmount = cartTotal > 0 ? cartTotal : 490;
  const savings = originalTotal > totalAmount ? (originalTotal - totalAmount) : 60;
  const deliveryCharge = totalAmount > 200 ? 0 : 30;
  const finalGrandTotal = totalAmount + deliveryCharge;

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

      {/* Progress Stepper */}
      <div className="flex items-center justify-center py-4 px-5 pb-6 bg-white shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#ff5500] text-white flex items-center justify-center text-[12px] font-bold">1</div>
          <span className="text-[12px] font-bold text-slate-900">Address</span>
        </div>
        <div className="h-px w-[30px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[12px] font-bold">2</div>
          <span className="text-[12px] font-semibold text-slate-500">Payment</span>
        </div>
        <div className="h-px w-[30px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[12px] font-bold">3</div>
          <span className="text-[12px] font-semibold text-slate-500">Confirm</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden">
        {/* Delivery Address Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-[#ff5500]" />
              <h3 className="text-[13px] font-bold text-slate-800 m-0">Delivery Address</h3>
            </div>
            <button 
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer p-0 hover:underline"
            >
              Change
            </button>
          </div>
          
          {selectedAddress ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="text-[14px] font-bold text-slate-900 m-0">{selectedAddress.name || userName}</h4>
                {selectedAddress.type && (
                  <span className="bg-orange-50 text-[#ff5500] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200/60">
                    {selectedAddress.type}
                  </span>
                )}
              </div>
              <p className="text-[12px] leading-relaxed text-slate-600 m-0 mt-0.5">
                {selectedAddress.address}
                {selectedAddress.city && `, ${selectedAddress.city}`}
                {selectedAddress.state && `, ${selectedAddress.state}`}
                {selectedAddress.zip && ` - ${selectedAddress.zip}`}
              </p>
              <p className="text-[12px] font-medium text-slate-500 m-0 mt-1">{selectedAddress.phone || userPhone}</p>
            </div>
          ) : (
            <div className="text-[12px] text-slate-500 py-2">Loading delivery address...</div>
          )}
        </div>

        {/* Delivery Slot Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-600" />
              <h3 className="text-[13px] font-bold text-slate-800 m-0">Delivery Slot</h3>
            </div>
            <button 
              onClick={() => setIsSlotModalOpen(true)}
              className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer p-0 hover:underline"
            >
              Change
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-[13px] font-bold text-slate-900 m-0">{selectedSlot.date}</h4>
              {selectedSlot.badge && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  {selectedSlot.badge}
                </span>
              )}
            </div>
            <p className="text-[12px] font-semibold text-emerald-700 m-0">{selectedSlot.time}</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-bold text-slate-800 m-0">Order Summary</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              <span className="text-[12px] font-semibold text-slate-900">₹{totalAmount.toFixed(2)}</span>
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
                <span className="text-[12px] font-medium text-slate-500">You Saved</span>
                <span className="text-[12px] font-bold text-emerald-600">- ₹{savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-1 pt-4 border-t border-dashed border-slate-200">
              <span className="text-[14px] font-extrabold text-slate-900">Grand Total</span>
              <span className="text-[16px] font-extrabold text-slate-900">₹{finalGrandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="h-[90px]"></div>
      </div>

      {/* Checkout Action Button */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-5 pb-6 bg-gradient-to-t from-white via-white/90 to-transparent z-[80]">
        <button 
          className="w-full bg-[#ff5500] hover:bg-[#e04b00] text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.25)] transition-transform duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => navigate('/payment')}
        >
          <span>Continue to Payment</span>
          <ChevronRight size={18} />
        </button>
      </div>

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
              {addresses.map((addr) => {
                const isSelected = selectedAddress && selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-[#ff5500] bg-orange-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                      isSelected ? 'border-[#ff5500] bg-[#ff5500] text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-slate-900">{addr.name || userName}</span>
                        <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-snug m-0">
                        {addr.address}, {addr.city}, {addr.state} - {addr.zip}
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
                navigate('/saved-addresses');
              }}
              className="mt-4 w-full py-3 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-[#ff5500] font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              <Plus size={16} /> Add / Manage Addresses
            </button>
          </div>
        </div>
      )}

      {/* Slot Selection Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-[480px] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-fade-in-up flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 m-0">Select Delivery Slot</h3>
              <button 
                onClick={() => setIsSlotModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border-none cursor-pointer hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 py-1">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot.id === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">{slot.date}</span>
                          {slot.badge && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              {slot.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-emerald-700 font-medium m-0">{slot.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
