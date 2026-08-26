import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, MapPin, FileText, CheckCircle, Loader2, Search, Navigation, AlertCircle } from 'lucide-react';
import { authService } from '../../../../services/authService';
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
    fssaiLicense: ''
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
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setErrorMessage('');
      try {
        const payload = {
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
          fssaiLicense: formData.fssaiLicense
        };

        const res = await authService.registerSeller(payload);
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
          <img src="/MainLogo.png" alt="ShippNex" className="h-10 object-contain mx-auto" />
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
                  <h3 className="text-lg font-bold text-slate-800 m-0">Legal Documents</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">GST Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm uppercase transition-all" placeholder="e.g. 22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN Number</label>
                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} required className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm uppercase transition-all" placeholder="PAN Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">FSSAI License</label>
                    <input type="text" name="fssaiLicense" value={formData.fssaiLicense} onChange={handleInputChange} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] font-medium text-sm transition-all" placeholder="License Number" />
                  </div>
                  <div className="col-span-2 p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                    <CheckCircle size={24} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">Verification documents verified during onboarding</span>
                    <span className="text-xs text-slate-400">PDF, JPG, PNG supported</span>
                  </div>
                </div>
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
                  step === 3 ? 'Submit Application' : 'Continue'
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
