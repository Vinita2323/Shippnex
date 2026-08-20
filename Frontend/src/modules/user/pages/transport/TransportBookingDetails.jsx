import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  ChevronLeft,
  Truck,
  Check,
  Package,
  IndianRupee,
  Loader2,
  AlertCircle,
  Phone,
  KeyRound,
  ShieldCheck,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { transportService } from '../../../../services/transportService';

// Map backend status to human-readable labels
const STATUS_LABELS = {
  SEARCHING_CAPTAIN: 'Searching for Captain',
  CAPTAIN_ASSIGNED: 'Captain Assigned',
  CAPTAIN_ARRIVING: 'Captain on the Way',
  CAPTAIN_REACHED_PICKUP: 'Captain at Pickup',
  RIDE_STARTED: 'In Transit / Ride Started',
  CAPTAIN_REACHED_DROP: 'Captain at Destination',
  RIDE_COMPLETED: 'Delivered & Completed',
  CANCELLED: 'Cancelled',
};

// The ordered milestone steps for progress bar
const TIMELINE_STEPS = [
  { status: 'SEARCHING_CAPTAIN', label: 'Booking Created' },
  { status: 'CAPTAIN_ASSIGNED', label: 'Captain Assigned' },
  { status: 'RIDE_STARTED', label: 'Goods Picked Up' },
  { status: 'CAPTAIN_REACHED_DROP', label: 'Reached Destination' },
  { status: 'RIDE_COMPLETED', label: 'Delivered' },
];

const STATUS_ORDER = [
  'SEARCHING_CAPTAIN',
  'CAPTAIN_ASSIGNED',
  'CAPTAIN_ARRIVING',
  'CAPTAIN_REACHED_PICKUP',
  'RIDE_STARTED',
  'CAPTAIN_REACHED_DROP',
  'RIDE_COMPLETED',
];

const isCompleted = (stepStatus, bookingStatus) => {
  if (bookingStatus === 'CANCELLED') return false;
  return STATUS_ORDER.indexOf(bookingStatus) >= STATUS_ORDER.indexOf(stepStatus);
};

const TransportBookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = location.state?.bookingId;
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooking = useCallback(async (isSilent = false) => {
    if (!bookingId) return;
    try {
      if (!isSilent) setLoading(true);
      const data = await transportService.getBookingDetails(bookingId);
      setBooking(data.booking);
      setError(null);
    } catch (err) {
      if (!isSilent) setError('Could not load booking details.');
    } finally {
      if (!isSilent) setLoading(false);
      setRefreshing(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Auto-poll active bookings every 5 seconds for live captain progression & OTP triggers
  useEffect(() => {
    if (!booking || ['RIDE_COMPLETED', 'CANCELLED'].includes(booking.status)) return;
    const interval = setInterval(() => {
      fetchBooking(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [booking, fetchBooking]);

  if (!bookingId) return <Navigate to="/orders" replace />;

  if (loading) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin text-[#047857]" />
        <span className="text-[14px] font-medium">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center gap-3">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-[15px] text-slate-600">{error || 'Booking not found.'}</p>
        <button className="bg-[#047857] text-white px-6 py-2 rounded-xl font-bold" onClick={() => navigate('/orders')}>
          Go to Orders
        </button>
      </div>
    );
  }

  const bId = booking.bookingId || booking._id;
  const bStatus = booking.status || 'SEARCHING_CAPTAIN';
  const bPickup = booking.pickupLocation?.address || booking.pickup || '—';
  const bDrop = booking.dropLocation?.address || booking.drop || '—';
  const bFare = booking.fareBreakdown?.totalFare ?? booking.fare ?? 0;
  const bVehicle = booking.vehicleSnapshot?.name || booking.vehicle?.name || 'Vehicle';
  const bCategory = booking.goods?.category || '—';
  const bWeight = booking.goods?.weightKg || booking.goods?.weight || '—';
  const bPackages = booking.goods?.packages || '—';
  const bInstructions = booking.goods?.instructions || '';
  const bDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
  const bDistanceKm = booking.distanceKm || null;
  const bPayment = booking.paymentMethod || 'CASH';
  const captain = booking.captainId;

  // Determine active OTP card to show
  const showPickupOtp =
    ['CAPTAIN_ASSIGNED', 'CAPTAIN_ARRIVING', 'CAPTAIN_REACHED_PICKUP'].includes(bStatus) &&
    booking.pickupOtp &&
    !booking.pickupOtpVerified;

  const showDropOtp =
    ['RIDE_STARTED', 'CAPTAIN_REACHED_DROP'].includes(bStatus) &&
    booking.dropOtp &&
    !booking.dropOtpVerified;

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-4 bg-white z-10 sticky top-0 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <h2 className="text-[16px] font-bold tracking-tight m-0 text-slate-800">Transport Tracking</h2>
        </div>
        <button
          onClick={() => { setRefreshing(true); fetchBooking(false); }}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg p-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#047857]' : ''} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-[40px] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
        {/* ── STAGE 1: PICKUP OTP CARD (HIGHLIGHTED) ── */}
        {showPickupOtp && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-md border border-emerald-500 flex items-center justify-between animate-fade-in-up">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <KeyRound size={14} /> Pickup Verification OTP
              </span>
              <span className="text-[32px] font-black tracking-widest leading-tight font-mono text-white mt-1">
                {booking.pickupOtp}
              </span>
              <span className="text-[11px] text-emerald-100 font-medium">
                Share this 4-digit OTP with the captain when ready to load goods.
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <KeyRound size={24} />
            </div>
          </div>
        )}

        {/* ── STAGE 2: DROP OTP CARD (HIGHLIGHTED) ── */}
        {showDropOtp && (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-4 shadow-md border border-amber-500 flex items-center justify-between animate-fade-in-up">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Drop Delivery OTP
              </span>
              <span className="text-[32px] font-black tracking-widest leading-tight font-mono text-white mt-1">
                {booking.dropOtp}
              </span>
              <span className="text-[11px] text-amber-100 font-medium">
                Share this 4-digit OTP with the captain upon arrival to complete delivery.
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={24} />
            </div>
          </div>
        )}

        {/* Top Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-extrabold text-slate-900 m-0">{bId}</span>
              <span className="text-[11px] font-medium text-slate-400">{bDate}</span>
            </div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${
                bStatus === 'CANCELLED'
                  ? 'bg-red-100 text-red-600'
                  : bStatus === 'RIDE_COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : bStatus === 'RIDE_STARTED'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-600'
              }`}
            >
              {STATUS_LABELS[bStatus] || bStatus}
            </span>
          </div>

          <div className="w-full h-px bg-slate-100" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
                <Truck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-800">{bVehicle}</span>
                <span className="text-[12px] text-slate-500">
                  {bCategory} • {bWeight}KG
                </span>
              </div>
            </div>
            <span className="text-[16px] font-extrabold text-slate-900 flex items-center">
              <IndianRupee size={14} strokeWidth={3} /> {bFare}
            </span>
          </div>

          <div className="flex gap-2">
            {bDistanceKm && (
              <span className="text-[11px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded">
                {bDistanceKm} km
              </span>
            )}
            <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {bPayment}
            </span>
          </div>
        </div>

        {/* Assigned Captain Card (if assigned) */}
        {captain && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857] font-bold text-base border border-emerald-100">
                {captain.name ? captain.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Assigned Captain</span>
                <span className="text-[14px] font-bold text-slate-800">{captain.name || 'Captain Partner'}</span>
                <span className="text-[12px] text-slate-500">{captain.vehicleType || 'Transport Vehicle'}</span>
              </div>
            </div>
            {captain.phone && (
              <button
                onClick={() => window.open(`tel:${captain.phone}`, '_self')}
                className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#047857] border border-emerald-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Phone size={18} />
              </button>
            )}
          </div>
        )}

        {/* Booking Status Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-800 mb-5">Ride Timeline</h3>
          <div className="relative pl-3">
            <div className="absolute left-[23px] top-2 bottom-6 w-0.5 bg-slate-100"></div>
            {TIMELINE_STEPS.map((step, idx) => {
              const done = isCompleted(step.status, bStatus);
              const historyEntry = booking.statusHistory?.find((h) => h.status === step.status);
              const timeStr = historyEntry?.timestamp
                ? new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : null;

              return (
                <div key={idx} className={`relative flex gap-4 ${idx !== TIMELINE_STEPS.length - 1 ? 'mb-6' : ''}`}>
                  <div className="relative z-10">
                    {done ? (
                      <div className="w-6 h-6 rounded-full bg-[#047857] flex items-center justify-center border-2 border-white shadow-sm">
                        <Check size={12} className="text-white" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 pb-1">
                    <span className={`text-[13px] font-bold ${done ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    {timeStr && <span className="text-[11px] text-slate-500 mt-0.5">{timeStr}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locations Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
          <div className="flex flex-col items-center mt-1.5 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#047857]"></div>
            <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-[#ff5500]"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4 py-0.5">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pickup Address</span>
              <span className="text-[13px] font-medium text-slate-800 leading-snug">{bPickup}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Drop Address</span>
              <span className="text-[13px] font-medium text-slate-800 leading-snug">{bDrop}</span>
            </div>
          </div>
        </div>

        {/* Goods Information Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Package size={16} className="text-[#047857]" /> Goods Information
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium mb-0.5">Category</span>
              <span className="text-[13px] font-semibold text-slate-800">{bCategory}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium mb-0.5">Total Weight</span>
              <span className="text-[13px] font-semibold text-slate-800">{bWeight} KG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium mb-0.5">Packages</span>
              <span className="text-[13px] font-semibold text-slate-800">{bPackages} Boxes</span>
            </div>
          </div>
          {bInstructions && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium mb-1">Instructions</span>
              <span className="text-[12px] italic text-slate-700">{bInstructions}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportBookingDetails;
