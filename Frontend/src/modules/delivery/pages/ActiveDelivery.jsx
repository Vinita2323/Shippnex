import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import DeliveryMap from '../components/DeliveryMap';
import { captainService, returnService } from '../../../services/authService';
import { transportService } from '../../../services/transportService';
import RatingModal from '../../../components/RatingModal';
import { geocodeAddress, getCurrentLocation } from '../../../utils/geocodeUtils';

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

const RETURN_STEP_MAP = {
  CAPTAIN_ASSIGNED: 1,
  PICKUP_STARTED: 1,
  PICKUP_ARRIVED: 2,
  PICKED_UP: 3,
  IN_TRANSIT_TO_SELLER: 3,
  RECEIVED_BY_SELLER: 4,
  DELIVERED_TO_SELLER: 4,
};

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const requestedType = searchParams.get('type') || location.state?.type; // 'order' | 'transport' | 'return'
  const requestedOrderId = searchParams.get('orderId') || location.state?.orderId;
  const requestedBookingId = searchParams.get('bookingId') || location.state?.bookingId;
  const requestedReturnId = searchParams.get('returnId') || location.state?.returnId;

  const [activeItem, setActiveItem] = useState(null);
  const [isTransport, setIsTransport] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTransport, setActiveTransport] = useState(null);
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

  // OTP Verification Modals (Used for Transport & Return Delivery)
  const [showPickupOtpModal, setShowPickupOtpModal] = useState(false);
  const [showDropOtpModal, setShowDropOtpModal] = useState(false);
  const [showReturnOtpModal, setShowReturnOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Return Doorstep Quality Inspection State
  const [returnChecklist, setReturnChecklist] = useState({
    correctItem: true,
    undamaged: true,
    originalTagsPresent: true,
    packagingIntact: true,
    notes: '',
  });
  const [showFailReasonModal, setShowFailReasonModal] = useState(false);
  const [failReason, setFailReason] = useState('');
  const [failingInspection, setFailingInspection] = useState(false);

  // Proof of delivery
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCaptainRatingModal, setShowCaptainRatingModal] = useState(false);
  const fileInputRef = useRef(null);

  // Map locations
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [captainCoords, setCaptainCoords] = useState(null);
  const [loadingCoords, setLoadingCoords] = useState(false);

  const fetchActiveDelivery = useCallback(async () => {
    setLoading(true);
    try {
      if (requestedType === 'return' || requestedReturnId) {
        let returnDoc = null;
        if (requestedReturnId) {
          const res = await returnService.getReturnById(requestedReturnId).catch(() => null);
          returnDoc = res?.returnRequest || null;
        }
        if (!returnDoc) {
          const res = await returnService.getCaptainReturnJobs('active').catch(() => null);
          returnDoc = res?.returnJobs?.[0] || null;
        }
        if (returnDoc) {
          setActiveItem(returnDoc);
          setIsReturn(true);
          setIsTransport(false);
          setCurrentStep(RETURN_STEP_MAP[returnDoc.status] || 1);
          setLoading(false);
          return;
        }
      }

      if (requestedType === 'order' || requestedOrderId) {
        const orderRes = await captainService.getActiveDelivery();
        if (orderRes.success && orderRes.order) {
          setActiveItem(orderRes.order);
          setActiveOrder(orderRes.order);
          setIsTransport(false);
          setIsReturn(false);
          setCurrentStep(ORDER_STEP_MAP[orderRes.order.captainStatus] || 1);
        } else {
          setActiveItem(null);
        }
        setLoading(false);
        return;
      }

      if (requestedType === 'transport' || requestedBookingId) {
        const transportRes = await transportService.captainGetActiveRide();
        if (transportRes.success && transportRes.booking) {
          setActiveItem(transportRes.booking);
          setActiveTransport(transportRes.booking);
          setIsTransport(true);
          setIsReturn(false);
          setCurrentStep(TRANSPORT_STEP_MAP[transportRes.booking.status] || 1);
        } else {
          setActiveItem(null);
        }
        setLoading(false);
        return;
      }

      // If no explicit preference passed, check all concurrently
      const [orderRes, transportRes, returnRes] = await Promise.allSettled([
        captainService.getActiveDelivery(),
        transportService.captainGetActiveRide(),
        returnService.getCaptainReturnJobs('active'),
      ]);

      const foundOrder = orderRes.status === 'fulfilled' && orderRes.value?.success ? orderRes.value.order : null;
      const foundTransport = transportRes.status === 'fulfilled' && transportRes.value?.success ? transportRes.value.booking : null;
      const foundReturn = returnRes.status === 'fulfilled' && returnRes.value?.success ? returnRes.value.returnJobs?.[0] : null;

      if (foundReturn) {
        setActiveItem(foundReturn);
        setIsReturn(true);
        setIsTransport(false);
        setCurrentStep(RETURN_STEP_MAP[foundReturn.status] || 1);
      } else if (foundOrder) {
        setActiveItem(foundOrder);
        setIsTransport(false);
        setIsReturn(false);
        setCurrentStep(ORDER_STEP_MAP[foundOrder.captainStatus] || 1);
      } else if (foundTransport) {
        setActiveItem(foundTransport);
        setIsTransport(true);
        setIsReturn(false);
        setCurrentStep(TRANSPORT_STEP_MAP[foundTransport.status] || 1);
      } else {
        setActiveItem(null);
      }
    } catch (err) {
      console.error('Fetch active delivery error:', err);
      setActiveItem(null);
    } finally {
      setLoading(false);
    }
  }, [requestedType, requestedOrderId, requestedBookingId, requestedReturnId]);

  useEffect(() => {
    fetchActiveDelivery();
  }, [fetchActiveDelivery]);

  // Geocode addresses and get captain location
  useEffect(() => {
    if (!activeItem) return;

    const loadLocations = async () => {
      setLoadingCoords(true);
      try {
        // Derive pickup address from activeItem
        let pickupAddr = '';
        if (isReturn) {
          pickupAddr = typeof activeItem.pickupAddress === 'string'
            ? activeItem.pickupAddress
            : activeItem.pickupAddress
            ? `${activeItem.pickupAddress.addressLine1 || activeItem.pickupAddress.street || ''}, ${activeItem.pickupAddress.city || ''} ${activeItem.pickupAddress.pincode || ''}`
            : 'Customer Pickup Address';
        } else if (isTransport) {
          pickupAddr = activeItem.pickupLocation?.address || '';
        }

        // Derive drop address from activeItem
        let dropAddr = '';
        if (isReturn) {
          dropAddr = activeItem.seller?.storeAddress || activeItem.seller?.address || `${activeItem.seller?.storeName || 'Seller'} Store / Warehouse`;
        } else if (isTransport) {
          dropAddr = activeItem.dropLocation?.address || '';
        } else {
          dropAddr = `${activeItem.shippingAddress?.addressLine1 || ''}, ${activeItem.shippingAddress?.city || ''}`;
        }

        // Get pickup coordinates
        if (pickupAddr && !pickupCoords) {
          try {
            const coords = await geocodeAddress(pickupAddr);
            setPickupCoords(coords);
          } catch (err) {
            console.warn('Could not geocode pickup address:', err);
          }
        }

        // Get drop-off coordinates
        if (dropAddr && !dropCoords) {
          try {
            const coords = await geocodeAddress(dropAddr);
            setDropCoords(coords);
          } catch (err) {
            console.warn('Could not geocode drop address:', err);
          }
        }

        // Get captain's current location
        if (!captainCoords) {
          try {
            const coords = await getCurrentLocation();
            setCaptainCoords(coords);
          } catch (err) {
            console.warn('Could not get captain location:', err);
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setLoadingCoords(false);
      }
    };

    loadLocations();
  }, [activeItem, isReturn, isTransport, pickupCoords, dropCoords, captainCoords]);

  // ── Status Updates for Standard Order (No OTP Required) ──
  const handleUpdateOrderStatus = async (newStatus) => {
    if (!activeItem) return;
    setStatusUpdating(true);
    try {
      await captainService.updateDeliveryStatus(activeItem.orderId || activeItem._id, newStatus, { proofUrl });
      setCurrentStep(ORDER_STEP_MAP[newStatus] || 1);
      setActiveItem((prev) => ({
        ...prev,
        captainStatus: newStatus,
        orderStatus: newStatus === 'Delivered' ? 'Delivered' : prev?.orderStatus,
      }));

      if (newStatus === 'Delivered') {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Status Updates for Return Mission ──
  const handleUpdateReturnStatus = async (newStatus) => {
    if (!activeItem) return;
    setStatusUpdating(true);
    try {
      const returnId = activeItem._id || activeItem.returnId;
      const res = await returnService.captainUpdateReturnStatus(returnId, newStatus);
      setActiveItem(res.returnRequest || { ...activeItem, status: newStatus });
      setCurrentStep(RETURN_STEP_MAP[newStatus] || 1);
      if (newStatus === 'RECEIVED_BY_SELLER' || newStatus === 'DELIVERED_TO_SELLER') {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Return status update error:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update return status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Status Updates for Transport Mission ──
  const handleUpdateTransportStatus = async (newStatus) => {
    if (!activeItem) return;
    setStatusUpdating(true);
    try {
      const bookingId = activeItem._id || activeItem.bookingId;
      const res = await transportService.captainUpdateStatus(bookingId, newStatus);
      setActiveItem(res.booking || { ...activeItem, status: newStatus });
      setCurrentStep(TRANSPORT_STEP_MAP[newStatus] || 1);
      if (newStatus === 'RIDE_COMPLETED') {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Transport status update error:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update transport status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Verify Return Pickup OTP with Quality Inspection ──
  const handleVerifyReturnOtp = async () => {
    const allChecked =
      returnChecklist.correctItem &&
      returnChecklist.undamaged &&
      returnChecklist.originalTagsPresent &&
      returnChecklist.packagingIntact;

    if (!allChecked) {
      setOtpError('Please verify and confirm all 4 quality inspection checklist items before proceeding.');
      return;
    }

    const otpStr = otpDigits.join('');
    if (otpStr.length < 4) {
      setOtpError('Please enter the 4-digit Return OTP.');
      return;
    }

    setVerifyingOtp(true);
    setOtpError('');
    try {
      const returnId = activeItem._id || activeItem.returnId;
      const res = await returnService.captainVerifyReturnOtp(
        returnId,
        otpStr,
        returnChecklist.notes || '',
        proofUrl,
        returnChecklist
      );
      setActiveItem(res.returnRequest || { ...activeItem, status: 'PICKED_UP' });
      setCurrentStep(RETURN_STEP_MAP['PICKED_UP'] || 3);
      setShowReturnOtpModal(false);
      setOtpDigits(['', '', '', '']);
    } catch (err) {
      setOtpError(err?.response?.data?.message || err?.message || 'Invalid Return OTP. Customer must provide the 4-digit code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── Fail Doorstep Quality Inspection ──
  const handleFailReturnInspection = async () => {
    if (!failReason || !failReason.trim()) {
      alert('Please select or specify the reason for inspection failure.');
      return;
    }
    setFailingInspection(true);
    try {
      const returnId = activeItem._id || activeItem.returnId;
      const res = await returnService.captainFailInspection(returnId, failReason, returnChecklist.notes);
      setActiveItem(res.returnRequest || { ...activeItem, status: 'VERIFICATION_FAILED' });
      setShowFailReasonModal(false);
      setShowReturnOtpModal(false);
      alert('Return pickup marked as failed due to quality inspection.');
      navigate('/captain/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to submit inspection failure.');
    } finally {
      setFailingInspection(false);
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

  // ── Verify Pickup OTP (Transport Stage 1) ──
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

  // ── Verify Drop OTP & Complete (Transport Stage 2) ──
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
    const phone = isReturn
      ? (activeItem.customer?.phone || activeItem.user?.phone || activeItem.pickupAddress?.phone || activeItem.seller?.phone)
      : isTransport
      ? activeItem?.user?.phone
      : activeItem?.shippingAddress?.phone || activeItem?.user?.phone;
    if (phone) window.location.href = `tel:${phone}`;
    else setShowCallingModal(true);
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
          You don't have any active trip right now. Accept a return pickup, transport request, or job from your queue.
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
  const tripId = isReturn
    ? activeItem.returnId || (activeItem._id ? `RET-${activeItem._id.toString().slice(-6).toUpperCase()}` : 'RETURN')
    : isTransport
    ? activeItem.bookingId
    : activeItem.orderId;

  const recipientName = isReturn
    ? (activeItem.seller?.storeName || activeItem.seller?.name || 'Seller Warehouse')
    : isTransport
    ? activeItem.user?.name || 'Transport Customer'
    : activeItem.shippingAddress?.fullName || activeItem.user?.name || 'Customer';

  const recipientPhone = isReturn
    ? (activeItem.seller?.phone || activeItem.customer?.phone || '')
    : isTransport
    ? activeItem.user?.phone || ''
    : activeItem.shippingAddress?.phone || activeItem.user?.phone || '';

  const customerName = isReturn
    ? (activeItem.customer?.name || activeItem.user?.name || activeItem.pickupAddress?.fullName || 'Customer')
    : null;

  const customerPhone = isReturn
    ? (activeItem.customer?.phone || activeItem.user?.phone || activeItem.pickupAddress?.phone || '')
    : null;

  const pickupAddress = isReturn
    ? (typeof activeItem.pickupAddress === 'string'
        ? activeItem.pickupAddress
        : activeItem.pickupAddress
        ? `${activeItem.pickupAddress.addressLine1 || activeItem.pickupAddress.street || ''}, ${activeItem.pickupAddress.city || ''} ${activeItem.pickupAddress.pincode || ''}`
        : 'Customer Pickup Address')
    : isTransport
    ? activeItem.pickupLocation?.address
    : 'Seller Warehouse';

  const dropAddress = isReturn
    ? (activeItem.seller?.storeAddress || activeItem.seller?.address || `${activeItem.seller?.storeName || 'Seller'} Store / Warehouse`)
    : isTransport
    ? activeItem.dropLocation?.address
    : `${activeItem.shippingAddress?.addressLine1}, ${activeItem.shippingAddress?.city}`;

  const payout = isReturn
    ? (activeItem.captainFee || 60)
    : (activeItem.captainEarnings || 0);

  const statusBadgeText = isReturn
    ? activeItem.status
    : isTransport
    ? activeItem.status
    : activeItem.captainStatus;

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
              {isReturn ? 'Return Pickup Nav' : isTransport ? 'Transport Ride' : 'Delivery Nav'}
            </h1>
            <p className="text-[9px] md:text-[10px] text-[#97fc43] uppercase font-bold tracking-widest mt-0.5">
              #{tripId} • {isReturn ? 'Reverse Logistics' : isTransport ? 'Goods Haulage' : 'Standard'}
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
              {isReturn ? 'Active Return Pickup Mission' : isTransport ? 'Active Transport Ride' : 'Active Product Delivery'}
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
            <span className="text-xs font-bold text-primary">
              {isReturn ? 'Call Customer' : isTransport ? 'Call Customer' : 'Call Customer'}
            </span>
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

        {/* Delivery Navigation Map */}
        {(pickupCoords || dropCoords || captainCoords) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-base">map</span>
                <h3 className="font-label-sm text-[10px] font-black text-[#047857] uppercase tracking-wider">
                  LIVE DIRECTIONS
                </h3>
              </div>
              <button
                onClick={async () => {
                  try {
                    const coords = await getCurrentLocation();
                    setCaptainCoords(coords);
                  } catch (err) {
                    console.error('Error updating location:', err);
                  }
                }}
                className="p-1.5 bg-[#047857] hover:bg-[#035d45] text-white rounded-lg transition-colors"
                title="Refresh your location"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
            </div>
            <DeliveryMap
              pickupLocation={pickupCoords}
              dropLocation={dropCoords}
              captainLocation={captainCoords}
            />
          </div>
        )}

        {loadingCoords && (
          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs text-center">
            <p className="text-xs text-slate-600">Loading map location...</p>
          </div>
        )}

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[#047857] text-base">
                {isReturn ? 'person_pin_circle' : 'warehouse'}
              </span>
              <span className="font-label-sm text-[10px] font-black text-[#047857] uppercase tracking-wider">
                {isReturn ? 'CUSTOMER PICKUP ADDRESS' : 'PICKUP LOCATION'}
              </span>
            </div>
            {isReturn && customerName && (
              <p className="font-bold text-xs text-slate-800">{customerName} {customerPhone ? `(${customerPhone})` : ''}</p>
            )}
            <p className="font-extrabold text-sm text-on-surface leading-snug">{pickupAddress}</p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[#ff5500] text-base">store</span>
              <span className="font-label-sm text-[10px] font-black text-[#ff5500] uppercase tracking-wider">
                {isReturn ? 'SELLER RETURN DESTINATION' : 'DROP-OFF DESTINATION'}
              </span>
            </div>
            <p className="font-extrabold text-sm text-on-surface leading-snug">{recipientName}</p>
            <p className="text-on-surface-variant text-xs truncate">{dropAddress}</p>
          </div>
        </div>

        {/* Return Item Details Card */}
        {isReturn && (
          <div className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                ITEM TO COLLECT
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                Order #{activeItem.orderId || (activeItem.order?._id ? activeItem.order._id.slice(-6) : '')}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              {activeItem.productImage && (
                <img
                  src={activeItem.productImage}
                  alt={activeItem.productName}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{activeItem.productName || 'Returned Product'}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quantity: <span className="font-bold text-slate-800">{activeItem.quantity || 1}</span> • Refund Est: <span className="font-bold text-[#15803d]">₹{activeItem.refundAmount || 0}</span>
                </p>
                {activeItem.reason && (
                  <p className="text-[10px] text-red-600 font-medium mt-0.5 truncate">
                    Reason: {activeItem.reason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
            {isReturn ? 'Return Reverse Pickup Milestones' : isTransport ? 'Transport Ride Milestones' : 'Product Delivery Progress'}
          </h3>

          {/* Return Milestones */}
          {isReturn ? (
            <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
              {[
                { step: 1, label: 'Captain Assigned / Pickup Started', sub: 'Proceeding to customer address for doorstep collection' },
                { step: 2, label: 'Arrived at Customer', sub: 'Inspect item & verify 4-digit Customer Return OTP' },
                { step: 3, label: 'Item Picked Up & In Transit', sub: 'Transporting returned item to seller store / warehouse' },
                { step: 4, label: 'Delivered to Seller', sub: 'Handed over to seller for inspection & payout credited' },
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
          ) : isTransport ? (
            // Transport Milestones
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
                { step: 1, label: 'Order Accepted', sub: 'Proceed to store / seller' },
                { step: 2, label: 'Reached Store', sub: 'Collecting packages from seller (No OTP needed)' },
                { step: 3, label: 'Out for Delivery', sub: 'En route to customer drop location' },
                { step: 4, label: 'Delivered', sub: 'Package handed over & payout credited' },
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
            {/* Return Action 1: Start Pickup Route */}
            {isReturn && (activeItem.status === 'CAPTAIN_ASSIGNED' || activeItem.status === 'APPROVED') && (
              <button
                onClick={() => handleUpdateReturnStatus('PICKUP_STARTED')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">navigation</span>
                )}
                Start Pickup Route to Customer
              </button>
            )}

            {/* Return Action 2: Mark Arrived at Customer */}
            {isReturn && activeItem.status === 'PICKUP_STARTED' && (
              <button
                onClick={() => handleUpdateReturnStatus('PICKUP_ARRIVED')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">location_on</span>
                )}
                Arrived at Customer Doorstep
              </button>
            )}

            {/* Return Action 3: Enter Customer Return OTP & Quality Inspection */}
            {isReturn && activeItem.status === 'PICKUP_ARRIVED' && (
              <button
                onClick={() => {
                  setOtpDigits(['', '', '', '']);
                  setOtpError('');
                  setShowReturnOtpModal(true);
                }}
                className="w-full py-3.5 bg-[#366b00] hover:bg-[#2d5800] text-white rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
              >
                <span className="material-symbols-outlined text-base">verified_user</span>
                Inspect Quality Checklist & Verify Return OTP
              </button>
            )}

            {/* Return Action 4: Transit to Seller */}
            {isReturn && activeItem.status === 'PICKED_UP' && (
              <button
                onClick={() => handleUpdateReturnStatus('IN_TRANSIT_TO_SELLER')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-[#002625] hover:bg-[#003837] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                )}
                Start Route to Seller Store / Warehouse
              </button>
            )}

            {/* Return Action 5: Deliver to Seller Store */}
            {isReturn && (activeItem.status === 'IN_TRANSIT_TO_SELLER' || activeItem.status === 'PICKED_UP') && (
              <button
                onClick={() => handleUpdateReturnStatus('RECEIVED_BY_SELLER')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">task_alt</span>
                )}
                Hand Over to Seller & Complete Return Pickup
              </button>
            )}

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

            {/* Quick Complete / Bypass Button for Captains */}
            {isTransport && activeItem.status !== 'RIDE_COMPLETED' && (
              <button
                onClick={() => handleUpdateTransportStatus('RIDE_COMPLETED')}
                disabled={statusUpdating}
                className="w-full py-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#15803d] border border-slate-200 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                Complete Ride & Credit Wallet (₹{payout.toFixed(2)})
              </button>
            )}

            {/* ── Standard Product Delivery Actions (NO OTP REQUIRED) ── */}
            {!isTransport && !isReturn && activeItem.captainStatus === 'Accepted' && (
              <button
                onClick={() => handleUpdateOrderStatus('At Pickup')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">store</span>
                )}
                Arrived at Store / Pickup
              </button>
            )}

            {!isTransport && !isReturn && activeItem.captainStatus === 'At Pickup' && (
              <button
                onClick={() => handleUpdateOrderStatus('In Transit')}
                disabled={statusUpdating}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? (
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                )}
                Pick Up Package & Start Delivery
              </button>
            )}

            {!isTransport && !isReturn &&
              (activeItem.captainStatus === 'In Transit' || activeItem.captainStatus === 'Picked Up') && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpdateOrderStatus('Delivered')}
                    disabled={statusUpdating}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {statusUpdating ? (
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                    ) : (
                      <span className="material-symbols-outlined text-base">task_alt</span>
                    )}
                    Complete Delivery & Mark Delivered
                  </button>
                </div>
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
            <p className="font-bold text-primary">
              {isReturn ? 'Return Delivery Fee' : isTransport ? 'Transport Fare' : 'Delivery Fee'}
            </p>
            <p>{activeItem.paymentMethod || 'Prepaid'}</p>
          </div>
        </div>
      </main>

      {/* ── MODAL: PRODUCT QUALITY INSPECTION & RETURN OTP VERIFICATION (Return Pickup Only) ── */}
      {showReturnOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-5 sm:p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-4 my-auto border border-slate-100">
            {/* Header matching screenshot */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-600 text-lg">verified_user</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
                    Product Quality Inspection Checklist
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Verify product condition before accepting return</p>
                </div>
              </div>
              <button
                onClick={() => setShowReturnOtpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Product Summary Banner */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              {activeItem.productImage ? (
                <img
                  src={activeItem.productImage}
                  alt={activeItem.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-orange-500 text-xl">inventory_2</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{activeItem.productName || 'Returned Product'}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>Qty: <strong className="text-slate-800">{activeItem.quantity || 1}</strong></span>
                  <span>•</span>
                  <span>Order: <strong className="text-slate-800">#{activeItem.orderId}</strong></span>
                </div>
              </div>
            </div>

            {/* Inspection Checklist Grid (Matching the Screenshot) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                Doorstep Quality Checks (Must Confirm All)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  returnChecklist.correctItem ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={returnChecklist.correctItem}
                    onChange={(e) => setReturnChecklist((prev) => ({ ...prev, correctItem: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#15803d] focus:ring-emerald-500 cursor-pointer accent-[#15803d]"
                  />
                  <span className="font-bold text-xs">Correct Product & Variant</span>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  returnChecklist.undamaged ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={returnChecklist.undamaged}
                    onChange={(e) => setReturnChecklist((prev) => ({ ...prev, undamaged: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#15803d] focus:ring-emerald-500 cursor-pointer accent-[#15803d]"
                  />
                  <span className="font-bold text-xs">No Physical Damage</span>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  returnChecklist.originalTagsPresent ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={returnChecklist.originalTagsPresent}
                    onChange={(e) => setReturnChecklist((prev) => ({ ...prev, originalTagsPresent: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#15803d] focus:ring-emerald-500 cursor-pointer accent-[#15803d]"
                  />
                  <span className="font-bold text-xs">Original Tags & Labels Intact</span>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  returnChecklist.packagingIntact ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={returnChecklist.packagingIntact}
                    onChange={(e) => setReturnChecklist((prev) => ({ ...prev, packagingIntact: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#15803d] focus:ring-emerald-500 cursor-pointer accent-[#15803d]"
                  />
                  <span className="font-bold text-xs">Original Packaging Available</span>
                </label>
              </div>
            </div>

            {/* Inspection Notes (Optional) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Inspection Notes (Optional):</label>
              <textarea
                value={returnChecklist.notes}
                onChange={(e) => setReturnChecklist((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes regarding condition, packaging, or inspection..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#366b00] focus:ring-1 focus:ring-[#366b00] resize-none"
              />
            </div>

            {/* Optional Photo Proof */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-[#366b00]">
                {capturedPhoto ? 'check_circle' : 'photo_camera'}
              </span>
              {capturedPhoto ? 'Package Condition Photo Attached ✓' : 'Take Return Item Condition Photo (Optional)'}
            </button>

            {/* 4-Digit Return OTP Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#366b00]">pin</span>
                  Enter Customer Return OTP
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Ask Customer</span>
              </div>

              <div className="flex justify-between gap-2 max-w-xs mx-auto py-1">
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
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-xl sm:text-2xl font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:border-[#366b00] focus:ring-2 focus:ring-[#97fc43]/30 outline-none"
                  />
                ))}
              </div>
              {otpError && <p className="text-center text-xs text-red-500 font-semibold">{otpError}</p>}
            </div>

            {/* Action Buttons: Fail Inspection vs Pass Inspection & Verify OTP */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowFailReasonModal(true)}
                disabled={verifyingOtp}
                className="flex-1 py-3 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
                Fail Inspection
              </button>

              <button
                type="button"
                onClick={handleVerifyReturnOtp}
                disabled={verifyingOtp || otpDigits.join('').length < 4}
                className="flex-[2] py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? (
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-base">package_2</span>
                )}
                {verifyingOtp ? 'Verifying OTP…' : 'Pass Inspection & Confirm Pickup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: FAIL INSPECTION REASON ── */}
      {showFailReasonModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-rose-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                Reject / Fail Return Inspection
              </h3>
              <button
                onClick={() => setShowFailReasonModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Please select or enter why this return item cannot be accepted from the customer.
            </p>

            <div className="space-y-1.5">
              {[
                'Physical damage / broken item',
                'Wrong product or variant provided',
                'Original tags / labels missing or torn',
                'Original box / packaging missing',
                'Used / altered / counterfeit condition',
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setFailReason(reason)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    failReason === reason
                      ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              placeholder="Or type specific rejection reason..."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 resize-none"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFailReasonModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFailReturnInspection}
                disabled={failingInspection || !failReason.trim()}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {failingInspection ? 'Submitting…' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: PICKUP OTP VERIFICATION (Transport Only) ── */}
      {showPickupOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#366b00]">pin</span>
                Enter Transport Pickup OTP
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

      {/* ── MODAL 2: DROP OTP VERIFICATION (Transport Only) ── */}
      {showDropOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff5500]">verified</span>
                Enter Transport Drop OTP
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
            <h2 className="font-headline-lg font-extrabold text-2xl text-slate-900">
              {isReturn ? 'Return Delivered to Seller!' : isTransport ? 'Ride Completed!' : 'Order Delivered!'}
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              {isReturn
                ? 'Returned item successfully handed over to seller.'
                : isTransport
                ? 'Transport verified and finished.'
                : 'Product order successfully delivered.'}{' '}
              Your payout of{' '}
              <span className="font-bold text-[#15803d]">₹{payout.toFixed(2)}</span> has been credited to your wallet.
            </p>
            <div className="space-y-2 pt-2">
              {!isReturn && (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowCaptainRatingModal(true);
                  }}
                  className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-xl shadow-md cursor-pointer transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">star</span>
                  <span>Rate Customer ({recipientName})</span>
                </button>
              )}
              <button
                onClick={() => navigate('/captain/dashboard')}
                className="w-full py-2.5 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold rounded-xl cursor-pointer transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captain Rates User Modal */}
      <RatingModal
        isOpen={showCaptainRatingModal}
        onClose={() => {
          setShowCaptainRatingModal(false);
          navigate('/captain/dashboard');
        }}
        ride={activeItem}
        role="captain"
        onSuccess={() => {
          setShowCaptainRatingModal(false);
          navigate('/captain/dashboard');
        }}
      />

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
