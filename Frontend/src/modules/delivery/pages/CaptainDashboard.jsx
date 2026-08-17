import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService } from '../../../services/authService';

const CaptainDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('shippnex_captain_online');
    return saved !== null ? saved === 'true' : true;
  });
  const [activeDay, setActiveDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalBookings: 0,
    deliveredToday: 0,
    pendingCount: 0,
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);

  // Incoming Order Modal state
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dismissedOrderIds, setDismissedOrderIds] = useState(new Set());

  // Location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMode, setLocationMode] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [savedLocation, setSavedLocation] = useState(null);
  const manualInputRef = useRef(null);
  const watchIdRef = useRef(null);

  // ── Fetch Dashboard Stats ──────────────────────────────────────
  const fetchDashboard = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await captainService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        const orders = res.pendingOrders || [];
        setPendingOrders(orders);

        const wData = res.weeklyEarnings || [];
        const maxVal = Math.max(...wData.map(d => d.value), 1);
        setWeeklyEarnings(wData.map((d, i) => ({
          ...d,
          height: `${Math.max(Math.round((d.value / maxVal) * 95), 5)}%`,
          current: i === wData.length - 1,
        })));
        if (res.stats.isOnline !== undefined) {
          setIsOnline(res.stats.isOnline);
          localStorage.setItem('shippnex_captain_online', String(res.stats.isOnline));
        }

        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        setActiveDay(days[today.getDay()]);


        // Auto-popup modal for newly assigned orders
        const newAssignedOrder = orders.find(
          (o) => o.captainStatus === 'Assigned' && !dismissedOrderIds.has(o._id) && !dismissedOrderIds.has(o.orderId)
        );
        if (newAssignedOrder && !incomingOrder) {
          setIncomingOrder(newAssignedOrder);
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [dismissedOrderIds, incomingOrder]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Polling every 7 seconds when online to catch new orders immediately
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 7000);
    return () => clearInterval(interval);
  }, [isOnline, fetchDashboard]);

  // ── Live Location Tracking ──────────────────────────────────────
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await captainService.updateLocation(latitude, longitude);
          } catch (e) {
            // Silent fail
          }
        },
        (error) => console.error('Geolocation watch error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isOnline]);

  // ── Online Toggle ──────────────────────────────────────────────
  const handleOnlineToggle = async (e) => {
    const newStatus = e.target.checked;
    setIsOnline(newStatus);
    localStorage.setItem('shippnex_captain_online', String(newStatus));
    try {
      await captainService.updateOnlineStatus(newStatus);
      fetchDashboard(true);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // ── Accept / Reject Order Actions ──────────────────────────────
  const handleAcceptIncomingOrder = async (order) => {
    if (!order) return;
    setActionLoading(true);
    try {
      const orderIdentifier = order.orderId || order._id;
      await captainService.acceptJob(orderIdentifier);
      setIncomingOrder(null);
      await fetchDashboard(true);
      // Navigate straight to active delivery
      navigate('/captain/active-delivery');
    } catch (err) {
      console.error('Accept job error:', err);
      alert(err?.response?.data?.message || 'Failed to accept order. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectIncomingOrder = async (order) => {
    if (!order) return;
    setActionLoading(true);
    try {
      const orderIdentifier = order.orderId || order._id;
      await captainService.rejectJob(orderIdentifier);
      setDismissedOrderIds(prev => new Set([...prev, order._id, order.orderId]));
      setIncomingOrder(null);
      await fetchDashboard(true);
    } catch (err) {
      console.error('Reject job error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismissModal = (order) => {
    if (order) {
      setDismissedOrderIds(prev => new Set([...prev, order._id, order.orderId]));
    }
    setIncomingOrder(null);
  };

  // ── Location Modal ─────────────────────────────────────────────
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
      () => {
        setLocationError('Unable to retrieve your location. Please allow location access.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveLocation = async () => {
    if (locationMode === 'auto' && detectedLocation) {
      setSavedLocation(detectedLocation.address);
      try {
        await captainService.updateLocation(detectedLocation.lat, detectedLocation.lng);
      } catch (e) {}
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

  // ── Status badge color helper ───────────────────────────────────
  const getStatusBadge = (status) => {
    const map = {
      'In Transit': 'bg-[#ff6000]/15 text-[#ff6000]',
      'Picked Up': 'bg-amber-100 text-amber-800',
      'Accepted': 'bg-blue-100 text-blue-800',
      'Assigned': 'bg-purple-100 text-purple-800 animate-pulse',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Compact TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-2.5 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <img src="/DeliveryLogo.png" alt="Delivery Logo" className="h-12 object-contain" />
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={handleOnlineToggle}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            <span className={`ms-1.5 font-label-sm text-[10px] font-bold tracking-wider ${isOnline ? 'text-secondary' : 'text-on-surface-variant'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </label>

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
            {stats.pendingCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 🚨 INCOMING ORDER MODAL POPUP (COMPACT & SLEEK)           */}
      {/* ────────────────────────────────────────────────────────── */}
      {incomingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            style={{ animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Slim Header */}
            <div className="bg-gradient-to-r from-[#002625] to-[#0a3d16] px-3.5 py-2.5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#97fc43] text-[#002625] flex items-center justify-center font-black shrink-0">
                  <span className="material-symbols-outlined text-base font-bold">local_shipping</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#97fc43]/20 text-[#97fc43] text-[8px] font-black uppercase px-1.5 py-0.2 rounded border border-[#97fc43]/40 tracking-wider">
                      NEW ORDER
                    </span>
                    <span className="text-[11px] font-mono font-bold text-white">#{incomingOrder.orderId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDismissModal(incomingOrder)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Compact Body */}
            <div className="p-3 space-y-2 text-xs">
              {/* Payout & Time Row */}
              <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">Estimated Payout</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold text-emerald-700">₹</span>
                    <span className="text-2xl font-black text-[#15803d] leading-none">
                      {(incomingOrder.captainEarnings || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                    {incomingOrder.deliverySlot?.time || 'Express Delivery'}
                  </span>
                  <span className="text-[8.5px] text-emerald-600 font-semibold mt-0.5 block">Instant Credit</span>
                </div>
              </div>

              {/* Compact Route Box */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2">
                {/* Pickup */}
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-sm mt-0.5 shrink-0">storefront</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block">PICKUP</span>
                    <p className="font-bold text-[11px] text-slate-900 leading-tight truncate">
                      {incomingOrder.items?.[0]?.seller || 'Seller Store'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50"></div>

                {/* Drop-off */}
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5 shrink-0 font-bold">location_on</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[8.5px] font-black text-emerald-700 uppercase tracking-wider block">DROP-OFF</span>
                    <p className="font-bold text-[11px] text-slate-900 leading-tight truncate">
                      {incomingOrder.shippingAddress?.fullName || incomingOrder.user?.name || 'Customer'}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                      {incomingOrder.shippingAddress?.addressLine1}, {incomingOrder.shippingAddress?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Items / Payment Strip */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 min-w-0 flex-1 pr-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm shrink-0">inventory_2</span>
                  <span className="font-semibold text-slate-800 truncate">
                    {incomingOrder.items?.[0]?.name || 'Package'}{incomingOrder.items?.length > 1 ? ` +${incomingOrder.items.length - 1} more` : ''}
                  </span>
                  <span className="font-bold text-slate-500 shrink-0">x{incomingOrder.items?.[0]?.quantity || 1}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700 shrink-0">
                  {incomingOrder.paymentMethod || 'COD'}
                </span>
              </div>
            </div>

            {/* Action Buttons: Compact Accept & Reject */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleRejectIncomingOrder(incomingOrder)}
                disabled={actionLoading}
                className="py-2.5 px-3 rounded-xl border border-red-200 bg-white text-red-600 font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Reject
              </button>

              <button
                onClick={() => handleAcceptIncomingOrder(incomingOrder)}
                disabled={actionLoading}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#366b00] hover:bg-[#2d5800] text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60"
              >
                {actionLoading ? (
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                )}
                {actionLoading ? 'Accepting…' : 'Accept Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container text-base">location_on</span>
                </div>
                <h3 className="font-bold text-sm text-primary">Set Your Location</h3>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <button
                onClick={handleAutoDetect}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${locationMode === 'auto' ? 'border-secondary bg-secondary-container/30' : 'border-outline-variant/30 bg-surface-container-low hover:border-secondary/50 hover:bg-secondary-container/10'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-xl">my_location</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-primary">Detect Location Automatically</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Use GPS to detect your current location</p>
                  {locationMode === 'auto' && detectingLocation && <p className="text-[10px] text-secondary mt-1 font-semibold animate-pulse">Detecting location…</p>}
                  {locationMode === 'auto' && detectedLocation && !detectingLocation && <p className="text-[10px] text-secondary mt-1 font-semibold truncate">📍 {detectedLocation.address}</p>}
                  {locationMode === 'auto' && locationError && <p className="text-[10px] text-error mt-1">{locationError}</p>}
                </div>
                {locationMode === 'auto' && !detectingLocation && !locationError && <span className="material-symbols-outlined text-secondary text-base shrink-0">check_circle</span>}
              </button>

              <button
                onClick={() => { setLocationMode('manual'); setLocationError(''); setTimeout(() => manualInputRef.current?.focus(), 100); }}
                className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${locationMode === 'manual' ? 'border-secondary bg-secondary-container/30' : 'border-outline-variant/30 bg-surface-container-low hover:border-secondary/50 hover:bg-secondary-container/10'}`}
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

            <button
              onClick={handleSaveLocation}
              disabled={!locationMode || (locationMode === 'auto' && (!detectedLocation || detectingLocation)) || (locationMode === 'manual' && !manualAddress.trim())}
              className="w-full py-3 bg-secondary text-white font-bold text-sm rounded-xl transition-all hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="pt-24 md:pt-28 px-3.5 max-w-7xl mx-auto space-y-3.5 mt-4">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-5xl text-secondary animate-spin">sync</span>
            <p className="text-sm text-on-surface-variant font-semibold">Loading dashboard…</p>
          </div>
        ) : (
          <>
            {/* 4 Metric Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
                <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Today's Earning</p>
                <div className="flex items-baseline gap-0.5 mt-1.5">
                  <span className="text-secondary font-semibold text-xs">₹</span>
                  <span className="text-primary font-bold text-base md:text-lg leading-none">{stats.todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
                <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Total Bookings</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-primary font-bold text-base md:text-lg leading-none">{stats.totalBookings}</span>
                  <span className="text-on-surface-variant font-medium text-[10px]">Bookings</span>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
                <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Deliveries</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-primary font-bold text-base md:text-lg leading-none">{stats.deliveredToday}</span>
                  <span className="text-on-surface-variant font-medium text-[10px]">Today</span>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
                <p className="text-xs font-black text-primary uppercase tracking-wider truncate">Pending</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-primary font-bold text-base md:text-lg leading-none">{String(stats.pendingCount).padStart(2, '0')}</span>
                  <span className="text-on-surface-variant font-medium text-[10px]">Tasks</span>
                </div>
              </div>
            </section>

            {/* Weekly Earnings Chart */}
            {weeklyEarnings.length > 0 && (
              <section className="glass-panel p-4 rounded-xl border border-white/60 space-y-2">
                <p className="text-xs font-black text-primary uppercase tracking-wider">Weekly Earnings</p>
                <div className="flex items-end gap-1.5 h-16">
                  {weeklyEarnings.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-sm transition-all ${d.current ? 'bg-secondary' : 'bg-secondary/30'}`}
                        style={{ height: d.height }}
                      />
                      <span
                        onClick={() => setActiveDay(d.day)}
                        className={`text-[9px] font-bold cursor-pointer ${activeDay === d.day ? 'text-secondary' : 'text-on-surface-variant'}`}
                      >
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
                {activeDay && weeklyEarnings.find(d => d.day === activeDay) && (
                  <p className="text-xs text-center text-secondary font-semibold">
                    {activeDay}: ₹{(weeklyEarnings.find(d => d.day === activeDay)?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </section>
            )}

            {/* Active Service Areas */}
            <section
              onClick={() => navigate('/captain/service-areas')}
              className="glass-panel rounded-2xl p-4 flex items-center gap-4 border border-white/60 cursor-pointer hover:shadow-md hover:border-secondary/40 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(var(--md-sys-color-secondary-rgb, 56,142,60), 0.12)' }}>
                <span className="material-symbols-outlined text-secondary text-2xl">location_on</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-primary leading-tight">Active Service Areas</p>
                {savedLocation ? (
                  <p className="text-[11px] text-secondary font-semibold mt-0.5 leading-snug truncate flex items-center gap-1">
                    <span>📍 {savedLocation}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">Tap to view sellers in your range</p>
                )}
              </div>
              <span className="material-symbols-outlined text-secondary text-xl shrink-0">chevron_right</span>
            </section>

            {/* New Jobs Action Card */}
            <section className="grid grid-cols-1 gap-3.5">
              <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all border-white/60">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-headline-md text-base font-bold text-primary">New Jobs</h2>
                      {stats.pendingCount > 0 && <div className="w-2 h-2 bg-secondary-fixed rounded-full pulse-lime"></div>}
                    </div>
                    <p className="text-on-surface-variant text-xs">
                      {stats.pendingCount > 0 ? `${stats.pendingCount} deliveries assigned to you.` : 'No new jobs at this time.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-lg">near_me</span>
                  </div>
                </div>
                <div className="mt-3.5 flex gap-2">
                  <button
                    onClick={() => navigate('/captain/jobs')}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-xs flex-1 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    View Queue
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                  {stats.pendingCount > 0 && (
                    <button
                      onClick={() => {
                        const assigned = pendingOrders.find(o => o.captainStatus === 'Assigned');
                        if (assigned) {
                          setIncomingOrder(assigned);
                        } else {
                          navigate('/captain/active-delivery');
                        }
                      }}
                      className="bg-secondary text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      View Request
                      <span className="material-symbols-outlined text-xs">local_shipping</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Today's Pending / Active Orders List */}
            {pendingOrders.length > 0 && (
              <section className="glass-panel p-4 rounded-xl border border-white/60 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-md text-base font-bold text-primary">Active Orders</h2>
                    <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {pendingOrders.length} Orders
                    </span>
                  </div>
                  <button onClick={() => navigate('/captain/jobs')} className="text-xs font-bold text-secondary hover:underline cursor-pointer">
                    See All
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-surface-container-low/90 p-3.5 rounded-2xl border border-outline-variant/20 hover:border-secondary/40 transition-all space-y-2.5 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-primary">#{order.orderId}</span>
                            <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${getStatusBadge(order.captainStatus)}`}>
                              {order.captainStatus?.toUpperCase() || 'ASSIGNED'}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                            {order.items?.length || 0} items • {order.deliverySlot?.time || 'Standard Delivery'}
                          </p>
                        </div>
                        <span className="font-extrabold text-base text-secondary">₹{(order.captainEarnings || 0).toFixed(2)}</span>
                      </div>

                      <div className="space-y-1 text-xs bg-white/80 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-secondary text-xs shrink-0">location_on</span>
                          <span className="font-bold text-on-surface text-[11px] shrink-0">To:</span>
                          <span className="text-on-surface-variant text-[11px] truncate">
                            {order.shippingAddress?.fullName || order.user?.name}, {order.shippingAddress?.city}
                          </span>
                        </div>
                      </div>

                      {order.captainStatus === 'Assigned' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectIncomingOrder(order)}
                            className="flex-1 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                            Reject
                          </button>
                          <button
                            onClick={() => setIncomingOrder(order)}
                            className="flex-2 py-2 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Review & Accept
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate('/captain/active-delivery')}
                          className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Continue Delivery
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state when no pending */}
            {pendingOrders.length === 0 && !loading && (
              <div className="glass-panel p-8 rounded-xl border border-white/60 flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">local_shipping</span>
                <p className="text-sm font-bold text-primary">No active orders</p>
                <p className="text-xs text-on-surface-variant">New jobs will pop up automatically here when accepted by sellers.</p>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes modalSlideUp {
          from { transform: translateY(30px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <CaptainBottomNav />
    </div>
  );
};

export default CaptainDashboard;
