import React, { useState } from 'react';
import { User, Store, Image as ImageIcon, CreditCard, Edit, CheckCircle2, Save, Check, MapPin, Loader2 } from 'lucide-react';

const allStoreCategories = [
  { id: 'cat-1', label: 'Chinese Fast Food', defaultChecked: false },
  { id: 'cat-2', label: 'Beauty', defaultChecked: false },
  { id: 'cat-3', label: 'Stationary', defaultChecked: false },
  { id: 'cat-4', label: 'Toys', defaultChecked: false },
  { id: 'cat-5', label: 'Pet', defaultChecked: false },
  { id: 'cat-6', label: 'Sports', defaultChecked: false },
  { id: 'cat-7', label: 'Fruits', defaultChecked: true },
  { id: 'cat-8', label: 'Cake & Bakery', defaultChecked: false },
  { id: 'cat-9', label: 'Vagitable', defaultChecked: false },
  { id: 'cat-10', label: 'Restaurant & Food', defaultChecked: false },
  { id: 'cat-11', label: 'Fast Food', defaultChecked: true },
  { id: 'cat-12', label: 'Nonveg Items', defaultChecked: false },
  { id: 'cat-13', label: 'Wedding', defaultChecked: true },
  { id: 'cat-14', label: 'Winter', defaultChecked: false },
  { id: 'cat-15', label: 'Electronics', defaultChecked: false },
  { id: 'cat-16', label: 'Grocery', defaultChecked: true },
  { id: 'cat-17', label: 'Fashion', defaultChecked: false },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [isEditing, setIsEditing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(['Fruits', 'Fast Food', 'Wedding', 'Grocery']);

  const [formData, setFormData] = useState({
    fullName: 'Harsh shop',
    email: 'harshvardhanpanc145@gmail.com',
    mobile: '9111966732',
    newPassword: '',
    confirmPassword: '',
    storeName: 'Harshvardhan',
    storeLocation: '169, 507, Corporate House, RNT Marg, Near Central Mall, Flim Colony, South Tukoganj, Indore, Madhya Pradesh 452001, India',
    city: 'Indore',
    serviceRadius: '10 km',
    tagline: 'Fresh & Premium Quality Wholesaler',
    gstin: '07AAAAA0000A1Z5',
    fssai: '10020011004567',
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
  });

  const toggleCategory = (label) => {
    if (!isEditing) return;
    if (selectedCategories.includes(label)) {
      setSelectedCategories(selectedCategories.filter(c => c !== label));
    } else {
      setSelectedCategories([...selectedCategories, label]);
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          if (data && data.address) {
            const detectedAddress = data.display_name || `${data.address.road || ''}, ${data.address.suburb || ''}, ${data.address.city || data.address.town || data.address.state || ''}`;
            const detectedCity = data.address.city || data.address.town || data.address.state_district || 'Indore';
            
            setFormData(prev => ({
              ...prev,
              storeLocation: detectedAddress,
              city: detectedCity,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              storeLocation: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}, Central Mall, South Tukoganj, Indore, Madhya Pradesh 452001`,
              city: 'Indore'
            }));
          }
        } catch (err) {
          setFormData(prev => ({
            ...prev,
            storeLocation: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}, RNT Marg, Indore, Madhya Pradesh 452001`,
            city: 'Indore'
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert('Could not retrieve current location. Please allow location permissions in your browser or enter address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Account settings updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-xs font-normal text-slate-400 mt-0.5">Home / Settings</p>
          <p className="text-sm font-normal text-slate-500 mt-1">Manage your store preferences and profile details</p>
        </div>
        <div>
          <button 
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm"
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Tabs Sidebar + Right Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1">
            
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border-none ${
                activeTab === 'profile'
                  ? 'bg-orange-50 text-[#ff7526] border border-orange-200/80 font-semibold'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User size={18} />
              Profile Info
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border-none ${
                activeTab === 'store'
                  ? 'bg-orange-50 text-[#ff7526] border border-orange-200/80 font-semibold'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store size={18} />
              Store Details
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border-none ${
                activeTab === 'branding'
                  ? 'bg-orange-50 text-[#ff7526] border border-orange-200/80 font-semibold'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon size={18} />
              Store Branding
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border-none ${
                activeTab === 'bank'
                  ? 'bg-orange-50 text-[#ff7526] border border-orange-200/80 font-semibold'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard size={18} />
              Bank & Tax
            </button>

          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-[#ff7526] to-[#ff5500] text-white rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-md">
              ACCOUNT STATUS
            </span>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                H
              </div>
              <div>
                <h4 className="font-semibold text-base leading-tight">{formData.storeName}</h4>
                <span className="text-xs text-white/90 font-medium inline-flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={13} /> APPROVED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* TAB 1: PROFILE INFO */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  
                  {/* Avatar Banner Header */}
                  <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#ff7526] p-1 shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center font-bold text-2xl text-slate-600">
                        HS
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{formData.fullName}</h2>
                      <p className="text-sm font-normal text-slate-500 mt-0.5">{formData.email}</p>
                      <p className="text-xs font-normal text-slate-400 mt-1">Member since 2026</p>
                    </div>
                  </div>

                  {/* Profile Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Full Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Email Address</label>
                      <input 
                        type="email" 
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">New Password</label>
                      <input 
                        type="password" 
                        disabled={!isEditing}
                        placeholder="Leave blank to keep current"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                      <input 
                        type="password" 
                        disabled={!isEditing}
                        placeholder="Re-enter new password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: STORE DETAILS (EXACT FROM USER'S SCREENSHOT) */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  
                  {/* Store Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Store Name</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full max-w-md px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                    />
                  </div>

                  {/* Store Categories (Multiple selection allowed) */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Store Categories (Multiple selection allowed)</label>
                    
                    <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {allStoreCategories.map((cat) => {
                        const isChecked = selectedCategories.includes(cat.label);
                        return (
                          <div 
                            key={cat.id}
                            onClick={() => toggleCategory(cat.label)}
                            className={`p-3 rounded-xl border text-sm font-normal flex items-center gap-2.5 transition-all ${
                              isEditing ? 'cursor-pointer' : 'cursor-default'
                            } ${
                              isChecked 
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 font-medium' 
                                : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border text-xs shrink-0 ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span>{cat.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Store Location with Geolocation Fetch Button */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-slate-700">
                        Store Location <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleFetchLocation}
                        disabled={isLocating}
                        className="text-xs text-[#ff7526] hover:text-[#e65507] hover:underline flex items-center gap-1 font-semibold bg-transparent border-none cursor-pointer disabled:opacity-50"
                      >
                        {isLocating ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
                        {isLocating ? 'Detecting Location...' : 'Fetch Current Location'}
                      </button>
                    </div>

                    <textarea 
                      rows={3}
                      disabled={!isEditing}
                      value={formData.storeLocation}
                      onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all leading-relaxed" 
                    />
                  </div>

                  {/* City & Service Radius */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">City</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">
                        Service Radius (KM) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.serviceRadius}
                        onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: STORE BRANDING */}
              {activeTab === 'branding' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">Store Branding & Customization</h3>
                  
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Store Tagline</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: BANK & TAX */}
              {activeTab === 'bank' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-100">Bank & Tax Verification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">GSTIN Number</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">FSSAI License No.</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.fssai}
                        onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Bank Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Account Number</label>
                      <input 
                        type="password" 
                        disabled={!isEditing}
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit / Edit Controls */}
              {isEditing && (
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff7526] hover:bg-[#e65507] text-white rounded-lg font-medium text-sm cursor-pointer border-none shadow-sm flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
