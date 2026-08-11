import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, MapPin, FileText, CheckCircle, Loader2 } from 'lucide-react';

const SellerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    serviceRadius: '',
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

  const nextStep = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://localhost:5000/api/auth/seller/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (data.success) {
          setIsSubmitted(true);
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error(error);
        alert('Error submitting application. Please ensure backend is running.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img src="/Logo.png" alt="ShippNex Logo" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Become a Seller</h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">Join the B2B Grocery Marketplace</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-[#ff5500] text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Business Details</span>
          </div>
          <div className={`w-12 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-[#ff5500]' : 'bg-slate-200'}`}></div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-[#ff5500] text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <span className={`text-sm font-semibold ${step >= 2 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Address</span>
          </div>
          <div className={`w-12 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-[#ff5500]' : 'bg-slate-200'}`}></div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-[#ff5500] text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
            <span className={`text-sm font-semibold ${step >= 3 ? 'text-[#ff5500]' : 'text-slate-500'}`}>Documents</span>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
          {isSubmitted ? (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Your seller application has been received and is currently under review by our admin team. We will notify you once it's approved.
              </p>
              <Link to="/seller/login" className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#ff5500] hover:bg-[#e64d00] transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
          <form onSubmit={nextStep}>
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-orange-50 text-[#ff5500] rounded-lg"><Store size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">Business Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Warehouse/Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="Enter business name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Owner Name</label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="+91 xxxxx xxxxx" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Type</label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all bg-white">
                      <option value="">Select product type</option>
                      <option value="grocery">Grocery & FMCG</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing & Apparel</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Store Logo / Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff5500] hover:file:bg-orange-100" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">Warehouse Address</h3>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <button 
                      type="button" 
                      className="w-full bg-blue-50 text-blue-600 border border-blue-200 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                      onClick={() => alert('GPS location captured!')}
                    >
                      <MapPin size={18} /> Get Current GPS Location
                    </button>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Complete Address</label>
                    <textarea name="completeAddress" value={formData.completeAddress} onChange={handleInputChange} required rows="3" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all resize-none" placeholder="Street address, locality..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="Pincode" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Radius (km)</label>
                    <input type="number" name="serviceRadius" value={formData.serviceRadius} onChange={handleInputChange} required min="1" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="e.g. 5" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">Legal Documents</h3>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">GST Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm uppercase transition-all" placeholder="e.g. 22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN Number</label>
                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm uppercase transition-all" placeholder="PAN Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">FSSAI License</label>
                    <input type="text" name="fssaiLicense" value={formData.fssaiLicense} onChange={handleInputChange} required className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] font-medium text-sm transition-all" placeholder="License Number" />
                  </div>
                  <div className="col-span-2 p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                    <CheckCircle size={24} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">Upload Cancelled Cheque & ID Proof</span>
                    <span className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
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
    </div>
  );
};

export default SellerRegister;
