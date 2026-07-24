import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [statusState, setStatusState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setMobileNumber(rawVal);
    if (hasError && rawVal.length >= 10) {
      setHasError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }

    setStatusState('processing');
    setTimeout(() => {
      setStatusState('success');
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 1000);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-container-padding relative overflow-hidden bg-surface">
      {/* Background Atmospheric Element */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#002625 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      {/* Main Bento-style Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        {/* Illustration Column (Hidden on Mobile) */}
        <div className="hidden md:flex md:col-span-7 flex-col justify-center space-y-section-gap pr-gutter">
          <div className="space-y-4">
            <h1 className="font-display-lg text-display-lg text-primary text-4xl md:text-5xl font-extrabold tracking-tight">
              Industrial <br />
              <span className="text-secondary">Intelligence.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg text-lg">
              Accelerate your warehouse operations with cloud-native logistics management designed for the modern enterprise.
            </p>
          </div>

          {/* Featured Illustration Card */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-secondary-fixed/10 rounded-[32px] blur-2xl group-hover:bg-secondary-fixed/20 transition-all duration-700"></div>
            <div className="relative h-[400px] rounded-xl overflow-hidden glass-panel border-none shadow-2xl animate-float">
              <img
                className="w-full h-full object-cover"
                alt="3D isometric futuristic warehouse SaaS illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKlLxgEFYfql78D9rFab93lhosF_S8JVu8ZIUC5_LCjKCs5vL3jLO6T0EXlhpKEd4_ilo246pxGbmX6UAlkdFC_2s-Coh0MkV3K5udTmxuhMXfofxxPuw-Ae66Ri90yyszNis3eJ374LZDLIfBQRqV2Qh0ssITNTvUU6T4nITIxW1Jc-lBzGB1gU7RKUaFPrNkTD0_HVrenTAoZkUgSELJ78hfEO0Uoun1WCsk9B6HlUUB_qszyDsURaqkNd269YNT4USJwUXJ4_E"
              />

              {/* Floating Data Overlays */}
              <div className="absolute top-6 left-6 glass-panel p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">speed</span>
                </div>
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">THROUGHPUT</p>
                  <p className="font-headline-md text-xl font-bold text-primary">+24%</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 glass-panel p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-fixed">local_shipping</span>
                </div>
                <div>
                  <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">ACTIVE FLEET</p>
                  <p className="font-headline-md text-xl font-bold text-primary">1,248</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Column */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="glass-panel p-8 md:p-12 rounded-[32px] w-full border-white/40 shadow-2xl">
            {/* Brand Header */}
            <div className="mb-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-secondary-fixed active-icon">package_2</span>
                </div>
                <span className="font-headline-lg text-2xl font-bold text-primary tracking-tight">ShippNex</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-2">Welcome Back</h2>
              <p className="font-body-md text-on-surface-variant text-sm md:text-base">
                Enter your mobile number to securely access your logistics dashboard.
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-xs text-on-surface-variant ml-1 uppercase font-semibold tracking-wider" htmlFor="mobile">
                  Mobile Number
                </label>
                <div
                  className={`relative flex items-center rounded-xl transition-all duration-200 ${
                    hasError ? 'ring-2 ring-error bg-error-container/30' : 'input-focus-glow bg-surface-container-low'
                  }`}
                >
                  <div className="absolute left-4 flex items-center gap-2 pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">call</span>
                    <span className="text-on-surface-variant font-medium border-r border-outline-variant pr-2">+1</span>
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={handleInputChange}
                    placeholder="555 012 3456"
                    className="w-full bg-transparent border-none rounded-xl py-4 pl-24 pr-4 text-on-surface font-body-md focus:ring-0 placeholder:text-outline-variant outline-none"
                  />
                </div>
                {hasError && (
                  <p className="text-xs text-error ml-1">Please enter a valid 10-digit mobile number</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 font-bold cursor-pointer ${
                  statusState === 'success'
                    ? 'bg-primary text-primary-fixed shadow-primary/20'
                    : mobileNumber.length < 10
                    ? 'bg-secondary-container/60 text-on-secondary-container/60 cursor-not-allowed'
                    : 'bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container shadow-secondary-container/20'
                }`}
              >
                {statusState === 'processing' && (
                  <>
                    <span className="animate-spin material-symbols-outlined">sync</span> Processing...
                  </>
                )}
                {statusState === 'success' && (
                  <>
                    OTP Sent! <span className="material-symbols-outlined">check_circle</span>
                  </>
                )}
                {statusState === 'idle' && (
                  <>
                    Continue
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-2 flex items-center gap-4">
                <div className="flex-grow h-px bg-outline-variant/30"></div>
                <span className="font-label-sm text-xs text-outline tracking-wider">SECURE LOGIN</span>
                <div className="flex-grow h-px bg-outline-variant/30"></div>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => alert('Redirecting to Enterprise SSO Portal...')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors font-label-sm text-xs text-on-surface-variant font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  SSO Login
                </button>
                <button
                  type="button"
                  onClick={() => alert('Contacting ShippNex Dispatch Support...')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors font-label-sm text-xs text-on-surface-variant font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">help</span>
                  Support
                </button>
              </div>
            </form>

            {/* Footer Info */}
            <div className="mt-10 text-center">
              <p className="font-label-sm text-xs text-outline-variant">
                By continuing, you agree to ShippNex's <br />
                <a href="#terms" className="text-secondary hover:underline font-semibold">Terms of Service</a> and{' '}
                <a href="#privacy" className="text-secondary hover:underline font-semibold">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span className="font-label-sm text-[10px] tracking-wider font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span className="font-label-sm text-[10px] tracking-wider font-medium">AES-256</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">cloud</span>
              <span className="font-label-sm text-[10px] tracking-wider font-medium">CLOUD NATIVE</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DriverLogin;
