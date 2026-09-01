import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, MapPin, FileText, CheckCircle, Check, Loader2, Search, Navigation, AlertCircle, Crown, Zap, Star, CreditCard , Banknote, Wallet, Building2, Smartphone, UploadCloud, Image, X, FileCheck} from 'lucide-react';
import { authService, membershipService } from '../../../../services/authService';
import { MapService } from '../../../../services/MapService';
import LocationSearchModal from '../../../../components/LocationSearchModal';

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

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

  const nextStep = async (e) => {
    e.preventDefault();
    if (step === 3 && !formData.gstNumber && !formData.panNumber) {
      // Basic validation, but let HTML5 required handle it usually
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
        email: formData.email,
        businessType: formData.businessType || 'Retail',
        storeLogo: formData.storeLogo,
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
            if (selectedPaymentMethod === 'cod') {
              // Direct submit as COD
              const res = await authService.registerSeller({ ...basePayload, paymentMethod: 'cod' });
              if (res && res.success) setIsSubmitted(true);
              else setErrorMessage(res.message || 'Registration failed');
              setIsSubmitting(false);
              return;
            } else {
              // Razorpay path for all other digital methods
              const orderRes = await membershipService.createRazorpayOrder(selectedPlan._id, 'seller');
              if (!orderRes.success) throw new Error('Could not create payment order');
              
              const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: orderRes.order.amount,
                currency: orderRes.order.currency,
                name: 'ShippNex',
                description: 'Seller Membership Payment',
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
                    if (res && res.success) setIsSubmitted(true);
                    else setErrorMessage(res.message || 'Registration failed');
                  } catch (err) {
                    setErrorMessage(err.response?.data?.message || err.message || 'Server error occurred');
                  } finally {
                    setIsSubmitting(false);
                  }
                },
                prefill: {
                  name: formData.ownerName,
                  email: formData.email,
                  contact: formData.phone
                },
                theme: { color: '#ff5500' }
              };
              
              const rzp = new window.Razorpay(options);
              rzp.on('payment.failed', function () {
                setIsSubmitting(false);
                setErrorMessage('Payment failed. Please try again.');
              });
              rzp.open();
              return; // Exit early, submission happens in the handler
            }
          }
        }
        
        // If no plan selected or price is 0, submit directly
        const res = await authService.registerSeller(basePayload);
        if (res && res.success) {
          setIsSubmitted(true);
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
    if (step > 1) setStep(step - 1);
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
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Application Submitted!</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                Thank you for applying to sell on ShippNex. Your account application has been received and is currently <strong className="text-slate-800">Under Review</strong> by our admin team.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left mb-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Business Name:</span>
                  <span className="font-bold text-slate-800">{formData.businessName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Registered Phone:</span>
                  <span className="font-bold text-slate-800">{formData.phone}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">Status:</span>
                  <span className="font-bold text-amber-600 uppercase">Pending Approval</span>
                </div>
              </div>
              <Link to="/seller/login" className="inline-block w-full py-3 bg-[#ff5500] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#e64d00] transition-colors">
                Go to Seller Login
              </Link>
            </div>
          ) : (
          <form onSubmit={nextStep}>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-0"></div>
              <div className="flex items-center justify-between w-full z-10">
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>1</div>
                  <span className={`text-xs font-semibold ${step >= 1 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Store Details</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>2</div>
                  <span className={`text-xs font-semibold ${step >= 2 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Address</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>3</div>
                  <span className={`text-xs font-semibold ${step >= 3 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Documents</span>
                </div>
                <div className={`flex flex-col items-center gap-1.5`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 4 ? 'bg-[#ff5500] text-white ring-4 ring-orange-50' : 'bg-slate-100 text-slate-400'}`}>4</div>
                  <span className={`text-xs font-semibold ${step >= 4 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Membership</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-orange-50 text-[#ff5500] rounded-lg"><Store size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">Store Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business / Store Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="e.g. Super Mart Online" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Owner Full Name</label>
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
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={10} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="store@example.com" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Store Logo / Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff5500] hover:file:bg-orange-100 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-800 m-0">Warehouse Address</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Powered by Google Maps</span>
                </div>

                {/* Map Quick Action Buttons */}
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
                  {/* GST Details & Photo */}
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
                    
                    {/* GST Document / Photo Upload */}
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

                  {/* PAN Number */}
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

                  {/* FSSAI License */}
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

                  {/* Bank Passbook / Cheque Photo */}
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

                  {/* Verification Notice */}
                  <div className="col-span-2 p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-2.5">
                    <CheckCircle size={18} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-medium text-blue-800">
                      All uploaded business & banking documents are securely stored and verified during admin onboarding.
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                    No membership plans available right now. You can skip this step and purchase later.
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

                {formData.planId && (
                  <div className="mt-6 animate-in fade-in duration-300">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-3 text-left">Select Payment Method</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay cash upon delivery', icon: Banknote, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { id: 'upi', title: 'UPI (GPay / PhonePe / Paytm)', subtitle: 'Instant UPI payment', icon: Wallet, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { id: 'netbanking', title: 'Net Banking', subtitle: 'All major banks supported', icon: Building2, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { id: 'wallet', title: 'Mobile Wallets', subtitle: 'Paytm Wallet, Mobikwik, etc.', icon: Smartphone, color: 'text-slate-600', bg: 'bg-slate-50' },
                      ].map(method => {
                        const isSelected = selectedPaymentMethod === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex items-center justify-between p-4 rounded-[14px] border-2 cursor-pointer transition-all ${isSelected ? 'border-[#ff5500] bg-orange-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#ff5500] text-white' : method.bg + ' ' + method.color}`}>
                                <method.icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                              </div>
                              <div className="text-left">
                                <h4 className="text-[15px] font-bold text-slate-900">{method.title}</h4>
                                <p className="text-[13px] text-slate-500 font-medium">{method.subtitle}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#ff5500] bg-[#ff5500]' : 'border-slate-200'}`}>
                              {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between gap-4">
              {step > 1 ? (
                <button type="button" onClick={prevStep} disabled={isSubmitting} className="flex-1 py-2.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
                  Back
                </button>
              ) : (
                <Link to="/seller/login" className="flex-1 py-2.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  Cancel
                </Link>
              )}
              <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#ff5500] hover:bg-[#e64d00] transition-colors cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  step === 4 ? 'Submit Application' : 'Continue'
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
