import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';
import CustomDatePicker from '../../../components/CustomDatePicker';

const AccountInfo = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem('shippnex_user_name') || 'Sarah Jenkins',
    email: localStorage.getItem('shippnex_user_email') || 'sarah.j@example.com',
    phone: localStorage.getItem('shippnex_user_phone') || '+91 98765 43210',
    dob: localStorage.getItem('shippnex_user_dob') || '1995-08-15'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('shippnex_user_name', formData.fullName);
    localStorage.setItem('shippnex_user_email', formData.email);
    localStorage.setItem('shippnex_user_phone', formData.phone);
    localStorage.setItem('shippnex_user_dob', formData.dob);
    setIsEditing(false);
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Account Information</h2>
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:hidden flex flex-col gap-6">
        
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 pl-12 pr-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors disabled:opacity-70 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 pl-12 pr-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors disabled:opacity-70 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={18} />
              </div>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[16px] py-3.5 pl-12 pr-4 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors disabled:opacity-70 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider pl-1">Date of Birth</label>
            <div className="relative z-10">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
                <Calendar size={18} />
              </div>
              <CustomDatePicker
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Select Date of Birth"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Action */}
      <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        {isEditing ? (
          <button 
            className="w-full bg-[#ea580c] text-white rounded-2xl py-4 font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform border-none shadow-[0_4px_16px_rgba(234,88,12,0.2)]"
            onClick={handleSave}
          >
            Save Changes
          </button>
        ) : (
          <button 
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform border-none shadow-[0_4px_16px_rgba(15,23,42,0.2)]"
            onClick={() => setIsEditing(true)}
          >
            Edit Information
          </button>
        )}
      </div>

    </div>
  );
};

export default AccountInfo;
