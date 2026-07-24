import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const FinalVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
  );
  const fileInputRef = useRef(null);

  // OTP input handler
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedPhoto(imageUrl);
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Confetti Simulation & Completion
  const handleCompleteDelivery = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-28 relative">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/driver/navigation-active')}
            className="p-1 rounded-lg hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
            <img
              className="w-full h-full object-cover"
              alt="Driver Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhzgud08TZO21OdBKeCjb2b91L6vn6dK8-uh427LX-yN_m6Xreq3I9xfuK-yJn41qZdY2a1jPcdTzf_uQ2yoR0Uj8F8yud4hZ-BIwQPY6KlIMPlqteRASdNab0C6zsNpkgJlVf-XwjWXgaXTb85uHMVbXzL5EBBdNPWwGqZfIJCiJDswCUfQwfNvhj03UlzNrp-ocZfvZaRUAMtWdkrL0KZM15YHxQALSEGTFShN9FDu1rB2HHeRVFHsOhU-sPU-Pmt12NmMXrkHk"
            />
          </div>
          <div>
            <h1 className="font-headline-md text-base font-bold text-primary leading-tight">ShippNex</h1>
            <p className="font-label-sm text-xs text-on-surface-variant">Active Delivery: #SN-9921</p>
          </div>
        </div>
        <button
          onClick={() => alert('Notifications: All items clear for handoff')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <main className="container mx-auto px-4 pt-20 max-w-2xl relative z-10 space-y-6">
        {/* Header Section */}
        <section>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">Final Verification</h2>
          <p className="text-on-surface-variant text-sm">Confirm drop-off details to complete the mission.</p>
        </section>

        {/* Delivery Identity Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold">Recipient</p>
                <h3 className="font-headline-md text-lg font-bold text-primary">Sarah Jenkins</h3>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span className="font-medium">482 Industrial Pkwy, Suite 12</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base">call</span>
                <span className="font-medium">+1 (555) 012-3456</span>
              </div>
            </div>
          </div>

          {/* Package Card */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60 flex flex-col justify-between">
            <div>
              <p className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold mb-2">Inventory Items</p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-on-surface-variant">High-Precision Sensors</span>
                  <span className="font-bold text-primary">x12</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-on-surface-variant">Calibration Modules</span>
                  <span className="font-bold text-primary">x02</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-base text-secondary">verified</span>
                <span>Pre-cleared Customs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Actions */}
        <div className="space-y-6">
          {/* OTP Input */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60">
            <h4 className="font-headline-md font-bold text-base text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pin</span>
              Customer OTP
            </h4>
            <p className="text-on-surface-variant text-xs mb-4">Ask the recipient for the 4-digit security code.</p>
            <div className="flex justify-between gap-3 max-w-xs mx-auto">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  placeholder="•"
                  className="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-outline-variant/40 bg-surface-container-low focus:border-secondary focus:ring-2 focus:ring-secondary-container transition-all outline-none"
                />
              ))}
            </div>
          </div>

          {/* Proof of Delivery Photos */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-white/60">
            <h4 className="font-headline-md font-bold text-base text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              Proof of Delivery
            </h4>
            
            {/* Hidden file/camera input */}
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
                onClick={triggerCamera}
                className="aspect-square rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-all group cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary">
                  add_a_photo
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant">Capture Photo</span>
              </button>

              {capturedPhoto && (
                <div className="relative aspect-square rounded-xl overflow-hidden group shadow-md bg-slate-100">
                  <img
                    className="w-full h-full object-cover"
                    alt="Package proof"
                    src={capturedPhoto}
                  />
                  <div
                    onClick={triggerCamera}
                    className="absolute inset-0 bg-primary/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs gap-1"
                  >
                    <span className="material-symbols-outlined text-xl">refresh</span>
                    <span>Retake Photo</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Button */}
        <div className="mt-8 mb-6">
          <button
            onClick={handleCompleteDelivery}
            className="w-full py-4 bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-md font-bold text-base rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold">check_circle</span>
            Complete Delivery
          </button>
          <p className="text-center mt-3 text-on-surface-variant text-xs">
            By clicking, you confirm all items were received in good condition.
          </p>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/30 backdrop-blur-xl transition-all">
          <div className="glass-panel w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center border-white/80 animate-float space-y-4">
            <div className="w-24 h-24 mx-auto flex items-center justify-center filter drop-shadow-md">
              <img
                src="/celebration_sticker.png"
                alt="Celebration Sticker"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="font-headline-lg font-extrabold text-2xl text-primary">Excellent Work!</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Delivery verified and closed. Your payout of <span className="font-bold text-secondary">₹1,425.00</span> has been credited to your wallet.
            </p>
            <button
              onClick={() => navigate('/driver/dashboard')}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default FinalVerification;
