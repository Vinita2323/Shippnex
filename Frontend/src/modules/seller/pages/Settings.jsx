import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Store, Image as ImageIcon, CreditCard, Edit, CheckCircle2, Save, Check, MapPin, 
  Loader2, Upload, AlertCircle, Search, Navigation, Crown, Zap, Star, Shield, Clock, XCircle, ArrowRight, ExternalLink, Receipt,
  Eye, FileText, UploadCloud, X, FileCheck, Building2
} from 'lucide-react';
import { authService, membershipService, categoryService } from '../../../services/authService';
import { MapService } from '../../../services/MapService';
import LocationSearchModal from '../../../components/LocationSearchModal';

const durationLabel = (t) => ({ monthly: '1 Month', halfYearly: '6 Months', yearly: '12 Months' }[t] || t);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const daysLeft = (exp) => {
  if (!exp) return null;
  const diff = new Date(exp) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const defaultStoreCategories = [
  { id: 'cat-1', label: 'Grocery Essentials' },
  { id: 'cat-2', label: 'Grains & Flours' },
  { id: 'cat-3', label: 'Oil & Ghee' },
  { id: 'cat-4', label: 'Spices & Masala' },
  { id: 'cat-5', label: 'Sugar & Sweeteners' },
  { id: 'cat-6', label: 'Fruits' },
  { id: 'cat-7', label: 'Vegetables' },
  { id: 'cat-8', label: 'Ready-to-Cook' },
  { id: 'cat-9', label: 'Cake & Bakery' },
  { id: 'cat-10', label: 'Fast Food' },
  { id: 'cat-11', label: 'Personal Care' },
  { id: 'cat-12', label: 'Home Care' },
  { id: 'cat-13', label: 'Stationary' },
  { id: 'cat-14', label: 'Toys' },
  { id: 'cat-15', label: 'Pet' },
  { id: 'cat-16', label: 'Sports' },
  { id: 'cat-17', label: 'Beauty' },
  { id: 'cat-18', label: 'Electronics' },
  { id: 'cat-19', label: 'Fashion' },
];

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [membership, setMembership] = useState(null);
  const [membershipHistory, setMembershipHistory] = useState([]);

  const [availableCategories, setAvailableCategories] = useState(defaultStoreCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState({ isOpen: false, title: '', imageUrl: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    storeName: '',
    storeLocation: '',
    city: '',
    state: '',
    pincode: '',
    area: '',
    lat: null,
    lng: null,
    serviceRadius: '5',
    tagline: '',
    gstin: '',
    panNumber: '',
    fssai: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    gstPhoto: '',
    bankPassbookPhoto: '',
    storeLogo: '',
    status: 'pending',
    createdAt: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res?.categories && Array.isArray(res.categories) && res.categories.length > 0) {
        const mapped = res.categories.map((c, idx) => ({
          id: c._id || `cat-dyn-${idx}`,
          label: c.name || c.label || String(c)
        }));
        setAvailableCategories(mapped);
      }
    } catch (err) {
      console.warn('Using default store categories', err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const [res, memRes, histRes] = await Promise.all([
        authService.getSellerProfile().catch(() => null),
        membershipService.getSellerMembership().catch(() => ({ membership: null })),
        membershipService.getSellerMembershipHistory().catch(() => ({ memberships: [] })),
      ]);

      if (memRes?.membership) {
        setMembership(memRes.membership);
      } else if (res?.seller?.membership) {
        setMembership(res.seller.membership);
      } else {
        setMembership(null);
      }

      if (histRes?.memberships && Array.isArray(histRes.memberships)) {
        setMembershipHistory(histRes.memberships);
      }

      if (res && res.seller) {
        const s = res.seller;
        const coords = s.warehouseLocation?.location?.coordinates || [null, null];
        setFormData({
          fullName: s.ownerName || '',
          email: s.email || '',
          mobile: s.phone || '',
          storeName: s.businessName || '',
          storeLocation: s.warehouseLocation?.storeAddress || s.address?.line1 || '',
          city: s.warehouseLocation?.city || s.city || '',
          state: s.warehouseLocation?.state || s.state || '',
          pincode: s.warehouseLocation?.pincode || s.pincode || '',
          area: s.warehouseLocation?.area || '',
          lat: coords[1] != null && coords[1] !== 0 ? coords[1] : null,
          lng: coords[0] != null && coords[0] !== 0 ? coords[0] : null,
          serviceRadius: String(s.serviceRadius || '5'),
          tagline: s.tagline || '',
          gstin: s.gstNumber || '',
          panNumber: s.panNumber || '',
          fssai: s.fssaiLicense || '',
          bankName: s.bankName || '',
          accountNumber: s.accountNumber || '',
          ifscCode: s.ifscCode || '',
          gstPhoto: s.gstPhoto || '',
          bankPassbookPhoto: s.bankPassbookPhoto || '',
          storeLogo: s.storeLogo || '',
          status: s.status || 'approved',
          createdAt: s.createdAt ? new Date(s.createdAt).getFullYear() : '2026',
        });
        if (s.categories && Array.isArray(s.categories)) {
          setSelectedCategories(s.categories);
        } else {
          setSelectedCategories([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch seller profile:', err);
      const cached = localStorage.getItem('shippnex_seller_data');
      if (cached) {
        try {
          const s = JSON.parse(cached);
          setFormData(prev => ({
            ...prev,
            fullName: s.ownerName || s.businessName || '',
            email: s.email || '',
            mobile: s.phone || '',
            storeName: s.businessName || '',
            status: s.status || 'approved',
          }));
        } catch (e) {}
      }
      setErrorMsg('Could not fetch profile from server. Displaying cached session data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (label) => {
    if (!isEditing) return;
    if (selectedCategories.includes(label)) {
      setSelectedCategories(selectedCategories.filter(c => c !== label));
    } else {
      setSelectedCategories([...selectedCategories, label]);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, storeLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Document file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocFile = (fieldName) => {
    if (!isEditing) return;
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
  };

  // Google Maps GPS Geolocation Auto-Detection
  const handleFetchLocation = async () => {
    setIsLocating(true);
    setErrorMsg('');
    try {
      const coords = await MapService.getCurrentCoordinates();
      const detailed = await MapService.reverseGeocode(coords.lat, coords.lng);
      setFormData(prev => ({
        ...prev,
        storeLocation: detailed.formattedAddress || detailed.address,
        city: detailed.city || prev.city,
        state: detailed.state || prev.state,
        pincode: detailed.postalCode || detailed.pincode || prev.pincode,
        area: detailed.area || prev.area,
        lat: detailed.latitude || detailed.lat,
        lng: detailed.longitude || detailed.lng,
      }));
    } catch (err) {
      console.error('Google Maps location detection error:', err);
      setErrorMsg(err.message || 'Could not retrieve GPS location. Please allow permissions or search on map.');
    } finally {
      setIsLocating(false);
    }
  };

  // Callback when a location is selected from Google Maps modal
  const handleLocationModalSelect = (locationObj) => {
    if (!locationObj) return;
    setFormData(prev => ({
      ...prev,
      storeLocation: locationObj.formattedAddress || locationObj.address,
      city: locationObj.city || prev.city,
      state: locationObj.state || prev.state,
      pincode: locationObj.postalCode || locationObj.pincode || prev.pincode,
      area: locationObj.area || prev.area,
      lat: locationObj.latitude || locationObj.lat,
      lng: locationObj.longitude || locationObj.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      const payload = {
        ownerName: formData.fullName,
        email: formData.email,
        businessName: formData.storeName,
        storeAddress: formData.storeLocation,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        area: formData.area,
        lat: formData.lat,
        lng: formData.lng,
        serviceRadius: formData.serviceRadius,
        tagline: formData.tagline,
        gstNumber: formData.gstin,
        panNumber: formData.panNumber,
        fssaiLicense: formData.fssai,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        gstPhoto: formData.gstPhoto,
        bankPassbookPhoto: formData.bankPassbookPhoto,
        categories: selectedCategories,
        storeLogo: formData.storeLogo,
      };

      const res = await authService.updateSellerProfile(payload);
      if (res && res.success) {
        setSuccessMsg('Account settings updated successfully!');
        setIsEditing(false);
        if (res.seller) {
          const s = res.seller;
          const coords = s.warehouseLocation?.location?.coordinates || [null, null];
          setFormData(prev => ({
            ...prev,
            fullName: s.ownerName || prev.fullName,
            email: s.email || prev.email,
            storeName: s.businessName || prev.storeName,
            storeLocation: s.warehouseLocation?.storeAddress || prev.storeLocation,
            city: s.warehouseLocation?.city || prev.city,
            state: s.warehouseLocation?.state || prev.state,
            pincode: s.warehouseLocation?.pincode || prev.pincode,
            area: s.warehouseLocation?.area || prev.area,
            lat: coords[1] != null && coords[1] !== 0 ? coords[1] : prev.lat,
            lng: coords[0] != null && coords[0] !== 0 ? coords[0] : prev.lng,
            serviceRadius: String(s.serviceRadius || prev.serviceRadius),
            tagline: s.tagline || prev.tagline,
            gstin: s.gstNumber || prev.gstin,
            panNumber: s.panNumber || prev.panNumber,
            fssai: s.fssaiLicense || prev.fssai,
            bankName: s.bankName || prev.bankName,
            accountNumber: s.accountNumber || prev.accountNumber,
            ifscCode: s.ifscCode || prev.ifscCode,
            gstPhoto: s.gstPhoto || prev.gstPhoto,
            bankPassbookPhoto: s.bankPassbookPhoto || prev.bankPassbookPhoto,
            storeLogo: s.storeLogo || prev.storeLogo,
          }));
        }
      } else {
        setErrorMsg(res.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating seller profile:', err);
      setErrorMsg(err.response?.data?.message || 'Server error updating profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 size={36} className="animate-spin text-[#ff7526]" />
        <p className="text-sm font-medium text-slate-600">Loading your seller profile...</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
            {isEditing ? 'Editing Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

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

            <button
              type="button"
              onClick={() => setActiveTab('membership')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left border-none ${
                activeTab === 'membership'
                  ? 'bg-orange-50 text-[#ff7526] border border-orange-200/80 font-semibold'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown size={18} />
                <span>Membership Plan</span>
              </div>
              {membership?.membershipStatus === 'active' && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              )}
            </button>

          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-[#ff7526] to-[#ff5500] text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-md">
                ACCOUNT STATUS
              </span>
              {membership && (
                <span className="text-[10px] font-bold text-white bg-black/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown size={11} /> {membership.planName || 'Active Plan'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white shrink-0 overflow-hidden">
                {formData.storeLogo ? (
                  <img src={formData.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  getInitials(formData.storeName || formData.fullName)
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-base leading-tight truncate">{formData.storeName || 'Seller Store'}</h4>
                <span className="text-xs text-white/90 font-medium inline-flex items-center gap-1 mt-0.5 uppercase">
                  <CheckCircle2 size={13} /> {formData.status}
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
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#ff7526] p-1 shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center relative">
                      {formData.storeLogo ? (
                        <img src={formData.storeLogo} alt="Store Logo" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center font-bold text-2xl text-slate-600">
                          {getInitials(formData.fullName || formData.storeName)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{formData.fullName || 'Seller Profile'}</h2>
                      <p className="text-sm font-normal text-slate-500 mt-0.5">{formData.email || 'No email added'}</p>
                      <p className="text-xs font-normal text-slate-400 mt-1">Phone: +91 {formData.mobile}</p>
                    </div>
                  </div>

                  {/* Profile Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Full Name / Owner Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter full owner name"
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
                        placeholder="seller@example.com"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STORE DETAILS */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  {/* Store Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Store / Business Name</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="Enter store name"
                      className="w-full max-w-md px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                    />
                  </div>

                  {/* Store Categories (Multiple selection allowed) */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Store Categories (Multiple selection allowed)</label>
                    
                    <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {availableCategories.map((cat) => {
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

                  {/* Store Location with Geolocation Fetch & Map Search Buttons */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Store Address Location <span className="text-red-500">*</span>
                      </label>
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsLocationModalOpen(true)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer transition-colors"
                          >
                            <Search size={13} />
                            <span>Search on Map</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleFetchLocation}
                            disabled={isLocating}
                            className="text-xs text-[#ff7526] hover:text-[#e65507] flex items-center gap-1 font-bold bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-md border border-orange-200 cursor-pointer transition-colors disabled:opacity-50"
                          >
                            {isLocating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
                            <span>{isLocating ? 'Detecting...' : 'Use Current GPS'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <textarea 
                      rows={3}
                      disabled={!isEditing}
                      value={formData.storeLocation}
                      onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                      placeholder="Enter full complete store address, building, street, area..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all leading-relaxed" 
                    />

                    {formData.lat && formData.lng && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                        <Check size={12} strokeWidth={3} />
                        <span className="font-semibold">GPS Verified: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</span>
                      </div>
                    )}
                  </div>

                  {/* City, State, Pincode & Service Radius */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">City</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Indore"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">State</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Madhya Pradesh"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Pincode</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g. 452001"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">
                        Service Radius (KM) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        disabled={!isEditing}
                        value={formData.serviceRadius}
                        onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
                        placeholder="5"
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
                      placeholder="e.g. Fresh & Premium Quality Wholesaler"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-medium text-slate-700">Store Logo</label>
                    <div className="flex items-center gap-4">
                      {formData.storeLogo ? (
                        <img src={formData.storeLogo} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-medium text-xs">
                          No Logo
                        </div>
                      )}
                      {isEditing && (
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 border border-slate-200">
                          <Upload size={16} />
                          Choose Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BANK & TAX */}
              {activeTab === 'bank' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 pb-1 border-b border-slate-100 flex items-center gap-2">
                      <CreditCard size={20} className="text-[#ff7526]" />
                      Bank & Tax Verification
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage your GST, PAN, banking accounts and uploaded official verification documents
                    </p>
                  </div>
                  
                  {/* Tax Information */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tax & Business ID</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">GSTIN Number</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.gstin}
                          onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                          placeholder="e.g. 22AAAAA0000A1Z5"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all uppercase" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">PAN Number</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.panNumber}
                          onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                          placeholder="e.g. ABCDE1234F"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all uppercase" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">FSSAI License No.</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.fssai}
                          onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
                          placeholder="e.g. 10020011004567"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banking Details */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Settlement Bank Account</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">Bank Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          placeholder="e.g. HDFC Bank"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">Account Number</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.accountNumber}
                          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          placeholder="Enter bank account number"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">IFSC Code</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.ifscCode}
                          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                          placeholder="e.g. HDFC0001234"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal font-mono disabled:bg-slate-50 disabled:text-slate-600 transition-all uppercase" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Verification Documents */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Uploaded Verification Documents</h4>
                      <span className="text-[11px] text-slate-500 font-medium">Used for seller identity & business onboarding</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* GST Document Card */}
                      <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100/70 text-[#ff7526] rounded-lg">
                              <FileText size={16} />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-800">GST Registration Certificate</h5>
                              <p className="text-[10px] text-slate-400">Tax document proof</p>
                            </div>
                          </div>
                          {formData.gstPhoto ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <FileCheck size={12} /> Uploaded
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                              Not Uploaded
                            </span>
                          )}
                        </div>

                        {formData.gstPhoto ? (
                          <div className="space-y-2">
                            <div 
                              onClick={() => setPreviewDocModal({ isOpen: true, title: 'GST Registration Certificate', imageUrl: formData.gstPhoto })}
                              className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center shadow-2xs hover:border-[#ff7526] transition-all"
                            >
                              <img src={formData.gstPhoto} alt="GST Certificate" className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-200" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                <Eye size={16} />
                                <span>Click to View Fullscreen</span>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="flex items-center justify-between gap-2 pt-1">
                                <label className="flex-1 cursor-pointer bg-white hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs">
                                  <Upload size={13} />
                                  <span>Change Document</span>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileChange(e, 'gstPhoto')} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeDocFile('gstPhoto')}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                                  title="Remove GST Photo"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {isEditing ? (
                              <label className="flex flex-col items-center justify-center p-6 bg-white border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-orange-50/50 hover:border-[#ff7526] transition-all group">
                                <UploadCloud size={24} className="text-slate-400 group-hover:text-[#ff7526] transition-colors mb-1.5" />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-[#ff7526]">Upload GST Certificate</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WebP up to 5MB</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileChange(e, 'gstPhoto')} />
                              </label>
                            ) : (
                              <div className="p-6 bg-white/70 border border-slate-200 rounded-xl text-center">
                                <p className="text-xs text-slate-400">No GST document uploaded.</p>
                                <p className="text-[11px] text-[#ff7526] font-medium mt-1">Click "Edit Profile" to upload GST proof.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bank Passbook / Cheque Card */}
                      <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100/70 text-blue-600 rounded-lg">
                              <Building2 size={16} />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-800">Passbook / Cancelled Cheque</h5>
                              <p className="text-[10px] text-slate-400">Bank account verification</p>
                            </div>
                          </div>
                          {formData.bankPassbookPhoto ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <FileCheck size={12} /> Uploaded
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                              Not Uploaded
                            </span>
                          )}
                        </div>

                        {formData.bankPassbookPhoto ? (
                          <div className="space-y-2">
                            <div 
                              onClick={() => setPreviewDocModal({ isOpen: true, title: 'Bank Passbook / Cancelled Cheque', imageUrl: formData.bankPassbookPhoto })}
                              className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center shadow-2xs hover:border-[#ff7526] transition-all"
                            >
                              <img src={formData.bankPassbookPhoto} alt="Bank Passbook" className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-200" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                <Eye size={16} />
                                <span>Click to View Fullscreen</span>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="flex items-center justify-between gap-2 pt-1">
                                <label className="flex-1 cursor-pointer bg-white hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs">
                                  <Upload size={13} />
                                  <span>Change Document</span>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileChange(e, 'bankPassbookPhoto')} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeDocFile('bankPassbookPhoto')}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                                  title="Remove Passbook Photo"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {isEditing ? (
                              <label className="flex flex-col items-center justify-center p-6 bg-white border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-orange-50/50 hover:border-[#ff7526] transition-all group">
                                <UploadCloud size={24} className="text-slate-400 group-hover:text-[#ff7526] transition-colors mb-1.5" />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-[#ff7526]">Upload Passbook / Cheque</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WebP up to 5MB</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileChange(e, 'bankPassbookPhoto')} />
                              </label>
                            ) : (
                              <div className="p-6 bg-white/70 border border-slate-200 rounded-xl text-center">
                                <p className="text-xs text-slate-400">No bank passbook document uploaded.</p>
                                <p className="text-[11px] text-[#ff7526] font-medium mt-1">Click "Edit Profile" to upload bank proof.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Verification Notice */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center gap-3">
                    <Shield size={18} className="text-blue-600 shrink-0" />
                    <span className="text-xs font-medium text-blue-900">
                      All uploaded business & banking documents are encrypted and verified by Shippnex administrators for settlement and compliance.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 5: MEMBERSHIP PLAN */}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Crown size={20} className="text-[#ff7526]" />
                        Seller Membership Subscription
                      </h3>
                      <p className="text-xs font-normal text-slate-500 mt-0.5">
                        Manage your active plan, benefits, billing receipts, and upgrade options
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/seller/membership')}
                      className="px-4 py-2 bg-[#ff7526] hover:bg-[#e65507] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Zap size={14} />
                      <span>{membership ? 'Upgrade / Renew Plan' : 'Buy Membership'}</span>
                    </button>
                  </div>

                  {/* Active Plan Card */}
                  {membership ? (
                    <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 rounded-2xl border border-orange-200/80 p-6 shadow-xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff7526] to-[#ff9e66] text-white flex items-center justify-center shadow-sm shrink-0">
                            <Crown size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xl font-bold text-slate-900">
                                {membership.planName || membership.planId?.name || 'Seller Plan'}
                              </h4>
                              <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                membership.membershipStatus === 'active' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {membership.membershipStatus === 'active' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                                {membership.membershipStatus === 'active' ? 'Active' : 'Pending Confirmation'}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                              Duration: <strong className="text-slate-800">{durationLabel(membership.durationType || 'monthly')}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-3xl font-black text-slate-900">
                            ₹{membership.priceAtPurchase || membership.planId?.price || 0}
                          </span>
                          <span className="text-xs text-slate-400 block font-normal mt-0.5">Paid via {membership.paymentMethod?.toUpperCase() || 'UPI/Online'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Activation Date</span>
                          <p className="text-sm font-bold text-slate-800">{formatDate(membership.startDate || membership.createdAt)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Expiration Date</span>
                          <p className="text-sm font-bold text-slate-800">{formatDate(membership.expiryDate)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Remaining Time</span>
                          <p className="text-sm font-bold text-emerald-600">
                            {membership.expiryDate ? `${daysLeft(membership.expiryDate)} Days Left` : 'Active'}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Payment Ref</span>
                          <p className="text-xs font-mono font-bold text-slate-800 truncate" title={membership.paymentReference || membership.transactionId}>
                            {membership.paymentReference || membership.transactionId || 'Confirmed'}
                          </p>
                        </div>
                      </div>

                      {/* Included Features */}
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-700 block mb-2">Enabled Privileges on your Store:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Verified Seller Badge on marketplace</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Direct Customer Orders & Logistics Delivery</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Reduced Platform Commission</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Unlimited Inventory & Catalog Listings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-orange-100 text-[#ff7526] flex items-center justify-center mx-auto">
                        <Crown size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">No Active Membership Plan</h4>
                        <p className="text-xs font-normal text-slate-500 max-w-md mx-auto mt-1">
                          You are currently on the free tier. Subscribe to an official store membership plan to unlock order dispatches and store verification.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/seller/membership')}
                        className="px-6 py-2.5 bg-[#ff7526] hover:bg-[#e65507] text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-sm inline-flex items-center gap-2 transition-all active:scale-95"
                      >
                        <Zap size={14} />
                        Choose a Membership Plan
                      </button>
                    </div>
                  )}

                  {/* Purchase & Invoice History */}
                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Receipt size={16} className="text-[#ff7526]" />
                      Membership Purchase & Invoices History
                    </h4>

                    {membershipHistory.length > 0 ? (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                              <th className="px-4 py-3 font-bold">Plan Name</th>
                              <th className="px-4 py-3 font-bold">Duration</th>
                              <th className="px-4 py-3 font-bold">Amount</th>
                              <th className="px-4 py-3 font-bold">Purchase Date</th>
                              <th className="px-4 py-3 font-bold">Expiry Date</th>
                              <th className="px-4 py-3 font-bold">Payment Status</th>
                              <th className="px-4 py-3 font-bold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                            {membershipHistory.map((m, idx) => (
                              <tr key={m._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900">{m.planName || m.planId?.name || 'Seller Plan'}</td>
                                <td className="px-4 py-3">{durationLabel(m.durationType)}</td>
                                <td className="px-4 py-3 font-bold text-slate-900">₹{m.priceAtPurchase || m.planId?.price || 0}</td>
                                <td className="px-4 py-3 text-slate-500">{formatDate(m.startDate || m.createdAt)}</td>
                                <td className="px-4 py-3 text-slate-500">{formatDate(m.expiryDate)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                    m.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {m.paymentStatus || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                    m.membershipStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : (m.membershipStatus === 'expired' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')
                                  }`}>
                                    {m.membershipStatus || 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400 font-normal">
                        No previous membership purchase invoices found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit / Edit Controls */}
              {isEditing && (
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-[#ff7526] hover:bg-[#e65507] text-white rounded-lg font-medium text-sm cursor-pointer border-none shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>

      {/* Google Maps Location Search Modal for Store Address */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationModalSelect}
        title="Set Store & Warehouse Address"
        placeholder="Search store building, street, area, market, city..."
        initialLocation={
          formData.storeLocation
            ? {
                formattedAddress: formData.storeLocation,
                address: formData.storeLocation,
                city: formData.city,
                state: formData.state,
                postalCode: formData.pincode,
                latitude: formData.lat,
                longitude: formData.lng,
              }
            : null
        }
        accentColor="#ff7526"
      />

      {/* Fullscreen Document Preview Modal */}
      {previewDocModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#ff7526]" />
                <h3 className="font-bold text-sm tracking-wide">{previewDocModal.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {previewDocModal.imageUrl && (
                  <a
                    href={previewDocModal.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                    title="Open in new tab"
                  >
                    <ExternalLink size={15} />
                    <span className="hidden sm:inline">New Tab</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewDocModal({ isOpen: false, title: '', imageUrl: '' })}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto flex-1 min-h-[300px]">
              {previewDocModal.imageUrl ? (
                <img
                  src={previewDocModal.imageUrl}
                  alt={previewDocModal.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <p className="text-slate-400 text-sm">No image available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
