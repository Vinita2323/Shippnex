import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Navigation, Check, Plus, Home as HomeIcon, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocationContext } from '../../../context/LocationContext';
import { addressService } from '../../../services/authService';

const LocationSelectionPage = () => {
  const navigate = useNavigate();
  const { setLocation, currentLocation } = useLocationContext();

  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual Detailed Address Form State
  const [manualForm, setManualForm] = useState({
    addressType: 'Home',
    addressLine1: '',
    landmark: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressService.getAddresses();
        if (res && res.success && res.addresses && res.addresses.length > 0) {
          setSavedAddresses(res.addresses);
          return;
        }
      } catch (err) {}

      const saved = localStorage.getItem('shippnex_saved_addresses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSavedAddresses(parsed);
        } catch (e) {}
      }
    };
    fetchAddresses();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || 'Noida';
            const area = data.address.suburb || data.address.neighbourhood || data.address.road || city;
            const locObj = {
              lat,
              lng,
              city,
              area,
              addressLine1: `${area}, ${city}`,
              addressType: 'GPS',
            };
            setLocation(locObj);
            setIsLocating(false);
            navigate(-1);
            return;
          }
        } catch (e) {}

        const fallbackLoc = {
          lat,
          lng,
          city: 'Noida',
          area: 'Current Location',
          addressLine1: 'Current GPS Location',
          addressType: 'GPS',
        };
        setLocation(fallbackLoc);
        setIsLocating(false);
        navigate(-1);
      },
      (err) => {
        setIsLocating(false);
        setError('Failed to detect GPS location. Please enter location manually below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectSavedAddress = (addr) => {
    const savedName = localStorage.getItem('shippnex_user_name');
    const cleanFullName = (!addr.fullName || addr.fullName === 'User' || addr.fullName === 'Customer')
      ? (savedName && savedName !== 'User' && savedName !== 'Customer' ? savedName : 'Customer')
      : addr.fullName;

    const locObj = {
      addressType: addr.addressType || addr.type || 'HOME',
      addressLine1: addr.addressLine1 || addr.address,
      city: addr.city || 'Noida',
      state: addr.state || 'Uttar Pradesh',
      pincode: addr.pincode || addr.zip || '201301',
      fullName: cleanFullName,
      phone: addr.phone || localStorage.getItem('shippnex_user_phone') || '',
    };
    setLocation(locObj);
    localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify({ ...addr, fullName: cleanFullName }));
    navigate(-1);
  };

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim();
    const locObj = {
      addressType: 'LOCATION',
      addressLine1: clean,
      area: clean,
      city: 'Noida',
    };
    setLocation(locObj);
    navigate(-1);
  };

  const handleManualFormSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.addressLine1.trim()) {
      setError('Please enter street address / house number');
      return;
    }

    const cleanLine1 = manualForm.addressLine1.trim();
    const cleanLandmark = manualForm.landmark.trim();
    const cleanCity = manualForm.city.trim() || 'Noida';
    const cleanState = manualForm.state.trim() || 'Uttar Pradesh';
    const cleanPincode = manualForm.pincode.trim() || '201301';

    const locObj = {
      addressType: manualForm.addressType,
      addressLine1: cleanLine1,
      landmark: cleanLandmark,
      city: cleanCity,
      state: cleanState,
      pincode: cleanPincode,
      area: `${cleanLine1}, ${cleanCity}`,
    };

    setLocation(locObj);

    // Save to user address list if logged in
    try {
      await addressService.addAddress({
        addressType: manualForm.addressType,
        fullName: manualForm.fullName || localStorage.getItem('shippnex_user_name') || 'Customer',
        phone: manualForm.phone || localStorage.getItem('shippnex_user_phone') || '',
        addressLine1: cleanLine1,
        landmark: cleanLandmark,
        city: cleanCity,
        state: cleanState,
        pincode: cleanPincode,
        country: 'India',
      });
    } catch (err) {}

    navigate(-1);
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans max-w-[480px] mx-auto relative flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-xs z-10 shrink-0 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer">
          <ArrowLeft size={22} className="text-slate-800" />
        </button>
        <h1 className="text-[17px] font-extrabold text-slate-900 m-0">Select Delivery Location</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden pb-10">
        {/* GPS Location Button */}
        <button 
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-slate-100 hover:border-[#ea580c] cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
            {isLocating ? (
              <div className="w-5 h-5 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Navigation size={20} className="text-[#ea580c]" />
            )}
          </div>
          <div className="text-left flex-1">
            <h3 className="text-[14px] font-bold text-slate-900 m-0">Use current location</h3>
            <p className="text-[12px] font-medium text-slate-500 m-0 mt-0.5">Detect using GPS</p>
          </div>
        </button>

        {error && <p className="text-red-500 text-xs font-semibold text-center m-0 bg-red-50 py-2 px-3 rounded-xl border border-red-200">{error}</p>}

        {/* Quick Search Location */}
        <form onSubmit={handleQuickSearchSubmit} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <h3 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">Quick Search Location</h3>
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Enter area, landmark or street name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-20 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute right-2 bg-[#ea580c] disabled:opacity-50 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold border-none cursor-pointer"
            >
              Select
            </button>
          </div>
        </form>

        {/* Enter Detailed Manual Location Form Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <div 
            onClick={() => setShowManualForm(!showManualForm)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100/60 text-[#ea580c] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-slate-900 m-0">Enter Location Manually</h3>
                <p className="text-[11px] text-slate-500 font-medium m-0">Fill flat no, street, city & pincode</p>
              </div>
            </div>
            <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1">
              {showManualForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showManualForm && (
            <form onSubmit={handleManualFormSubmit} className="p-4 pt-0 flex flex-col gap-3 border-t border-slate-100 mt-1">
              
              {/* Address Type Tag Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setManualForm({ ...manualForm, addressType: type })}
                      className={`flex-1 py-2 px-3 rounded-xl border text-[12px] font-bold cursor-pointer transition-all ${
                        manualForm.addressType === type
                          ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat / Street Address */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Flat / House No / Street Address *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Flat 302, Palm Grove Apartment, Sector 45"
                  value={manualForm.addressLine1}
                  onChange={(e) => setManualForm({ ...manualForm, addressLine1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[12px] font-semibold text-slate-800 outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near City Hospital"
                  value={manualForm.landmark}
                  onChange={(e) => setManualForm({ ...manualForm, landmark: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[12px] font-semibold text-slate-800 outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">City *</label>
                  <input
                    required
                    type="text"
                    placeholder="City"
                    value={manualForm.city}
                    onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[12px] font-semibold text-slate-800 outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">State *</label>
                  <input
                    required
                    type="text"
                    placeholder="State"
                    value={manualForm.state}
                    onChange={(e) => setManualForm({ ...manualForm, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[12px] font-semibold text-slate-800 outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Pincode *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 201301"
                  value={manualForm.pincode}
                  onChange={(e) => setManualForm({ ...manualForm, pincode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[12px] font-semibold text-slate-800 outline-none focus:border-[#ea580c]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#d97706] text-white rounded-xl py-3 mt-1 font-bold text-[14px] cursor-pointer shadow-[0_4px_12px_rgba(234,88,12,0.25)] border-none transition-all active:scale-[0.98]"
              >
                Save & Set Delivery Location
              </button>
            </form>
          )}
        </div>

        {/* Saved Addresses List */}
        {savedAddresses.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
            <h3 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-wider m-0">Saved Addresses</h3>
            <div className="flex flex-col gap-2">
              {savedAddresses.map((addr, idx) => {
                const tag = addr.addressType || addr.type || 'HOME';
                const isSelected = currentLocation && (currentLocation.addressLine1 === (addr.addressLine1 || addr.address));
                return (
                  <div
                    key={addr._id || addr.id || idx}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected ? 'border-[#ea580c] bg-orange-50/40 ring-1 ring-[#ea580c]' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-600">
                      {tag.toUpperCase() === 'HOME' ? <HomeIcon size={16} /> : <Briefcase size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-slate-900">
                          {(!addr.fullName || addr.fullName === 'User' || addr.fullName === 'Customer')
                            ? (localStorage.getItem('shippnex_user_name') && localStorage.getItem('shippnex_user_name') !== 'User' && localStorage.getItem('shippnex_user_name') !== 'Customer' ? localStorage.getItem('shippnex_user_name') : tag)
                            : addr.fullName}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-snug m-0 mt-0.5">
                        {addr.addressLine1 || addr.address}, {addr.city}
                      </p>
                    </div>
                    {isSelected && <Check size={16} className="text-[#ea580c] shrink-0 mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelectionPage;
