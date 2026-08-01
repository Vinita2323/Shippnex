import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptainRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    mobileNumber: '',
    alternateMobile: '',
    email: '',
    dob: '',
    age: '',
    fatherName: '',

    // Address & Identity
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pinCode: '',
    emergencyContact: '',
    aadhaarNumber: '',

    // Vehicle Details
    drivingLicenseNumber: '',
    rcNumber: '',
    vehicleInsuranceNumber: '',
    insuranceValidTill: '',

    // Bank Details
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    upiId: '',
  });

  const [files, setFiles] = useState({
    drivingLicense: null,
    rcDocument: null,
    aadhaarFront: null,
    aadhaarBack: null,
    profilePhoto: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        
        {/* Header Branding & Toggle */}
        <div className="flex flex-col items-center mb-8">
          <img src="/DeliveryLogo.png" alt="ShippNex Logo" className="h-16 object-contain mb-3" />
          <h1 className="text-2xl font-bold text-[#002625]">Captain Registration</h1>
          <p className="text-xs text-slate-500 text-center mt-1">
            Fill in your details and document verification to register as a Captain.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-[#15803d]/10 text-[#15803d] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <h2 className="text-xl font-bold text-[#002625]">Registration Submitted!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your application and documents are under review. Our onboarding team will contact you shortly.
            </p>
            <button
              onClick={() => navigate('/captain/login')}
              className="mt-4 px-6 py-2.5 bg-[#97fc43] text-[#002625] font-bold text-xs rounded-xl hover:bg-[#86e835] transition-all cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. PERSONAL DETAILS */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100">
                Personal Details
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleTextChange}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleTextChange}
                    placeholder="Enter mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alternate Mobile</label>
                  <input
                    type="tel"
                    maxLength={10}
                    name="alternateMobile"
                    value={formData.alternateMobile}
                    onChange={handleTextChange}
                    placeholder="Enter alternate mobile"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email ID *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  placeholder="Enter email id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Date of Birth *</label>
                  <input
                    required
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleTextChange}
                    placeholder="Enter age"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleTextChange}
                  placeholder="Enter father's name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>
            </div>


            {/* 2. ADDRESS & IDENTITY DETAILS */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100">
                Address & Identity Details
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Current Address *</label>
                <input
                  required
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleTextChange}
                  placeholder="Enter current address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Permanent Address</label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleTextChange}
                  placeholder="Enter permanent address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City *</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleTextChange}
                    placeholder="Enter city"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleTextChange}
                    placeholder="Enter state"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">PIN Code *</label>
                  <input
                    required
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleTextChange}
                    placeholder="Enter pin code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Emergency Contact Number</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleTextChange}
                  placeholder="Enter emergency contact number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Aadhaar Number *</label>
                <input
                  required
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleTextChange}
                  placeholder="Enter aadhaar number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>
            </div>


            {/* 3. VEHICLE & DRIVING DETAILS */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100">
                Vehicle & Driving Details
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Driving License Number *</label>
                <input
                  required
                  type="text"
                  name="drivingLicenseNumber"
                  value={formData.drivingLicenseNumber}
                  onChange={handleTextChange}
                  placeholder="Enter driving license number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">RC Number</label>
                <input
                  type="text"
                  name="rcNumber"
                  value={formData.rcNumber}
                  onChange={handleTextChange}
                  placeholder="Enter rc number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Vehicle Insurance Number</label>
                  <input
                    type="text"
                    name="vehicleInsuranceNumber"
                    value={formData.vehicleInsuranceNumber}
                    onChange={handleTextChange}
                    placeholder="Enter vehicle insurance number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Insurance Valid Till</label>
                  <input
                    type="date"
                    name="insuranceValidTill"
                    value={formData.insuranceValidTill}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>
            </div>


            {/* 4. DOCUMENT UPLOADS */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100">
                Document Uploads
              </h2>

              {/* Driving License Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Upload Driving License *</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600">
                    {files.drivingLicense ? files.drivingLicense.name : 'TAP TO UPLOAD'}
                  </span>
                  <input
                    required
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'drivingLicense')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Aadhaar Front & Back Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Aadhaar Front *</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.aadhaarFront ? files.aadhaarFront.name : 'TAP TO UPLOAD'}
                    </span>
                    <input
                      required
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Aadhaar Back</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.aadhaarBack ? files.aadhaarBack.name : 'TAP TO UPLOAD'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* RC Document Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">RC Document (Optional)</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600">
                    {files.rcDocument ? files.rcDocument.name : 'TAP TO UPLOAD'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'rcDocument')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>


            {/* 5. BANK DETAILS */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100">
                Bank Details
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bank Name *</label>
                <input
                  required
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleTextChange}
                  placeholder="Enter bank name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Holder Name *</label>
                <input
                  required
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleTextChange}
                  placeholder="Enter account holder name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Number *</label>
                <input
                  required
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleTextChange}
                  placeholder="Enter account number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">IFSC Code *</label>
                  <input
                    required
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleTextChange}
                    placeholder="Enter ifsc code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleTextChange}
                    placeholder="Enter branch name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">UPI ID (Optional)</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleTextChange}
                  placeholder="Enter upi id (optional)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin material-symbols-outlined">sync</span> Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/captain/login')}
                  className="text-[#15803d] font-bold hover:underline cursor-pointer"
                >
                  Log In Here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default CaptainRegister;
