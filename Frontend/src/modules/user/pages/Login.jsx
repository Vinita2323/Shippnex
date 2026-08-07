import React, { useState } from 'react';
import { Phone, ArrowRight, ArrowLeft, Package, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      await authService.sendUserOtp(phoneNumber);
      // Navigate to OTP verification page passing phone number in route state
      navigate('/verify-otp', { state: { phone: phoneNumber } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#fdf2ec] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#ffedd5] via-[#ffedd5] to-[#f97316]/20 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col p-4 overflow-hidden">
      
      {/* Decorative Wavy Background Elements */}
      <div className="absolute -left-[100px] top-[20%] w-[300px] h-[300px] bg-[#f97316] rounded-full mix-blend-multiply filter blur-[60px] opacity-[0.15]"></div>
      <div className="absolute -right-[100px] bottom-[10%] w-[300px] h-[300px] bg-[#ea580c] rounded-full mix-blend-multiply filter blur-[60px] opacity-[0.15]"></div>

      {/* Main Floating Card */}
      <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 relative z-10 p-5 flex flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden">
        
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 relative">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-slate-700 shrink-0"
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
            </button>

            <img src="/Logo.png" alt="Shippnex" className="h-20 max-w-[180px] object-contain my-1" />
            
            {/* Right side spacer for perfect center alignment */}
            <div className="w-10 flex justify-end shrink-0">
              <div className="relative w-8 h-8 opacity-90 flex items-center justify-center">
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
                  <MapPin size={8} className="text-[#ea580c]" />
                </div>
                <Package size={24} className="text-[#ea580c]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-[24px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Welcome Back! 👋</h1>
          <p className="text-[13px] text-slate-500 mb-6 font-medium">Enter your phone number to receive a 6-digit verification OTP code.</p>

          <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold text-[#0f172a] mb-0.5">Phone Number</label>
              <div className="flex w-full h-[50px] rounded-[12px] border border-slate-200 overflow-hidden focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-white shadow-sm group">
                <div className="w-[48px] h-full bg-[#ea580c] flex items-center justify-center shrink-0">
                  <Phone size={18} color="white" />
                </div>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  required
                  className="w-full h-full bg-transparent text-[#0f172a] text-[14px] font-semibold px-4 outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
              {errorMsg && <p className="text-xs text-red-500 font-semibold mt-1">{errorMsg}</p>}
            </div>

            {/* Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] disabled:opacity-60 text-white border-none rounded-[12px] py-3.5 px-5 text-[14px] font-bold tracking-wide cursor-pointer shadow-[0_6px_16px_rgba(234,88,12,0.25)] transition-transform duration-200 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-slate-400 font-normal mt-6">
          By continuing, you agree to Shippnex's Terms of Service & Privacy Policy.
        </p>

      </div>

    </div>
  );
};

export default Login;
