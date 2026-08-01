import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { useLocation } from '../../../hooks/useLocation';

const CaptainDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [activeDay, setActiveDay] = useState('Sun');
  const { requestLocation } = useLocation();

  // Location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMode, setLocationMode] = useState(null); // 'auto' | 'manual'
  const [manualAddress, setManualAddress] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [savedLocation, setSavedLocation] = useState(null);
  const manualInputRef = useRef(null);

  useEffect(() => {
    let watchId;
    if (isOnline && navigator.geolocation) {
      // Start tracking
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          console.log("Captain location updated: ", coords);
          // In a real app, send `coords` to PUT /api/captain/location here
        },
        (error) => {
          console.error("Error watching position", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else if (!isOnline && watchId) {
       navigator.geolocation.clearWatch(watchId);
    }
    
    return () => {
       if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  // Auto-detect location handler
  const handleAutoDetect = () => {
    setLocationMode('auto');
    setLocationError('');
    setDetectingLocation(true);
    setDetectedLocation(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setDetectingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setDetectedLocation({ lat: latitude, lng: longitude, address });
        } catch {
          setDetectedLocation({ lat: latitude, lng: longitude, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` });
        }
        setDetectingLocation(false);
      },
      (err) => {
        setLocationError('Unable to retrieve your location. Please allow location access.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveLocation = () => {
    if (locationMode === 'auto' && detectedLocation) {
      setSavedLocation(detectedLocation.address);
      setShowLocationModal(false);
    } else if (locationMode === 'manual' && manualAddress.trim()) {
      setSavedLocation(manualAddress.trim());
      setShowLocationModal(false);
    }
  };

  const openLocationModal = () => {
    setShowLocationModal(true);
    setLocationMode(null);
    setDetectedLocation(null);
    setDetectingLocation(false);
    setLocationError('');
    setManualAddress('');
  };

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
          <img src="/DeliveryLogo.png" alt="Delivery Logo" className="h-12 object-contain" />
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
          {/* Location Icon Button */}
          <button
            onClick={openLocationModal}
            title={savedLocation || 'Set Location'}
            className="relative p-1.5 text-on-surface-variant hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: savedLocation ? 'var(--md-sys-color-secondary)' : undefined }}>location_on</span>
            {savedLocation && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-secondary rounded-full border border-white"></span>
            )}
          </button>

          <button
            onClick={() => navigate('/captain/notifications')}
            className="relative p-1.5 text-on-surface-variant hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLocationModal(false); }}
        >
          <div
            className="w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 pb-8 sm:pb-5"
            style={{ animation: 'slideUpModal 0.28s cubic-bezier(.4,0,.2,1)' }}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4 sm:hidden"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-base">location_on</span>
                </div>
                <h3 className="font-bold text-sm text-primary">Set Your Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Two Option Cards */}
            <div className="space-y-3 mb-4">
              {/* Auto Detect */}
              <button
                onClick={handleAutoDetect}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  locationMode === 'auto'
                    ? 'border-secondary bg-secondary-container/30'
                    : 'border-outline-variant/30 bg-surface-container-low hover:border-secondary/50 hover:bg-secondary-container/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-xl">my_location</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-primary">All Location Automatically</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Use GPS to detect your current location</p>
                  {locationMode === 'auto' && detectingLocation && (
                    <p className="text-[10px] text-secondary mt-1 font-semibold animate-pulse">Detecting location…</p>
                  )}
                  {locationMode === 'auto' && detectedLocation && !detectingLocation && (
                    <p className="text-[10px] text-secondary mt-1 font-semibold truncate">📍 {detectedLocation.address}</p>
                  )}
                  {locationMode === 'auto' && locationError && (
                    <p className="text-[10px] text-error mt-1">{locationError}</p>
                  )}
                </div>
                {locationMode === 'auto' && !detectingLocation && !locationError && (
                  <span className="material-symbols-outlined text-secondary text-base shrink-0">check_circle</span>
                )}
              </button>

              {/* Manual Entry */}
              <button
                onClick={() => {
                  setLocationMode('manual');
                  setLocationError('');
                  setTimeout(() => manualInputRef.current?.focus(), 100);
                }}
                className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  locationMode === 'manual'
                    ? 'border-secondary bg-secondary-container/30'
                    : 'border-outline-variant/30 bg-surface-container-low hover:border-secondary/50 hover:bg-secondary-container/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">edit_location_alt</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-primary">Enter Location Manually</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Type your address or landmark</p>
                  {locationMode === 'manual' && (
                    <input
                      ref={manualInputRef}
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="e.g. MG Road, Bangalore…"
                      className="mt-2 w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-[11px] text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors"
                    />
                  )}
                </div>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveLocation}
              disabled={
                !locationMode ||
                (locationMode === 'auto' && (!detectedLocation || detectingLocation)) ||
                (locationMode === 'manual' && !manualAddress.trim())
              }
              className="w-full py-3 bg-secondary text-white font-bold text-sm rounded-xl transition-all hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm Location
            </button>
          </div>

          <style>{`
            @keyframes slideUpModal {
              from { transform: translateY(40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Main Container - Added comfortable top padding & margin */}
      <main className="pt-24 md:pt-28 px-3.5 max-w-7xl mx-auto space-y-3.5 mt-4">
        {/* 4 Metric Cards Grid Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Today's Earning */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Today's Earning</p>
            <div className="flex items-baseline gap-0.5 mt-1.5">
              <span className="text-secondary font-semibold text-xs">₹</span>
              <span className="text-primary font-bold text-base md:text-lg leading-none">4,825.00</span>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Total Bookings</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-primary font-bold text-base md:text-lg leading-none">24</span>
              <span className="text-on-surface-variant font-medium text-[10px]">Bookings</span>
            </div>
          </div>

          {/* Deliveries */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Deliveries</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-primary font-bold text-base md:text-lg leading-none">14</span>
              <span className="text-on-surface-variant font-medium text-[10px]">/18</span>
            </div>
          </div>

          {/* Pending */}
          <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
            <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Pending</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-primary font-bold text-base md:text-lg leading-none">03</span>
              <span className="text-on-surface-variant font-medium text-[10px]">Tasks</span>
            </div>
          </div>
        </section>

        {/* Active Service Areas */}
        <section
          onClick={() => navigate('/captain/service-areas')}
          className="glass-panel rounded-2xl p-4 flex items-center gap-4 border border-white/60 cursor-pointer hover:shadow-md hover:border-secondary/40 transition-all active:scale-[0.98]"
        >
          {/* Icon */}
          <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(var(--md-sys-color-secondary-rgb, 56,142,60), 0.12)' }}>
            <span className="material-symbols-outlined text-secondary text-2xl">location_on</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-primary leading-tight">Active Service Areas</p>
            {savedLocation ? (
              <p className="text-[11px] text-secondary font-semibold mt-0.5 leading-snug truncate flex items-center gap-1">
                <span>📍 {savedLocation}</span>
              </p>
            ) : (
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                You are currently in <span className="font-semibold text-primary">10</span> seller radius
              </p>
            )}
          </div>

          {/* Count badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse inline-block"></span>
            <span className="text-xl font-extrabold text-secondary leading-none">10</span>
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
                onClick={() => navigate('/captain/active-delivery')}
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
              onClick={() => navigate('/captain/jobs')}
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
                  onClick={() => navigate('/captain/active-delivery')}
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

      {/* Captain Bottom Navigation */}
      <CaptainBottomNav />
    </div>
  );
};

export default CaptainDashboard;
