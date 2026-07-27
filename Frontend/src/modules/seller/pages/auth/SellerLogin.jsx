import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

const SellerLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      alert('Please enter the complete 4-digit OTP sent to your phone');
      return;
    }
    // Success -> Navigate to seller dashboard
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Main Single Card Box Containing Logo & All Controls */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-200 p-8 space-y-6">
        
        {/* Card Header with Logo, Title, and Subtitle */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/Logo.png" alt="ShippNex Logo" className="h-14 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight pt-1">
            Seller Portal
          </h2>
          <p className="text-sm font-normal text-slate-500 max-w-xs mx-auto">
            Manage your warehouse, bulk orders, and stock
          </p>
        </div>

        {/* STEP 1: MOBILE NUMBER ENTRY */}
        {step === 'phone' && (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
              <div className="flex rounded-xl border border-slate-200 shadow-2xs overflow-hidden focus-within:border-[#ff7526] transition-all">
                <div className="bg-slate-50 px-3.5 flex items-center border-r border-slate-200 text-slate-600 text-sm font-medium select-none">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-3.5 py-2.5 bg-white placeholder-slate-400 text-slate-900 outline-none text-sm font-normal"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              <p className="text-xs text-slate-400 font-normal pt-0.5">An OTP will be sent to this number for login verification.</p>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp || mobileNumber.length < 10}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff7526] hover:bg-[#e65507] focus:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
            >
              {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-orange-50 text-[#ff7526] rounded-full mx-auto flex items-center justify-center border border-orange-200 mb-1">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Enter Verification Code</h3>
              <p className="text-xs text-slate-500 font-normal">
                OTP sent to <strong className="font-semibold text-slate-800">+91 {mobileNumber}</strong>{' '}
                <button 
                  type="button"
                  onClick={() => setStep('phone')} 
                  className="text-[#ff7526] font-medium underline bg-transparent border-none cursor-pointer ml-1"
                >
                  Edit
                </button>
              </p>
            </div>

            {/* 4 Digit OTP Boxes */}
            <div className="flex justify-center gap-3 py-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-[#ff7526] focus:ring-2 focus:ring-orange-100 bg-slate-50 transition-all"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-normal">
              <span>Didn't receive OTP?</span>
              <button
                type="button"
                onClick={() => alert('OTP Resent!')}
                className="text-[#ff7526] font-medium hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                <RotateCcw size={12} />
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-[#ff7526] hover:bg-[#e65507] focus:outline-none transition-colors cursor-pointer border-none"
            >
              Verify OTP & Login
              <CheckCircle2 size={17} />
            </button>
          </form>
        )}

        {/* New to ShippNex Register Callout */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400 font-normal">New to ShippNex?</span>
          </div>

          <Link
            to="/seller/register"
            className="w-full flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors text-center no-underline"
          >
            Apply for Seller Account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default SellerLogin;
