import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService } from '../../../services/authService';
import { transportService } from '../../../services/transportService';

const TRANSPORT_STEP_MAP = {
  SEARCHING_CAPTAIN: 1,
  CAPTAIN_ASSIGNED: 1,
  CAPTAIN_ARRIVING: 1,
  CAPTAIN_REACHED_PICKUP: 2,
  RIDE_STARTED: 3,
  CAPTAIN_REACHED_DROP: 4,
  RIDE_COMPLETED: 5,
};

const ORDER_STEP_MAP = {
  Assigned: 1,
  Accepted: 1,
  'At Pickup': 2,
  'Picked Up': 3,
  'In Transit': 3,
  Delivered: 4,
};

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const [isTransport, setIsTransport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'dispatch',
      text: 'You have an active mission assigned. Proceed to the pickup location.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // OTP Verification Modals
  const [showPickupOtpModal, setShowPickupOtpModal] = useState(false);
  const [showDropOtpModal, setShowDropOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Proof of delivery
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  const fetchActiveDelivery = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check for active transport haulage ride first
      const transportRes = await transportService.captainGetActiveRide();
      if (transportRes.success && transportRes.booking) {
        setActiveItem(transportRes.booking);
        setIsTransport(true);
        setCurrentStep(TRANSPORT_STEP_MAP[transportRes.booking.status] || 1);
        setLoading(false);
        return;
      }

      // 2. Check for active standard delivery order
      const orderRes = await captainService.getActiveDelivery();
      if (orderRes.success && orderRes.order) {
        setActiveItem(orderRes.order);
        setIsTransport(false);
        setCurrentStep(ORDER_STEP_MAP[orderRes.order.captainStatus] || 1);
      } else {
        setActiveItem(null);
      }
    } catch (err) {
      console.error('Fetch active delivery error:', err);
      setActiveItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveDelivery();
  }, [fetchActiveDelivery]);

  // ── Status Updates for Standard Order ──
  const handleUpdateOrderStatus = async (newStatus) => {
    if (!activeItem) return;
    setStatusUpdating(true);
    try {
      await captainService.updateDeliveryStatus(activeItem.orderId || activeItem._id, newStatus);
      setCurrentStep(ORDER_STEP_MAP[newStatus] || 1);
      setActiveItem((prev) => ({ ...prev, captainStatus: newStatus }));

      if (newStatus === 'Delivered') {
        navigate('/captain/delivery-verification');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Status Updates for Transport Ride ──
  const handleUpdateTransportStatus = async (newStatus) => {
    if (!activeItem) return;
    setStatusUpdating(true);
    try {
      const res = await transportService.captainUpdateStatus(activeItem.bookingId || activeItem._id, newStatus);
      setActiveItem(res.booking);
      setCurrentStep(TRANSPORT_STEP_MAP[newStatus] || 1);
    } catch (err) {
      console.error('Transport status update error:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update transport status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── OTP input helpers ──
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);
      setOtpError('');
      if (value && index < 3) {
        const next = document.getElementById(`modal-otp-input-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prev = document.getElementById(`modal-otp-input-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  // ── Verify Pickup OTP (Stage 1) ──
  const handleVerifyPickupOtp = async () => {
    const otpStr = otpDigits.join('');
    if (otpStr.length < 4) {
      setOtpError('Please enter the 4-digit Pickup OTP.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const bookingId = activeItem.bookingId || activeItem._id;
      const res = await transportService.captainVerifyPickupOtp(bookingId, otpStr);
      setActiveItem(res.booking);
      setCurrentStep(3); // RIDE_STARTED
      setShowPickupOtpModal(false);
      setOtpDigits(['', '', '', '']);
    } catch (err) {
      setOtpError(err?.response?.data?.message || err?.message || 'Invalid Pickup OTP.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── Verify Drop OTP & Complete (Stage 2) ──
  const handleVerifyDropOtp = async () => {
    const otpStr = otpDigits.join('');
    if (otpStr.length < 4) {
      setOtpError('Please enter the 4-digit Drop OTP.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const bookingId = activeItem.bookingId || activeItem._id;
      const res = await transportService.captainVerifyDropOtp(bookingId, otpStr, proofUrl);
      setActiveItem(res.booking);
      setCurrentStep(5); // RIDE_COMPLETED
      setShowDropOtpModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setOtpError(err?.response?.data?.message || err?.message || 'Invalid Drop OTP.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── Photo upload handler ──
  const handlePhotoCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProofUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setCapturedPhoto(base64);
      setProofUrl(base64);
      setProofUploading(false);
    };
    reader.onerror = () => setProofUploading(false);
    reader.readAsDataURL(file);
  };

  const handleCall = () => {
    setShowCallingModal(true);
    const phone = isTransport
      ? activeItem?.user?.phone
      : activeItem?.shippingAddress?.phone || activeItem?.user?.phone;
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleSendChatMessage = (textToSend) => {
    const msg = textToSend || newMessage;
    if (!msg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'captain', text: msg, time: now }]);
    setNewMessage('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'dispatch',
          text: 'Message received. Update logged in dispatch center.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-5xl text-secondary animate-spin">sync</span>
        <p className="text-sm font-semibold text-on-surface-variant">Loading active delivery…</p>
      </div>
    );
  }

  if (!activeItem) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">local_shipping</span>
        <h2 className="font-bold text-lg text-primary">No Active Mission</h2>
        <p className="text-sm text-on-surface-variant">
          You don't have any active trip right now. Accept a transport request or job from your queue.
        </p>
        <button
          onClick={() => navigate('/captain/jobs')}
          className="mt-2 px-6 py-3 bg-[#366b00] text-white font-bold text-sm rounded-2xl shadow-md cursor-pointer"
        >
          View Job Queue
        </button>
        <CaptainBottomNav />
      </div>
    );
  }

  // Display normalization
  const tripId = isTransport ? activeItem.bookingId : activeItem.orderId;
  const recipientName = isTransport
    ? activeItem.user?.name || 'Transport Customer'
    : activeItem.shippingAddress?.fullName || activeItem.user?.name || 'Customer';
  const recipientPhone = isTransport
    ? activeItem.user?.phone || ''
    : activeItem.shippingAddress?.phone || activeItem.user?.phone || '';
  const pickupAddress = isTransport
    ? activeItem.pickupLocation?.address
    : 'Seller Warehouse';
  const dropAddress = isTransport
    ? activeItem.dropLocation?.address
    : `${activeItem.shippingAddress?.addressLine1}, ${activeItem.shippingAddress?.city}`;
  const payout = activeItem.captainEarnings || 0;
  const statusBadgeText = isTransport ? activeItem.status : activeItem.captainStatus;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-2xl md:rounded-b-3xl border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 border-2 border-[#97fc43] shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Captain Profile"
              src={
                localStorage.getItem('shippnex_captain_avatar') ||
                'https://ui-avatars.com/api/?name=Captain&background=366b00&color=fff'
              }
            />
          </div>
          <div className="leading-tight mt-0.5">
            <h1 className="font-headline-md text-sm md:text-base font-bold text-white tracking-wide">
              {isTransport ? 'Transport Ride' : 'Delivery Nav'}
            </h1>
            <p className="text-[9px] md:text-[10px] text-[#97fc43] uppercase font-bold tracking-widest mt-0.5">
              #{tripId} • {isTransport ? 'Goods Haulage' : 'Standard'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/captain/notifications')}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors relative cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>
      </header>

      <main className="pt-20 md:pt-24 px-3.5 max-w-3xl mx-auto space-y-3 mt-2.5">
        {/* Active Card Header */}
        <div className="glass-panel p-3.5 rounded-2xl shadow-xs border-white/60 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <span className="font-label-sm text-[10px] text-[#366b00] tracking-widest uppercase font-black block">
              {isTransport ? 'Active Transport Ride' : 'Active Delivery'}
            </span>
            <h2 className="font-headline-md text-base md:text-lg font-black text-primary truncate mt-0.5">
              #{tripId}
            </h2>
          </div>
          <div className="bg-emerald-100 text-[#15803d] px-3 py-1 rounded-full font-label-sm text-xs font-bold shadow-xs shrink-0 whitespace-nowrap uppercase">
            {statusBadgeText || 'ACTIVE'}
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="glass-panel p-3 rounded-2xl shadow-xs border-white/60 flex justify-around items-center">
          <button
            onClick={handleCall}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer border-r border-outline-variant/20"
          >
            <div className="w-11 h-11 rounded-full bg-secondary-container text-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <span className="text-xs font-bold text-primary">Call Customer</span>
          </button>

          <button
            onClick={() => setShowChatModal(true)}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-primary-container text-primary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <span className="text-xs font-bold text-primary">Chat Support</span>
          </button>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[#047857] text-base">warehouse</span>
              <span className="font-label-sm text-[10px] font-black text-[#047857] uppercase tracking-wider">
                PICKUP LOCATION
              </span>
            </div>
            <p className="font-extrabold text-sm text-on-surface leading-snug">{pickupAddress}</p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[#ff5500] text-base">location_on</span>
              <span className="font-label-sm text-[10px] font-black text-[#ff5500] uppercase tracking-wider">
                DROP-OFF DESTINATION
              </span>
            </div>
            <p className="font-extrabold text-sm text-on-surface leading-snug">{recipientName}</p>
            <p className="text-on-surface-variant text-xs truncate">{dropAddress}</p>
          </div>
        </div>

        {/* Goods / Item Details (Transport specifics) */}
        {isTransport && activeItem.goods && (
          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs flex justify-between items-center text-xs">
            <div>
              <span className="font-black text-[9px] text-slate-400 uppercase tracking-widest block">
                CARGO DETAILS
              </span>
              <p className="font-bold text-slate-800 mt-0.5">
                {activeItem.goods.category} • {activeItem.goods.weightKg} KG • {activeItem.goods.packages} Boxes
              </p>
              {activeItem.goods.instructions && (
                <p className="text-[11px] text-slate-500 italic mt-0.5">"{activeItem.goods.instructions}"</p>
              )}
            </div>
            <div className="text-right">
              <span className="font-black text-[9px] text-slate-400 uppercase tracking-widest block">VEHICLE</span>
              <p className="font-bold text-primary">{activeItem.vehicleSnapshot?.name || 'Truck'}</p>
            </div>
          </div>
        )}

        {/* ── PROGRESS & ACTION BUTTONS ── */}
        <div className="glass-panel p-4 rounded-2xl shadow-xs border-white/60 space-y-3.5">
          <h3 className="font-label-sm text-xs text-outline tracking-widest uppercase font-black">
            {isTransport ? 'Ride Progress & Verification' : 'Delivery Progress'}
          </h3>

          {/* Transport Milestones */}
          {isTransport ? (
            <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
              {[
                { step: 1, label: 'Captain Assigned', sub: 'Proceeding to pickup location' },
                { step: 2, label: 'Reached Pickup', sub: 'Verify customer Pickup OTP before loading' },
                { step: 3, label: 'Goods Picked Up / In Transit', sub: 'Transporting cargo to drop destination' },
                { step: 4, label: 'Reached Drop Location', sub: 'Verify customer Drop OTP to complete' },
                { step: 5, label: 'Delivered & Completed', sub: 'Trip finished & payout credited' },
              ].map(({ step, label, sub }) => (
                <div key={step} className="flex gap-3 relative z-10 items-start">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 mt-0.5 ${
                      currentStep >= step
                        ? step === currentStep
                          ? 'bg-[#366b00] ring-2 ring-[#97fc43]'
                          : 'bg-[#366b00]'
                        : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className={`font-bold text-xs md:text-sm ${currentStep >= step ? 'text-primary' : 'text-slate-400'}`}>
                      {label}
                    </p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Standard Delivery Milestones
            <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
              {[
                { step: 1, label: 'Order Accepted', sub: 'Proceed to store' },
                { step: 2, label: 'Reached Store', sub: 'Collecting packages' },
                { step: 3, label: 'Out for Delivery', sub: 'En route to customer' },
                { step: 4, label: 'Delivered', sub: 'OTP verified' },
              ].map(({ step, label, sub }) => (
                <div key={step} className="flex gap-3 relative z-10 items-start">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 mt-0.5 ${
                      currentStep >= step ? 'bg-[#366b00]' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className={`font-bold text-xs md:text-sm ${currentStep >= step ? 'text-primary' : 'text-slate-400'}`}>
                      {label}
                    </p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ACTION BUTTONS ── */}
          <div className="space-y-2 pt-2">
            {/* Transport Action 1: Reached Pickup */}
            {isTransport && (activeItem.status === 'CAPTAIN_ASSIGNED' || activeItem.status === 'CAPTAIN_ARRIVING') && (
              <button
                onClick={() => handleUpdateTransportStatus('CAPTAIN_REACHED_PICKUP')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">store</span>
                )}
                Arrived at Pickup Location
              </button>
            )}

            {/* Transport Action 2: Enter Pickup OTP */}
            {isTransport && activeItem.status === 'CAPTAIN_REACHED_PICKUP' && (
              <button
                onClick={() => {
                  setOtpDigits(['', '', '', '']);
                  setOtpError('');
                  setShowPickupOtpModal(true);
                }}
                className="w-full py-3.5 bg-[#366b00] hover:bg-[#2d5800] text-white rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
              >
                <span className="material-symbols-outlined text-base">pin</span>
                Enter Customer Pickup OTP & Start Ride
              </button>
            )}

            {/* Transport Action 3: Reached Drop Destination */}
            {isTransport && activeItem.status === 'RIDE_STARTED' && (
              <button
                onClick={() => handleUpdateTransportStatus('CAPTAIN_REACHED_DROP')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">location_on</span>
                )}
                Arrived at Drop Destination
              </button>
            )}

            {/* Transport Action 4: Enter Drop OTP & Complete */}
            {isTransport && activeItem.status === 'CAPTAIN_REACHED_DROP' && (
              <button
                onClick={() => {
                  setOtpDigits(['', '', '', '']);
                  setOtpError('');
                  setShowDropOtpModal(true);
                }}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                Enter Drop OTP & Complete Transport
              </button>
            )}

            {/* Standard Delivery Actions */}
            {!isTransport && activeItem.captainStatus === 'Accepted' && (
              <button
                onClick={() => handleUpdateOrderStatus('At Pickup')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                Arrived at Store / Pickup
              </button>
            )}
            {!isTransport && activeItem.captainStatus === 'At Pickup' && (
              <button
                onClick={() => handleUpdateOrderStatus('In Transit')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                Pick Up & Start Delivery
              </button>
            )}
            {!isTransport &&
              (activeItem.captainStatus === 'In Transit' || activeItem.captainStatus === 'Picked Up') && (
                <button
                  onClick={() => navigate('/captain/delivery-verification')}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Complete Drop-off (Verify OTP)
                </button>
              )}
          </div>
        </div>

        {/* Payout Card */}
        <div className="glass-panel p-4 rounded-2xl border border-white/60 flex justify-between items-center">
          <div>
            <p className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Your Payout</p>
            <p className="text-2xl font-extrabold text-[#15803d] mt-1">₹{payout.toFixed(2)}</p>
          </div>
          <div className="text-right text-xs text-on-surface-variant">
            <p className="font-bold text-primary">{isTransport ? 'Transport Fare' : 'Delivery Fee'}</p>
            <p>{activeItem.paymentMethod || 'Prepaid'}</p>
          </div>
        </div>
      </main>

      {/* ── MODAL 1: PICKUP OTP VERIFICATION ── */}
      {showPickupOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#366b00]">pin</span>
                Enter Pickup OTP
              </h3>
              <button
                onClick={() => setShowPickupOtpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ask the customer at the pickup point for the 4-digit Pickup OTP shown on their screen before loading goods.
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-between gap-2 max-w-xs mx-auto py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`modal-otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  placeholder="•"
                  className="w-12 h-14 text-center text-2xl font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#366b00] focus:ring-2 focus:ring-[#97fc43]/30 outline-none"
                />
              ))}
            </div>

            {otpError && <p className="text-center text-xs text-red-500 font-semibold">{otpError}</p>}

            <button
              onClick={handleVerifyPickupOtp}
              disabled={verifyingOtp || otpDigits.join('').length < 4}
              className="w-full py-3.5 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {verifyingOtp ? (
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              ) : (
                <span className="material-symbols-outlined text-base">check_circle</span>
              )}
              {verifyingOtp ? 'Verifying OTP…' : 'Verify Pickup & Start Ride'}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 2: DROP OTP VERIFICATION ── */}
      {showDropOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff5500]">verified</span>
                Enter Drop OTP
              </h3>
              <button
                onClick={() => setShowDropOtpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ask the recipient at the destination for the 4-digit Drop OTP to confirm safe delivery and complete the trip.
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-between gap-2 max-w-xs mx-auto py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`modal-otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  placeholder="•"
                  className="w-12 h-14 text-center text-2xl font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#366b00] focus:ring-2 focus:ring-[#97fc43]/30 outline-none"
                />
              ))}
            </div>

            {/* Proof Photo (optional) */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <div className="pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-base text-[#366b00]">
                  {capturedPhoto ? 'check_circle' : 'photo_camera'}
                </span>
                {capturedPhoto ? 'Proof Photo Attached ✓' : 'Attach Delivery Photo Proof (Optional)'}
              </button>
            </div>

            {otpError && <p className="text-center text-xs text-red-500 font-semibold">{otpError}</p>}

            <button
              onClick={handleVerifyDropOtp}
              disabled={verifyingOtp || otpDigits.join('').length < 4}
              className="w-full py-3.5 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {verifyingOtp ? (
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              ) : (
                <span className="material-symbols-outlined text-base">task_alt</span>
              )}
              {verifyingOtp ? 'Completing Ride…' : 'Verify Drop & Complete'}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 3: COMPLETION CELEBRATION ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center space-y-4 border border-slate-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-[#15803d]">task_alt</span>
            </div>
            <h2 className="font-headline-lg font-extrabold text-2xl text-slate-900">Ride Completed!</h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Transport verified and finished. Your payout of{' '}
              <span className="font-bold text-[#15803d]">₹{payout.toFixed(2)}</span> has been credited to your wallet.
            </p>
            <button
              onClick={() => navigate('/captain/dashboard')}
              className="w-full py-3.5 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold rounded-2xl shadow-md cursor-pointer transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Calling Modal */}
      {showCallingModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border-white shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">Calling Customer...</h3>
              <p className="text-xs text-on-surface-variant mt-1">{recipientPhone}</p>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-0.5">
                #{tripId}
              </p>
            </div>
            <button
              onClick={() => setShowCallingModal(false)}
              className="w-full py-2.5 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 transition-all cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Chat Support Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col w-full h-[100dvh] overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                DP
              </div>
              <div className="leading-tight">
                <h3 className="font-bold text-sm text-white">Dispatcher Support</h3>
                <p className="text-[10px] text-secondary-fixed font-medium">#{tripId}</p>
              </div>
            </div>
            <button onClick={() => setShowChatModal(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-surface-container-lowest">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === 'captain' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'captain'
                      ? 'bg-secondary text-white rounded-br-none shadow-xs'
                      : 'bg-surface-container-high text-primary rounded-bl-none border border-outline-variant/30 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-outline mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-outline-variant/20 flex gap-2 shrink-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Type message to dispatcher..."
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:ring-1 focus:ring-secondary focus:outline-none"
            />
            <button
              onClick={() => handleSendChatMessage()}
              className="px-4 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}

      {!showChatModal && <CaptainBottomNav />}
    </div>
  );
};

export default ActiveDelivery;
