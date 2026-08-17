import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService } from '../../../services/authService';
import API from '../../../services/api';

const FinalVerification = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await captainService.getActiveDelivery();
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Fetch active order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');
      if (value && index < 3) {
        const next = document.getElementById(`otp-input-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-input-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpStr = otp.join('');
    if (otpStr.length < 4) {
      setOtpError('Please enter the 4-digit OTP.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const orderId = order?.orderId || order?._id;
      await captainService.verifyDeliveryOtp(orderId, otpStr);
      setOtpVerified(true);
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Invalid OTP. Please ask the recipient.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setProofUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setCapturedPhoto(base64);
      setProofUrl(base64);
      setProofUploading(false);
    };
    reader.onerror = () => {
      setProofUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteDelivery = async () => {
    if (!otpVerified) {
      setOtpError('Please verify the customer OTP first.');
      return;
    }
    const orderId = order?.orderId || order?._id;
    setCompleting(true);
    try {
      // Submit proof if captured
      if (proofUrl) {
        await captainService.submitProofOfDelivery(orderId, proofUrl);
      }
      // Mark as Delivered with proof
      await captainService.updateDeliveryStatus(orderId, 'Delivered', { proofOfDeliveryUrl: proofUrl || '' });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Complete delivery error:', err);
      alert(err?.response?.data?.message || 'Failed to complete delivery. Try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-secondary animate-spin">sync</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">task_alt</span>
        <h2 className="font-bold text-lg text-primary">No Active Delivery</h2>
        <p className="text-sm text-on-surface-variant">No active delivery to verify. Accept a job first.</p>
        <button onClick={() => navigate('/captain/jobs')} className="mt-2 px-6 py-3 bg-secondary text-white font-bold text-sm rounded-xl cursor-pointer">
          View Jobs
        </button>
      </div>
    );
  }

  const recipientName = order.shippingAddress?.fullName || order.user?.name || 'Customer';
  const recipientPhone = order.shippingAddress?.phone || order.user?.phone || '';
  const recipientAddress = `${order.shippingAddress?.addressLine1 || ''}, ${order.shippingAddress?.city || ''}`;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-28 relative">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/captain/active-delivery')} className="p-1 rounded-lg hover:bg-surface-container-high text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-md text-base font-bold text-primary leading-tight">ShippNex</h1>
            <p className="font-label-sm text-xs text-on-surface-variant">Active Delivery: #{order.orderId}</p>
          </div>
        </div>
        <button onClick={() => navigate('/captain/notifications')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:opacity-80 cursor-pointer">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <main className="container mx-auto px-4 pt-20 max-w-2xl relative z-10 space-y-6">
        <section>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">Final Verification</h2>
          <p className="text-on-surface-variant text-sm">Confirm drop-off details to complete the mission.</p>
        </section>

        {/* Recipient & Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold">Recipient</p>
                <h3 className="font-headline-md text-lg font-bold text-primary">{recipientName}</h3>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span className="font-medium">{recipientAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base">call</span>
                <span className="font-medium">{recipientPhone}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60 flex flex-col justify-between">
            <div>
              <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold mb-2">Items ({order.items?.length || 0})</p>
              <ul className="space-y-1.5 text-xs">
                {(order.items || []).slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-on-surface-variant truncate">{item.name}</span>
                    <span className="font-bold text-primary ml-2">x{item.quantity}</span>
                  </li>
                ))}
                {(order.items?.length || 0) > 4 && (
                  <li className="text-on-surface-variant text-[10px]">+ {order.items.length - 4} more items</li>
                )}
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-base text-secondary">payments</span>
                <span>Your Payout: ₹{(order.captainEarnings || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60">
          <h4 className="font-headline-md font-bold text-base text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">pin</span>
            Customer OTP
            {otpVerified && <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>}
          </h4>
          <p className="text-on-surface-variant text-xs mb-4">Ask the recipient for the 4-digit delivery security code.</p>
          <div className="flex justify-between gap-3 max-w-xs mx-auto">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                placeholder="•"
                disabled={otpVerified}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border ${
                  otpVerified ? 'border-secondary bg-secondary/10' : 'border-outline-variant/40 bg-surface-container-low'
                } focus:border-secondary focus:ring-2 focus:ring-secondary-container transition-all outline-none`}
              />
            ))}
          </div>
          {otpError && <p className="text-center text-xs text-error mt-2 font-semibold">{otpError}</p>}
          {!otpVerified && (
            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.join('').length < 4}
              className="w-full mt-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              {verifyingOtp ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">verified</span>}
              {verifyingOtp ? 'Verifying…' : 'Verify OTP'}
            </button>
          )}
          {otpVerified && (
            <p className="text-center text-xs text-secondary font-bold mt-3 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              OTP Verified Successfully
            </p>
          )}
        </div>

        {/* Proof of Delivery */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60">
          <h4 className="font-headline-md font-bold text-base text-primary mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">photo_camera</span>
            Proof of Delivery
            {proofUrl && <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>}
          </h4>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-all group cursor-pointer"
            >
              {proofUploading ? (
                <span className="material-symbols-outlined text-3xl text-secondary animate-spin">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary">add_a_photo</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">Capture Photo</span>
                </>
              )}
            </button>

            {capturedPhoto && (
              <div className="relative aspect-square rounded-xl overflow-hidden group shadow-md bg-slate-100">
                <img className="w-full h-full object-cover" alt="Package proof" src={capturedPhoto} />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-primary/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs gap-1"
                >
                  <span className="material-symbols-outlined text-xl">refresh</span>
                  <span>Retake Photo</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Complete Button */}
        <div className="mt-8 mb-6">
          <button
            onClick={handleCompleteDelivery}
            disabled={completing || !otpVerified}
            className="w-full py-4 bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-md font-bold text-base rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {completing ? (
              <span className="material-symbols-outlined animate-spin font-bold">sync</span>
            ) : (
              <span className="material-symbols-outlined font-bold">check_circle</span>
            )}
            {completing ? 'Completing Delivery…' : 'Complete Delivery'}
          </button>
          <p className="text-center mt-3 text-on-surface-variant text-xs">
            {otpVerified ? 'Delivery will be marked as complete and payout credited.' : 'Verify OTP first before completing.'}
          </p>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/30 backdrop-blur-xl transition-all">
          <div className="glass-panel w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center border-white/80 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-secondary">task_alt</span>
            </div>
            <h2 className="font-headline-lg font-extrabold text-2xl text-primary">Excellent Work!</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Delivery verified and closed. Your payout of{' '}
              <span className="font-bold text-secondary">₹{(order.captainEarnings || 0).toFixed(2)}</span>{' '}
              has been credited to your wallet.
            </p>
            <button onClick={() => navigate('/captain/dashboard')} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <CaptainBottomNav />
    </div>
  );
};

export default FinalVerification;
