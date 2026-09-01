import React, { useState, useEffect, useRef } from 'react';

/**
 * IncomingGigModal
 * Compact, beautiful white modal overlay with minimal border radius.
 * Displays: Pickup -> Drop, Distance, Earnings, [REJECT], and [ACCEPT].
 * Automatically plays /DeliveryAppRing.mpeg in a loop until accepted, rejected, or closed.
 */
const IncomingGigModal = ({
  job,
  onAccept,
  onReject,
  onClose,
  actionLoading = false,
}) => {
  if (!job) return null;

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const webAudioIntervalRef = useRef(null);

  const pickupAddress =
    (typeof job.pickupLocation === 'string' ? job.pickupLocation : job.pickupLocation?.address) ||
    (typeof job.pickup === 'string' ? job.pickup : job.pickup?.address) ||
    job.items?.[0]?.seller ||
    'Pickup Location';

  const dropAddress =
    (typeof job.dropLocation === 'string' ? job.dropLocation : job.dropLocation?.address) ||
    (typeof job.drop === 'string' ? job.drop : job.drop?.address) ||
    job.shippingAddress?.fullName ||
    job.customerName ||
    'Drop Destination';

  const earnings = job.captainEarnings || job.estimatedEarnings || job.earnings || 0;
  const distance = job.distanceKm ? `${job.distanceKm} KM` : null;
  const tripId = job.bookingId || job.orderId || 'REQUEST';

  // Play Delivery App Ringtone
  const playRingtone = () => {
    if (isMuted) return;

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/DeliveryAppRing.mpeg');
        audioRef.current.loop = true;
      }
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn('[Captain Audio Autoplay prevented, starting chime fallback]:', e.message);
          triggerWebAudioChime();
        });
      }
    } catch (err) {
      triggerWebAudioChime();
    }
  };

  const triggerWebAudioChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (webAudioIntervalRef.current) {
      clearInterval(webAudioIntervalRef.current);
      webAudioIntervalRef.current = null;
    }
  };

  useEffect(() => {
    playRingtone();
    return () => {
      stopRingtone();
    };
  }, [job]);

  const handleAcceptClick = () => {
    stopRingtone();
    if (onAccept) onAccept(job);
  };

  const handleRejectClick = () => {
    stopRingtone();
    if (onReject) onReject(job);
  };

  const handleCloseClick = () => {
    stopRingtone();
    if (onClose) onClose(job);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.play().catch(() => triggerWebAudioChime());
      } else {
        playRingtone();
      }
    } else {
      setIsMuted(true);
      stopRingtone();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      <div
        className="bg-white w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col ring-4 ring-emerald-500/20"
        style={{ animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="bg-white px-3.5 py-2.5 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#15803d] flex items-center justify-center font-bold border border-emerald-100 animate-pulse">
              <span className="material-symbols-outlined text-base">local_shipping</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-[#15803d] tracking-wider block leading-tight">
                NEW RIDE REQUEST
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-800 block leading-tight">
                #{tripId}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Mute/Unmute Ringtone Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors border-none"
              title={isMuted ? 'Unmute Ring' : 'Mute Ring'}
            >
              <span className="material-symbols-outlined text-sm">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseClick}
              disabled={actionLoading}
              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors border-none"
              title="Close"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 space-y-2.5 bg-white">
          {/* Earnings Card */}
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70 flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
              YOUR EARNINGS
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-emerald-700">₹</span>
              <span className="text-2xl font-black text-[#15803d] leading-none font-mono">
                {Number(earnings).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Route (Pickup -> Drop) with sleek timeline */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            {/* Pickup */}
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#047857] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[10px] font-bold">storefront</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8px] font-black text-[#047857] uppercase tracking-wider block leading-none">
                  PICKUP
                </span>
                <p className="font-bold text-[11px] text-slate-900 leading-snug truncate mt-0.5">
                  {pickupAddress}
                </p>
              </div>
            </div>

            {/* Subtle Route Line */}
            <div className="flex items-center pl-2 my-0">
              <div className="w-0.5 h-2 bg-slate-300 rounded-full"></div>
            </div>

            {/* Drop */}
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-100 text-[#ff5500] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[10px] font-bold">location_on</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8px] font-black text-[#ff5500] uppercase tracking-wider block leading-none">
                  DROP
                </span>
                <p className="font-bold text-[11px] text-slate-900 leading-snug truncate mt-0.5">
                  {dropAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Distance Tag */}
          {distance && (
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100/70 py-1 rounded-lg">
              <span className="material-symbols-outlined text-xs text-slate-400">straighten</span>
              <span>Distance: {distance}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: REJECT & ACCEPT (Text Only) */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <button
            onClick={handleRejectClick}
            disabled={actionLoading}
            className="flex-1 py-2.5 px-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-95 shadow-2xs"
          >
            REJECT
          </button>

          <button
            onClick={handleAcceptClick}
            disabled={actionLoading}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-black text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-60"
          >
            {actionLoading ? 'ACCEPTING…' : 'ACCEPT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingGigModal;
