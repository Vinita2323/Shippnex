import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import IncomingGigModal from '../components/IncomingGigModal';
import { captainService } from '../../../services/authService';
import { transportService } from '../../../services/transportService';

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
  const [transportRequests, setTransportRequests] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);

  // ── Incoming Gig Overlay Modal State (Queue + Dismiss tracking) ──
  const [incomingJob, setIncomingJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dismissedJobIds, setDismissedJobIds] = useState(new Set());

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

  // ── Fetch Dashboard Stats & Incoming Requests ─────────────────
  const fetchDashboard = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await captainService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        const orders = res.pendingOrders || [];
        const tRequests = res.transportRequests || [];
        setPendingOrders(orders);
        setTransportRequests(tRequests);

        const wData = res.weeklyEarnings || [];
        const maxVal = Math.max(...wData.map((d) => d.value), 1);
        setWeeklyEarnings(
          wData.map((d, i) => ({
            ...d,
            height: `${Math.max(Math.round((d.value / maxVal) * 95), 5)}%`,
            current: i === wData.length - 1,
          }))
        );

        if (res.stats.isOnline !== undefined) {
          setIsOnline(res.stats.isOnline);
          localStorage.setItem('shippnex_captain_online', String(res.stats.isOnline));
        }

        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        setActiveDay(days[today.getDay()]);

        // Auto-popup white modal for incoming transport requests matching this captain
        const newTransport = tRequests.find(
          (t) => !dismissedJobIds.has(t._id) && !dismissedJobIds.has(t.bookingId)
        );
        if (newTransport && !incomingJob) {
          setIncomingJob({ ...newTransport, isTransport: true });
          return;
        }

        // Auto-popup white modal for newly assigned e-commerce orders
        const newAssignedOrder = orders.find(
          (o) =>
            o.captainStatus === 'Assigned' &&
            !dismissedJobIds.has(o._id) &&
            !dismissedJobIds.has(o.orderId)
        );
        if (newAssignedOrder && !incomingJob) {
          setIncomingJob({ ...newAssignedOrder, isTransport: false });
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [dismissedJobIds, incomingJob]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Polling every 5 seconds when online
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 5000);
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
          } catch (e) {}
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

  // ── Accept Job (Hides Modal & Navigates to Active Ride Screen) ──
  const handleAcceptJob = async (job) => {
    if (!job) return;
    setActionLoading(true);
    try {
      if (job.isTransport) {
        const bookingId = job.bookingId || job._id;
        await transportService.captainAcceptRequest(bookingId);
      } else {
        const orderId = job.orderId || job._id;
        await captainService.acceptJob(orderId);
      }
      setIncomingJob(null); // Modal closes immediately
      await fetchDashboard(true);
      navigate('/captain/active-delivery');
    } catch (err) {
      console.error('Accept job error:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to accept job.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject Job (Hides Modal & Never Reappears) ─────────────────
  const handleRejectJob = async (job) => {
    if (!job) return;
    setActionLoading(true);
    try {
      const id = job.bookingId || job.orderId || job._id;
      if (job.isTransport) {
        await transportService.captainRejectRequest(id);
      } else {
        await captainService.rejectJob(id);
      }
      setDismissedJobIds((prev) => new Set([...prev, job._id, id]));
      setIncomingJob(null); // Modal closes immediately
      await fetchDashboard(true);
    } catch (err) {
      console.error('Reject job error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Dismiss Modal ───────────────────────────────────────────────
  const handleDismissModal = (job) => {
    if (job) {
      const id = job.bookingId || job.orderId || job._id;
      setDismissedJobIds((prev) => new Set([...prev, job._id, id]));
    }
    setIncomingJob(null);
  };

  // ── Location Modal Helpers ─────────────────────────────────────
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
          setDetectedLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          });
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

  return (
    <div className="bg-[#f8fafc] font-body-md text-slate-800 min-h-screen pb-24 select-none">
      {/* Compact TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-2.5 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100">
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
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#366b00]"></div>
            <span
              className={`ms-1.5 font-label-sm text-[10px] font-bold tracking-wider ${
                isOnline ? 'text-[#366b00]' : 'text-slate-400'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </label>

          <button
            onClick={openLocationModal}
            title={savedLocation || 'Set Location'}
            className="relative p-1.5 text-slate-600 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: savedLocation ? '#366b00' : undefined }}
            >
              location_on
            </span>
            {savedLocation && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#366b00] rounded-full border border-white"></span>
            )}
          </button>

          <button
            onClick={() => navigate('/captain/notifications')}
            className="relative p-1.5 text-slate-600 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {stats.pendingCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 🚨 MINIMAL WHITE INCOMING GIG MODAL OVER CONTENT          */}
      {/* (Shows Pickup -> Drop, Distance, Earnings, Reject, Accept) */}
      {/* ────────────────────────────────────────────────────────── */}
      <IncomingGigModal
        job={incomingJob}
        onAccept={handleAcceptJob}
        onReject={handleRejectJob}
        onClose={() => handleDismissModal(incomingJob)}
        actionLoading={actionLoading}
      />

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLocationModal(false);
          }}
        >
          <div
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 pb-8 sm:pb-5"
            style={{ animation: 'slideUpModal 0.28s cubic-bezier(.4,0,.2,1)' }}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#366b00] text-base">location_on</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800">Set Your Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-slate-500">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <button
                onClick={handleAutoDetect}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  locationMode === 'auto'
                    ? 'border-[#366b00] bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100/60 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#366b00] text-xl">my_location</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800">Detect Location Automatically</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Use GPS to detect your current location
                  </p>
                  {locationMode === 'auto' && detectingLocation && (
                    <p className="text-[10px] text-[#366b00] mt-1 font-semibold animate-pulse">
                      Detecting location…
                    </p>
                  )}
                  {locationMode === 'auto' && detectedLocation && !detectingLocation && (
                    <p className="text-[10px] text-[#366b00] mt-1 font-semibold truncate">
                      📍 {detectedLocation.address}
                    </p>
                  )}
                  {locationMode === 'auto' && locationError && (
                    <p className="text-[10px] text-red-500 mt-1">{locationError}</p>
                  )}
                </div>
                {locationMode === 'auto' && !detectingLocation && !locationError && (
                  <span className="material-symbols-outlined text-[#366b00] text-base shrink-0">
                    check_circle
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setLocationMode('manual');
                  setLocationError('');
                  setTimeout(() => manualInputRef.current?.focus(), 100);
                }}
                className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  locationMode === 'manual'
                    ? 'border-[#366b00] bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100/60 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#366b00] text-xl">edit_location_alt</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800">Enter Location Manually</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Type your address or landmark
                  </p>
                  {locationMode === 'manual' && (
                    <input
                      ref={manualInputRef}
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="e.g. MG Road, Indore…"
                      className="mt-2 w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#366b00] transition-colors"
                    />
                  )}
                </div>
              </button>
            </div>

            <button
              onClick={handleSaveLocation}
              disabled={
                !locationMode ||
                (locationMode === 'auto' && (!detectedLocation || detectingLocation)) ||
                (locationMode === 'manual' && !manualAddress.trim())
              }
              className="w-full py-3 bg-[#366b00] text-white font-bold text-sm rounded-xl transition-all hover:bg-[#2d5800] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="pt-20 md:pt-24 px-3.5 max-w-7xl mx-auto space-y-3.5 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-5xl text-[#366b00] animate-spin">sync</span>
            <p className="text-sm text-slate-500 font-semibold">Loading dashboard…</p>
          </div>
        ) : (
          <>
            {/* 4 Metric Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate">
                  Today's Earning
                </p>
                <div className="flex items-baseline gap-0.5 mt-1.5">
                  <span className="text-[#15803d] font-semibold text-xs">₹</span>
                  <span className="text-slate-900 font-black text-lg md:text-xl leading-none">
                    {stats.todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate">
                  Total Bookings
                </p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-slate-900 font-black text-lg md:text-xl leading-none">
                    {stats.totalBookings}
                  </span>
                  <span className="text-slate-500 font-medium text-[10px]">Bookings</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate">Deliveries</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-slate-900 font-black text-lg md:text-xl leading-none">
                    {stats.deliveredToday}
                  </span>
                  <span className="text-slate-500 font-medium text-[10px]">Today</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate">Pending</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-slate-900 font-black text-lg md:text-xl leading-none">
                    {String(stats.pendingCount).padStart(2, '0')}
                  </span>
                  <span className="text-slate-500 font-medium text-[10px]">Tasks</span>
                </div>
              </div>
            </section>

            {/* Weekly Earnings Chart */}
            {weeklyEarnings.length > 0 && (
              <section className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Weekly Earnings</p>
                <div className="flex items-end gap-1.5 h-16">
                  {weeklyEarnings.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-md transition-all ${
                          d.current ? 'bg-[#366b00]' : 'bg-emerald-100'
                        }`}
                        style={{ height: d.height }}
                      />
                      <span
                        onClick={() => setActiveDay(d.day)}
                        className={`text-[9px] font-bold cursor-pointer ${
                          activeDay === d.day ? 'text-[#366b00]' : 'text-slate-400'
                        }`}
                      >
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
                {activeDay && weeklyEarnings.find((d) => d.day === activeDay) && (
                  <p className="text-xs text-center text-[#15803d] font-semibold">
                    {activeDay}: ₹
                    {(
                      weeklyEarnings.find((d) => d.day === activeDay)?.value || 0
                    ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </section>
            )}

            {/* Active Service Areas */}
            <section
              onClick={() => navigate('/captain/service-areas')}
              className="bg-white rounded-3xl p-4 flex items-center gap-4 border border-slate-100 shadow-2xs cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#047857]">
                <span className="material-symbols-outlined text-2xl">location_on</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 leading-tight">Active Service Areas</p>
                {savedLocation ? (
                  <p className="text-[11px] text-[#047857] font-semibold mt-0.5 leading-snug truncate flex items-center gap-1">
                    <span>📍 {savedLocation}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Tap to view sellers in your range
                  </p>
                )}
              </div>
              <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">chevron_right</span>
            </section>

            {/* Empty state when no pending */}
            {pendingOrders.length === 0 && transportRequests.length === 0 && !loading && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  local_shipping
                </span>
                <p className="text-sm font-bold text-slate-700">No Active Requests</p>
                <p className="text-xs text-slate-400">
                  When a ride request matching your vehicle arrives, the request modal will pop up on your screen.
                </p>
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
