import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, MapPin, FileText, CheckCircle, Check, Loader2, Search, Navigation, AlertCircle, Crown, Zap, Star, CreditCard, Banknote, Wallet, Building2, Smartphone, UploadCloud, Image, X, FileCheck, Layers, Eye, EyeOff, Lock, ShieldCheck, RotateCcw } from 'lucide-react';
import { authService, membershipService, categoryService } from '../../../../services/authService';
import { MapService } from '../../../../services/MapService';
import LocationSearchModal from '../../../../components/LocationSearchModal';

const FALLBACK_CATEGORIES = [
  'Grocery Essentials',
  'Grains & Flours',
  'Oil & Ghee',
  'Spices & Masala',
  'Sugar & Sweeteners',
  'Fruits',
  'Vegetables',
  'Ready-to-Cook',
  'Bakery & Cakes',
  'Fast Food',
  'Personal Care',
  'Home Care',
  'Stationary',
  'Beauty',
  'Electronics',
  'Fashion'
];

const SellerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('netbanking');

  const [availableCategories, setAvailableCategories] = useState(FALLBACK_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification States (Step 5)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res?.categories && Array.isArray(res.categories) && res.categories.length > 0) {
          const names = res.categories.map(c => c.name || c.label || c).filter(Boolean);
          if (names.length > 0) {
            setAvailableCategories(names);
          }
        }
      } catch (err) {
        console.warn('Could not fetch categories from server, using fallback list', err);
      }
    };
    loadCategories();
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await membershipService.getSellerPlans();
      if (res.success) setPlans(res.plans || []);
    } catch (err) {
      console.error('Failed to load plans', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    if (step === 4 && plans.length === 0) {
      fetchPlans();
    }
  }, [step]);

  const PLAN_ICONS = { monthly: Zap, halfYearly: Star, yearly: Crown };
  const durationLabel = (t) => ({ monthly: '1 Month', halfYearly: '6 Months', yearly: '12 Months' }[t] || t);

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    businessType: '',
    storeLogo: '',
    completeAddress: '',
    city: '',
    state: '',
    pincode: '',
    lat: null,
    lng: null,
    serviceRadius: '5',
    gstNumber: '',
    panNumber: '',
    fssaiLicense: '',
    gstPhoto: '',
    bankPassbookPhoto: '',
    planId: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (catName) => {
    setErrorMessage('');
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleFileChange = (e) => {
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
        setErrorMessage('File size must be less than 5MB');
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
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
  };

  // Google Maps GPS Geolocation Auto-Detection
  const handleGetGpsLocation = async () => {
    setGpsLoading(true);
    setErrorMessage('');
    try {
      const coords = await MapService.getCurrentCoordinates();
      const detailed = await MapService.reverseGeocode(coords.lat, coords.lng);
      setFormData(prev => ({
        ...prev,
        completeAddress: detailed.formattedAddress || detailed.address,
        city: detailed.city || prev.city,
        state: detailed.state || prev.state,
        pincode: detailed.postalCode || detailed.pincode || prev.pincode,
        lat: detailed.latitude || detailed.lat,
        lng: detailed.longitude || detailed.lng,
      }));
    } catch (err) {
      console.error('Seller register GPS error:', err);
      setErrorMessage(err.message || 'Could not detect GPS location. Please search on map.');
    } finally {
      setGpsLoading(false);
    }
  };

  // Map Modal Selection
  const handleMapLocationSelect = (loc) => {
    if (!loc) return;
    setFormData(prev => ({
      ...prev,
      completeAddress: loc.formattedAddress || loc.address,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      pincode: loc.postalCode || loc.pincode || prev.pincode,
      lat: loc.latitude || loc.lat,
      lng: loc.longitude || loc.lng,
    }));
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < clean.length && index + i < 6; i++) {
        newOtp[index + i] = clean[i];
      }
      setOtp(newOtp);
      const nextIdx = Math.min(index + clean.length, 5);
      const nextInput = document.getElementById(`seller-reg-otp-${nextIdx}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`seller-reg-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`seller-reg-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage('');
    setResendSuccessMsg('');
    try {
      setIsResendingOtp(true);
      await authService.sendSellerOtp(formData.phone);
      setResendSuccessMsg('A new OTP has been sent to your mobile number.');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const enteredOtp = otp.join('').trim();
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const res = await authService.verifySellerOtp(formData.phone, enteredOtp);
      if (res && res.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(res?.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const nextStep = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (step === 1) {
      if (!formData.password || formData.password.length < 6) {
        setErrorMessage('Password is required and must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      if (selectedCategories.length === 0) {
        setErrorMessage('Please select at least one store category for your business.');
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setErrorMessage('');

      const basePayload = {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        password: formData.password,
        email: formData.email,
        businessType: formData.businessType || 'Retail',
        storeLogo: formData.storeLogo,
        categories: selectedCategories,
        serviceRadius: formData.serviceRadius ? Number(formData.serviceRadius) : 5,
        completeAddress: formData.completeAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        lat: formData.lat,
        lng: formData.lng,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        fssaiLicense: formData.fssaiLicense,
        gstPhoto: formData.gstPhoto,
        bankPassbookPhoto: formData.bankPassbookPhoto,
        planId: formData.planId,
      };

      try {
        if (formData.planId) {
          const selectedPlan = plans.find(p => p._id === formData.planId);
          if (selectedPlan && selectedPlan.price > 0) {
            // Razorpay online payment
            const orderRes = await membershipService.createRazorpayOrder(selectedPlan._id, 'seller');
            if (!orderRes.success || !orderRes.order) throw new Error(orderRes.message || 'Could not create payment order');
            
            const options = {
              key: orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TRZdg2aAOYv4KK',
              amount: orderRes.order.amount,
              currency: orderRes.order.currency || 'INR',
              name: 'ShippNex',
              description: `${selectedPlan.name} Membership Payment`,
              order_id: orderRes.order.id,
              handler: async function (response) {
                try {
                  setIsSubmitting(true);
                  const finalPayload = {
                    ...basePayload,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    paymentMethod: 'razorpay'
                  };
                  const res = await authService.registerSeller(finalPayload);
                  if (res && res.success) {
                    setStep(5); // Move to OTP Verification
                  } else {
                    setErrorMessage(res.message || 'Registration failed');
                  }
                } catch (err) {
                  setErrorMessage(err.response?.data?.message || err.message || 'Server error occurred');
                } finally {
                  setIsSubmitting(false);
                }
              },
              modal: {
                ondismiss: function () {
                  setIsSubmitting(false);
                }
              },
              prefill: {
                name: formData.ownerName || formData.businessName,
                email: formData.email,
                contact: formData.phone,
                method: 'netbanking'
              },
              theme: {
                color: '#ff5500'
              }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
              setErrorMessage(response.error.description || 'Payment Failed');
              setIsSubmitting(false);
            });
            rzp.open();
            return;
          }
        }
        
        // Submit directly to register and receive OTP
        const res = await authService.registerSeller(basePayload);
        if (res && res.success) {
          setStep(5); // Move to OTP verification
        } else {
          setErrorMessage(res.message || 'Registration failed');
        }
      } catch (err) {
        console.error('Registration submit error:', err);
        setErrorMessage(err.response?.data?.message || err.message || 'Server error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    if (step > 1 && step <= 4) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <img src="/Logo.png" alt="ShippNex" className="h-10 object-contain mx-auto" />
        </Link>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Seller Registration</h2>
        <p className="text-sm font-semibold text-slate-500 mt-1">Start selling on ShippNex Marketplace</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {isSubmitted ? (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300 space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Registration Successful</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-md mx-auto">
                Your account is currently <strong className="text-slate-900 font-semibold">under review</strong>. Once the admin approves your account, you will be able to log in using your <strong className="text-slate-900 font-semibold">mobile number and password</strong>.
              </p>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2.5 my-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Business / Store Name:</span>
                  <span className="font-bold text-slate-900">{formData.businessName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Registered Phone Number:</span>
                  <span className="font-bold text-slate-900">+91 {formData.phone}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Account Status:</span>
                  <span className="font-bold text-amber-600 uppercase">Under Review (Pending Approval)</span>
                </div>
              </div>

              <Link
                to="/seller/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#ff5500] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#e64d00] transition-colors no-underline cursor-pointer"
              >
                Go to Seller Login
              </Link>
            </div>
          ) : (
          <form onSubmit={step === 5 ? handleVerifyOtpSubmit : nextStep}>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-0"></div>
              <div className="flex items-center justify-between w-full z-10">
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>1</div>
                  <span className={`text-[11px] font-semibold ${step >= 1 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Store</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>2</div>
                  <span className={`text-[11px] font-semibold ${step >= 2 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Address</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>3</div>
                  <span className={`text-[11px] font-semibold ${step >= 3 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Legal</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 4 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>4</div>
                  <span className={`text-[11px] font-semibold ${step >= 4 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Plan</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 5 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>5</div>
                  <span className={`text-[11px] font-semibold ${step >= 5 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Verify OTP</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {resendSuccessMsg && (
              <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                <span>{resendSuccessMsg}</span>
              </div>
            )}

            {/* STEP 1: STORE & CREDENTIALS */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-orange-50 text-[#ff5500] rounded-lg"><Store size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">Store Information & Password</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business / Store Name *</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="e.g. Super Mart Online" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Owner Full Name *</label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Type</label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all bg-white">
                      <option value="">Select Type</option>
                      <option value="Retail">Retail Store</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Manufacturer">Manufacturer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registered Mobile Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={10} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="store@example.com" />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Create Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all"
                        placeholder="At least 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Store Logo / Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff5500] hover:file:bg-orange-100 cursor-pointer" />
                  </div>

                  {/* Store Categories Selection */}
                  <div className="col-span-2 space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-700">
                        Store Product Categories <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Multiple allowed</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      {availableCategories.map((cat) => {
                        const catLabel = typeof cat === 'string' ? cat : (cat.name || cat.label);
                        const isSelected = selectedCategories.includes(catLabel);
                        return (
                          <div
                            key={catLabel}
                            onClick={() => toggleCategory(catLabel)}
                            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all select-none ${
                              isSelected
                                ? 'bg-orange-50 border-[#ff5500] text-[#ff5500]'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                              isSelected ? 'bg-[#ff5500] border-[#ff5500] text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="truncate">{catLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                    {selectedCategories.length === 0 ? (
                      <p className="text-[11px] text-amber-600 font-medium">Please select at least 1 category for your store.</p>
                    ) : (
                      <p className="text-[11px] text-emerald-600 font-semibold">{selectedCategories.length} category(s) selected</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Warehouse Address</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Powered by Google Maps</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    type="button" 
                    disabled={gpsLoading}
                    onClick={handleGetGpsLocation}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {gpsLoading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
                    <span>{gpsLoading ? 'Detecting GPS...' : 'Use Current GPS'}</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setIsMapModalOpen(true)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Search size={15} />
                    <span>Search on Map</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Complete Address *</label>
                    <textarea name="completeAddress" value={formData.completeAddress} onChange={handleInputChange} required rows="3" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all resize-none" placeholder="Building, street address, locality..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pincode *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="Pincode" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Radius (km) *</label>
                    <input type="number" name="serviceRadius" value={formData.serviceRadius} onChange={handleInputChange} required min="1" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="e.g. 5" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LEGAL DOCUMENTS */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Legal Documents</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Upload business compliance & banking proof</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2 p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl">
                    <label className="block text-sm font-bold text-slate-800">
                      GST Registration <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      name="gstNumber" 
                      value={formData.gstNumber} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm uppercase transition-all" 
                      placeholder="e.g. 22AAAAA0000A1Z5" 
                    />
                    
                    <div>
                      <span className="block text-xs font-semibold text-slate-600 mb-1.5">GST Certificate / Document Photo</span>
                      {formData.gstPhoto ? (
                        <div className="relative p-2.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={formData.gstPhoto} alt="GST Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-emerald-700 truncate flex items-center gap-1">
                                <FileCheck size={14} className="text-emerald-600 shrink-0" /> GST Document Uploaded
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">Ready for verification</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocFile('gstPhoto')}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                            title="Remove GST document"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-orange-50/40 hover:border-[#ff5500]/50 transition-all group">
                          <UploadCloud size={20} className="text-slate-400 group-hover:text-[#ff5500] transition-colors mb-1" />
                          <span className="text-xs font-bold text-slate-700 group-hover:text-[#ff5500]">Upload GST Certificate Photo</span>
                          <span className="text-[11px] text-slate-400">JPG, PNG or WebP up to 5MB</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleDocFileChange(e, 'gstPhoto')} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN Number *</label>
                    <input 
                      type="text" 
                      name="panNumber" 
                      value={formData.panNumber} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm uppercase transition-all" 
                      placeholder="e.g. ABCDE1234F" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">FSSAI License <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      name="fssaiLicense" 
                      value={formData.fssaiLicense} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" 
                      placeholder="14-digit License No." 
                    />
                  </div>

                  <div className="col-span-2 space-y-2 p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl">
                    <label className="block text-sm font-bold text-slate-800">
                      Bank Account Proof <span className="text-[#ff5500]">*</span>
                    </label>
                    <p className="text-xs text-slate-500 -mt-1 font-medium">Upload Bank Passbook front page or Cancelled Cheque photo for settlement verification</p>
                    
                    {formData.bankPassbookPhoto ? (
                      <div className="relative p-2.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={formData.bankPassbookPhoto} alt="Passbook Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-emerald-700 truncate flex items-center gap-1">
                              <FileCheck size={14} className="text-emerald-600 shrink-0" /> Passbook / Cheque Uploaded
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">Ready for banking verification</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocFile('bankPassbookPhoto')}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                          title="Remove bank passbook photo"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-orange-50/40 hover:border-[#ff5500]/50 transition-all group">
                        <UploadCloud size={22} className="text-slate-400 group-hover:text-[#ff5500] transition-colors mb-1" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#ff5500]">Upload Bank Passbook / Cancelled Cheque</span>
                        <span className="text-[11px] text-slate-400">JPG, PNG or WebP up to 5MB</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleDocFileChange(e, 'bankPassbookPhoto')} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MEMBERSHIP */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-[#ff5500] rounded-lg"><Crown size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Select Membership Plan</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={fetchPlans}
                    className="text-xs font-bold text-[#ff5500] hover:text-[#e64d00] flex items-center gap-1 cursor-pointer bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {loadingPlans ? (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-[#ff5500] mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Loading membership plans...</p>
                  </div>
                ) : plans.length === 0 ? (
                  <div className="p-4 bg-slate-50 text-slate-500 text-sm text-center rounded-xl border border-slate-200">
                    No membership plans available right now. You can skip this step and proceed with registration.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {plans.map(plan => {
                      const Icon = PLAN_ICONS[plan.durationType] || Crown;
                      const isSelected = formData.planId === plan._id;
                      return (
                        <div
                          key={plan._id}
                          onClick={() => setFormData(prev => ({ ...prev, planId: plan._id }))}
                          className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-[#ff5500] bg-orange-50/50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-sm'}`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 text-[#ff5500]">
                              <CheckCircle size={20} className="fill-[#ff5500] text-white" />
                            </div>
                          )}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-[#ff5500] text-white' : 'bg-orange-50 text-[#ff5500]'}`}>
                            <Icon size={20} />
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 mb-1">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-black text-slate-900">₹{plan.price}</span>
                            <span className="text-xs font-semibold text-slate-500">/{durationLabel(plan.durationType)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: IN-FLOW OTP VERIFICATION SCREEN */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 py-2">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 bg-orange-50 text-[#ff5500] rounded-full mx-auto flex items-center justify-center border border-orange-200 mb-2">
                    <ShieldCheck size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Verify Mobile Number</h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Enter the 6-digit OTP sent to <strong className="font-semibold text-slate-800">+91 {formData.phone}</strong>
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(['1', '2', '3', '4', '5', '6']);
                        setErrorMessage('');
                      }}
                      title="Click to fill test OTP 123456"
                      className="text-[11px] text-orange-600 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-md font-mono hover:bg-orange-100 transition-colors cursor-pointer"
                    >
                      ⚡ Test OTP: 123456 (Click to fill)
                    </button>
                  </div>
                </div>

                {/* 6 Digit OTP Boxes */}
                <div className="flex justify-between gap-2 py-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`seller-reg-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="flex-1 min-w-0 aspect-square max-h-[52px] text-center text-xl font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-2 focus:ring-orange-100 bg-slate-50 transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-normal">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={isResendingOtp}
                    onClick={handleResendOtp}
                    className="text-[#ff5500] font-bold hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw size={12} className={isResendingOtp ? 'animate-spin' : ''} />
                    {isResendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between gap-4">
              {step > 1 && step <= 4 ? (
                <button type="button" onClick={prevStep} disabled={isSubmitting} className="flex-1 py-2.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
                  Back
                </button>
              ) : step === 5 ? (
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  Edit Details
                </button>
              ) : (
                <Link to="/seller/login" className="flex-1 py-2.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  Cancel
                </Link>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || isVerifyingOtp || (step === 5 && otp.join('').length < 6)}
                className="flex-1 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#ff5500] hover:bg-[#e64d00] transition-colors cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : isVerifyingOtp ? (
                  <><Loader2 size={16} className="animate-spin" /> Verifying OTP...</>
                ) : (
                  step === 4 ? 'Submit Application' : (step === 5 ? 'Verify OTP & Complete' : 'Continue')
                )}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>

      {/* Google Maps Search Modal for Seller Warehouse */}
      <LocationSearchModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelect={handleMapLocationSelect}
        title="Select Warehouse Location"
        placeholder="Search warehouse building, industrial area, street, city..."
        accentColor="#ff5500"
      />
    </div>
  );
};

export default SellerRegister;
