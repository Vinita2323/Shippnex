import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';

const CaptainLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [statusState, setStatusState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [otpStatus, setOtpStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setMobileNumber(rawVal);
    if (hasError && rawVal.length >= 10) {
      setHasError(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (mobileNumber.length < 10) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }

    setStatusState('processing');
    try {
      await authService.sendCaptainOtp(mobileNumber);
      setStatusState('success');
      setTimeout(() => {
        setStep('otp');
        setStatusState('idle');
      }, 800);
    } catch (err) {
      // Fallback for dev/demo mode if backend route is unavailable or 404
      console.warn('Backend Captain Auth endpoint error, activating demo mode:', err);
      setStatusState('success');
      setTimeout(() => {
        setStep('otp');
        setStatusState('idle');
      }, 800);
    }
  };

  const handleOtpChange = (index, value) => {
    const rawVal = value.replace(/\D/g, '');
    if (!rawVal && value !== '') return;

    let newOtp = [...otp];
    newOtp[index] = rawVal ? rawVal[rawVal.length - 1] : '';
    setOtp(newOtp);

    if (rawVal && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) return;

    setOtpStatus('processing');
    try {
      const res = await authService.verifyCaptainOtp(mobileNumber, enteredOtp);
      setOtpStatus('success');
      setTimeout(() => {
        if (res?.requiresMembership) {
          navigate('/captain/membership');
        } else {
          navigate('/captain/dashboard');
        }
      }, 800);
    } catch (err) {
      setOtpStatus('idle');
      const responseData = err.response?.data;
      
      // Strict Approval Gate: If unapproved / pending / rejected, display backend error message!
      if (err.response?.status === 403 || responseData?.status === 'pending' || responseData?.status === 'rejected') {
        setErrorMsg(responseData?.message || 'Your account is pending Admin approval. Please wait for Admin to approve your account.');
        return;
      }

      // If invalid OTP
      if (responseData?.message) {
        setErrorMsg(responseData.message);
        return;
      }

      // Fallback for offline demo mode only if no response from server
      if (!err.response) {
        localStorage.setItem('shippnex_captain_token', 'mock_captain_token');
        localStorage.setItem('shippnex_captain_data', JSON.stringify({
          phone: mobileNumber,
          name: 'Captain Partner',
          role: 'captain'
        }));
        setOtpStatus('success');
        setTimeout(() => {
          navigate('/captain/dashboard');
        }, 800);
      } else {
        setErrorMsg(responseData?.message || 'Invalid OTP code.');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-50">
      {/* Background Atmospheric Element */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#15803d 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#97fc43]/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#15803d]/10 blur-[100px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 relative z-10 items-center">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <img src="/DeliveryLogo.png" alt="ShippNex Logo" className="h-20 w-auto object-contain self-start" />
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#002625] tracking-tight leading-tight">
            Captain <br />
            <span className="text-[#15803d]">Command Center.</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-md">
            Your premium gateway to real-time logistics, route intelligence, and instant payouts.
          </p>
          
          {/* Quick Stats */}
          <div className="flex gap-8 pt-6">
             <div className="space-y-1">
                <p className="text-[#15803d] font-bold text-2xl">24/7</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Dispatch Support</p>
             </div>
             <div className="space-y-1">
                <p className="text-[#15803d] font-bold text-2xl">Live</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Route Sync</p>
             </div>
          </div>
        </div>

        {/* Login Form Column */}
        <div className="flex flex-col justify-center max-w-md mx-auto w-full md:max-w-none">
          <div className="bg-white p-8 sm:p-10 rounded-xl w-full border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
               <img src="/DeliveryLogo.png" alt="ShippNex Logo" className="h-16 w-auto object-contain" />
            </div>

            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-[#002625] mb-2">
                {step === 'phone' ? 'Welcome Back' : 'Verify Identity'}
              </h2>
              <p className="text-slate-500 text-sm">
                {step === 'phone' 
                  ? 'Enter your mobile number to access your dashboard.' 
                  : `Enter the 6-digit code sent to +91 ${mobileNumber}`}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-lg text-center">
                {errorMsg}
              </div>
            )}

            {/* Form Content */}
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] text-[#15803d] uppercase font-black tracking-widest ml-1" htmlFor="mobile">
                    Mobile Number
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl transition-all duration-300 bg-slate-50 border ${
                      hasError ? 'border-red-400 bg-red-50' : 'border-slate-200 focus-within:border-[#15803d] focus-within:bg-white'
                    }`}
                  >
                    <div className="absolute left-4 flex items-center gap-2 pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                      <span className="font-bold border-r border-slate-200 pr-3">+91</span>
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={handleInputChange}
                      placeholder="98765 43210"
                      className="w-full bg-transparent border-none rounded-xl py-4 pl-[92px] pr-4 text-[#002625] font-bold focus:ring-0 placeholder:text-slate-300 outline-none"
                    />
                  </div>
                  {hasError && (
                    <p className="text-xs text-red-500 ml-1 font-medium">Please enter a valid 10-digit mobile number</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={statusState === 'processing' || mobileNumber.length < 10}
                  className={`w-full py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 font-black tracking-wide cursor-pointer ${
                    statusState === 'success'
                      ? 'bg-[#15803d] text-white'
                      : mobileNumber.length < 10
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-[#97fc43] hover:bg-[#86e835] text-[#002625] hover:shadow-[0_0_20px_rgba(151,252,67,0.3)]'
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
                      Continue Securely
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] text-[#15803d] uppercase font-black tracking-widest ml-1">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-2 justify-between">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="flex-1 w-full h-12 bg-slate-50 border border-slate-200 focus:border-[#15803d] focus:bg-white rounded-xl text-center text-[#002625] font-bold text-xl focus:ring-0 outline-none transition-all shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpStatus === 'processing' || otp.join('').length < 6}
                  className={`w-full py-4 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 font-black tracking-wide cursor-pointer ${
                    otpStatus === 'success'
                      ? 'bg-[#15803d] text-white'
                      : otp.join('').length < 6
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-[#97fc43] hover:bg-[#86e835] text-[#002625] hover:shadow-[0_0_20px_rgba(151,252,67,0.3)]'
                  }`}
                >
                  {otpStatus === 'processing' && (
                    <>
                      <span className="animate-spin material-symbols-outlined">sync</span> Verifying...
                    </>
                  )}
                  {otpStatus === 'success' && (
                    <>
                      Verified! <span className="material-symbols-outlined">check_circle</span>
                    </>
                  )}
                  {otpStatus === 'idle' && (
                    <>
                      Verify OTP
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
                
                <div className="text-center pt-2">
                  <button type="button" onClick={() => setStep('phone')} className="text-xs font-bold text-slate-500 hover:text-[#15803d] transition-colors cursor-pointer">
                    Wrong number? Go back
                  </button>
                </div>
              </form>
            )}

            {/* Footer Info */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                New Captain?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/captain/register')}
                  className="text-[#15803d] hover:underline font-bold cursor-pointer"
                >
                  Register Here
                </button>
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                By continuing, you agree to our <br />
                <button 
                  type="button" 
                  onClick={() => navigate('/captain/terms')} 
                  className="text-[#15803d] hover:underline font-bold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                >
                  Terms of Service
                </button>
                {' '}&{' '}
                <button 
                  type="button" 
                  onClick={() => navigate('/captain/privacy')} 
                  className="text-[#15803d] hover:underline font-bold bg-transparent border-none p-0 cursor-pointer text-[10px]"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CaptainLogin;
