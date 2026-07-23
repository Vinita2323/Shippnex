import React, { useState, useRef } from 'react';
import { Phone, ArrowRight, Package, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  const handleChange = (index, value) => {
    // Only allow numbers (optional, but good UX for OTP)
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current box is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="h-[100dvh] bg-[#fdf2ec] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#ffedd5] via-[#ffedd5] to-[#f97316]/20 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col p-4 overflow-hidden">
      
      {/* Decorative Wavy Background Elements */}
      <div className="absolute -left-[100px] top-[20%] w-[300px] h-[300px] bg-[#f97316] rounded-full mix-blend-multiply filter blur-[60px] opacity-[0.15]"></div>
      <div className="absolute -right-[100px] bottom-[10%] w-[300px] h-[300px] bg-[#ea580c] rounded-full mix-blend-multiply filter blur-[60px] opacity-[0.15]"></div>

      {/* Main Floating Card */}
      <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 relative z-10 p-5 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-5 relative">
          <img src="/Logo.png" alt="Shippnex" className="h-8 object-contain ml-1 mt-1" />
          
          {/* Decorative Illustration Area */}
          <div className="relative w-16 h-16 -mr-2 opacity-90">
            <div className="absolute top-0 right-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
              <MapPin size={12} className="text-[#ea580c]" />
            </div>
            <div className="absolute bottom-0 left-0">
              <Package size={38} className="text-[#ea580c]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-[22px] font-extrabold text-[#0f172a] mb-6 tracking-tight">Welcome Back! 👋</h1>

        <div className="flex flex-col gap-4">
          {/* Phone Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold text-[#0f172a] mb-0.5">Phone Number</label>
            <div className="flex w-full h-[48px] rounded-[10px] border border-slate-200 overflow-hidden focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-100 transition-all bg-white shadow-sm group">
              <div className="w-[48px] h-full bg-[#ea580c] flex items-center justify-center shrink-0">
                <Phone size={18} color="white" />
              </div>
              <input 
                type="tel" 
                placeholder="e.g. +91 9876543210"
                className="w-full h-full bg-transparent text-[#0f172a] text-[13px] font-medium px-4 outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold text-[#0f172a] mb-0.5">One-Time Password</label>
            <div className="flex justify-between gap-2 w-full">
              {otp.map((digit, index) => (
                <input 
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text" 
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="flex-1 min-w-0 aspect-square max-h-[56px] rounded-[10px] border border-slate-200 text-center text-[#0f172a] text-[20px] font-semibold outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-orange-100 transition-all bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resend OTP */}
        <div className="flex justify-end mt-3 mb-6">
          <button className="bg-transparent border-none text-[#ea580c] text-[12px] font-extrabold cursor-pointer hover:underline">
            Resend OTP
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white border-none rounded-[10px] py-3.5 px-5 text-[14px] font-bold tracking-wide cursor-pointer shadow-[0_6px_16px_rgba(234,88,12,0.25)] transition-transform duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Log In
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>

      </div>

    </div>
  );
};

export default Login;
