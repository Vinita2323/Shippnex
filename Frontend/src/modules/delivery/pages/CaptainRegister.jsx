import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Truck, 
  Check, 
  Camera, 
  RefreshCw, 
  Upload, 
  X, 
  Trash2, 
  UserCheck, 
  RotateCcw, 
  AlertCircle, 
  Sparkles 
} from 'lucide-react';
import { authService } from '../../../services/authService';

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
    vehicleType: 'Motorcycle',
    drivingLicenseNumber: '',
    rcNumber: '',
    vehicleInsuranceNumber: '',
    insuranceValidTill: '',
    pucNumber: '',
    pucValidTill: '',
    permitNumber: '',
    permitValidTill: '',
    fitnessCertNumber: '',
    fitnessValidTill: '',
    roadTaxNumber: '',
    roadTaxValidTill: '',
    gpsEnabled: true,
    gpsDeviceId: '',

    // Bank Details
    panCardNumber: '',
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
    pucDocument: null,
    permitDocument: null,
    fitnessDocument: null,
    roadTaxDocument: null,
    form21Document: null,
    panCardDocument: null,
    profilePhoto: null,
  });

  // Live Selfie & Camera States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [cameraError, setCameraError] = useState('');
  const [capturedSelfiePreview, setCapturedSelfiePreview] = useState('');
  const [tempCapturedImage, setTempCapturedImage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Stop camera tracks helper
  const stopTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      stopTracks(cameraStream);
    };
  }, [cameraStream]);

  // Attach video stream whenever camera modal opens or stream changes
  useEffect(() => {
    if (isCameraModalOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.error('Video play error:', err));
    }
  }, [isCameraModalOpen, cameraStream, tempCapturedImage]);

  const startCamera = async (facing = cameraFacingMode) => {
    setCameraError('');
    setIsCameraModalOpen(true);
    setTempCapturedImage('');

    if (cameraStream) {
      stopTracks(cameraStream);
      setCameraStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.error('Video play error:', err));
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device found on your device.');
      } else {
        setCameraError('Could not start camera. Please check your camera permissions.');
      }
    }
  };

  const stopCamera = () => {
    stopTracks(cameraStream);
    setCameraStream(null);
    setIsCameraModalOpen(false);
    setTempCapturedImage('');
    setCameraError('');
  };

  const switchCamera = () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  const snapSelfie = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Mirror horizontal if user-facing for natural selfie
    if (cameraFacingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setTempCapturedImage(dataUrl);
  };

  const confirmSelfie = () => {
    if (tempCapturedImage) {
      setFiles((prev) => ({ ...prev, profilePhoto: tempCapturedImage }));
      setCapturedSelfiePreview(tempCapturedImage);
    }
    stopCamera();
  };

  const removeSelfie = () => {
    setFiles((prev) => ({ ...prev, profilePhoto: null }));
    setCapturedSelfiePreview('');
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve('');
      if (typeof file === 'string') return resolve(file); // Already a base64 / data URL string
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.mobileNumber) {
      alert('Full Name and Mobile Number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert all uploaded documents to base64
      const [
        dl,
        rc,
        aFront,
        aBack,
        pPhoto,
        pucDoc,
        permitDoc,
        fitnessDoc,
        taxDoc,
        form21Doc,
        panDoc
      ] = await Promise.all([
        fileToBase64(files.drivingLicense),
        fileToBase64(files.rcDocument),
        fileToBase64(files.aadhaarFront),
        fileToBase64(files.aadhaarBack),
        fileToBase64(files.profilePhoto),
        fileToBase64(files.pucDocument),
        fileToBase64(files.permitDocument),
        fileToBase64(files.fitnessDocument),
        fileToBase64(files.roadTaxDocument),
        fileToBase64(files.form21Document),
        fileToBase64(files.panCardDocument),
      ]);

      const payload = {
        ...formData,
        documents: {
          drivingLicense: dl,
          rcDocument: rc,
          aadhaarFront: aFront,
          aadhaarBack: aBack,
          pucDocument: pucDoc,
          permitDocument: permitDoc,
          fitnessDocument: fitnessDoc,
          roadTaxDocument: taxDoc,
          form21Document: form21Doc,
          panCard: panDoc,
          profilePhoto: pPhoto,
        },
      };

      const res = await authService.registerCaptain(payload);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Failed to submit registration');
      }
    } catch (err) {
      console.error('API submission failed:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit registration application.');
    } finally {
      setIsSubmitting(false);
    }
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
                <label className="text-xs font-bold text-slate-700">Email ID</label>
                <input
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
                  <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                  <input
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
                <label className="text-xs font-bold text-slate-700">Current Address</label>
                <input
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
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
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
                  <label className="text-xs font-bold text-slate-700">PIN Code</label>
                  <input
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
                <label className="text-xs font-bold text-slate-700">Aadhaar Number</label>
                <input
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

              {/* Vehicle Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Select Vehicle Type <span className="text-red-500">*</span></span>
                  <span className="text-[11px] font-bold text-[#15803d]">{formData.vehicleType || 'Motorcycle'}</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { name: 'Motorcycle', capacity: 'Up to 20 kg', icon: <Bike size={18} /> },
                    { name: '3 Wheeler', capacity: 'Up to 500 kg', icon: <Truck size={18} /> },
                    { name: 'Mini Truck', capacity: 'Up to 750 kg', icon: <Truck size={18} /> },
                    { name: 'Pickup 8ft', capacity: 'Up to 1200 kg', icon: <Truck size={18} /> },
                  ].map((v) => {
                    const isSelected = formData.vehicleType === v.name;
                    return (
                      <div
                        key={v.name}
                        onClick={() => setFormData((prev) => ({ ...prev, vehicleType: v.name }))}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#15803d] bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-emerald-100 text-[#15803d]' : 'bg-slate-100 text-slate-600'}`}>
                            {v.icon}
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800 m-0">{v.name}</h4>
                          <p className="text-[10.5px] font-medium text-slate-500 m-0 mt-0.5">{v.capacity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Driving License Number</label>
                <input
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

              {/* 1. Pollution (PUC) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pollution (PUC) Certificate No.</label>
                  <input
                    type="text"
                    name="pucNumber"
                    value={formData.pucNumber}
                    onChange={handleTextChange}
                    placeholder="Enter PUC number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">PUC Valid Till</label>
                  <input
                    type="date"
                    name="pucValidTill"
                    value={formData.pucValidTill}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              {/* 2. Vehicle Permit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Commercial / Goods Permit No.</label>
                  <input
                    type="text"
                    name="permitNumber"
                    value={formData.permitNumber}
                    onChange={handleTextChange}
                    placeholder="Enter permit number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Permit Valid Till</label>
                  <input
                    type="date"
                    name="permitValidTill"
                    value={formData.permitValidTill}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              {/* 3. Fitness Certificate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Fitness Certificate Number</label>
                  <input
                    type="text"
                    name="fitnessCertNumber"
                    value={formData.fitnessCertNumber}
                    onChange={handleTextChange}
                    placeholder="Enter fitness certificate number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Fitness Valid Till</label>
                  <input
                    type="date"
                    name="fitnessValidTill"
                    value={formData.fitnessValidTill}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              {/* 4. Road Tax Receipt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Road Tax Receipt / Challan No.</label>
                  <input
                    type="text"
                    name="roadTaxNumber"
                    value={formData.roadTaxNumber}
                    onChange={handleTextChange}
                    placeholder="Enter road tax receipt number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Road Tax Valid Till</label>
                  <input
                    type="date"
                    name="roadTaxValidTill"
                    value={formData.roadTaxValidTill}
                    onChange={handleTextChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              {/* 📍 GPS Tracking Device */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📍</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 m-0">Vehicle GPS Tracking System</h4>
                      <p className="text-[11px] text-slate-500 m-0">Is your vehicle equipped with active GPS tracking?</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="gpsEnabled"
                      checked={formData.gpsEnabled}
                      onChange={handleTextChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#15803d]"></div>
                  </label>
                </div>

                {formData.gpsEnabled && (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-700">GPS Device ID / IMEI Number (Optional)</label>
                    <input
                      type="text"
                      name="gpsDeviceId"
                      value={formData.gpsDeviceId}
                      onChange={handleTextChange}
                      placeholder="e.g. GPS-8829103984 or IMEI"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                    />
                  </div>
                )}
              </div>

            </div>


            {/* 4. DOCUMENT UPLOADS & IDENTITY VERIFICATION */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b pb-2 border-slate-100 flex items-center justify-between">
                <span>Document Uploads & Verification</span>
                <span className="text-[10px] font-semibold text-slate-400 capitalize">Identity & Permits</span>
              </h2>

              {/* 📸 LIVE CAPTAIN SELFIE VERIFICATION */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/40 border-2 border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#15803d] text-white flex items-center justify-center shadow-sm shrink-0">
                      <Camera size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider m-0">
                          Live Captain Selfie
                        </h3>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Required for KYC
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 m-0">
                        Take a clear live front-facing photo of yourself for identity verification.
                      </p>
                    </div>
                  </div>

                  {capturedSelfiePreview && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <Check size={12} strokeWidth={3} /> Attached
                    </span>
                  )}
                </div>

                {/* Selfie Preview or Camera/Upload Trigger */}
                {capturedSelfiePreview ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-2xl border border-emerald-200/90 shadow-2xs">
                    <div className="relative group shrink-0">
                      <img
                        src={capturedSelfiePreview}
                        alt="Captain Live Selfie"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#15803d] text-white rounded-full flex items-center justify-center shadow-sm">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5 m-0">
                          <UserCheck size={15} className="text-[#15803d]" />
                          Live Selfie Photo Ready
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 m-0">
                          Your photo has been captured and attached to your onboarding application.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#15803d] text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={13} /> Retake Selfie
                        </button>
                        <button
                          type="button"
                          onClick={removeSelfie}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Live Camera Action Button Only */}
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="w-full py-3.5 px-4 bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98"
                    >
                      <Camera size={18} />
                      <span>Take Live Selfie (Camera)</span>
                    </button>

                    {/* Guidelines */}
                    <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-2.5 flex items-center gap-2.5 text-[11px] text-slate-600">
                      <Sparkles size={15} className="text-emerald-600 shrink-0" />
                      <span>Look directly at the camera in good lighting. Please avoid wearing masks or sunglasses.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Driving License Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Upload Driving License</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600 truncate">
                    {files.drivingLicense ? files.drivingLicense.name : 'TAP TO UPLOAD DRIVING LICENSE'}
                  </span>
                  <input
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
                  <label className="text-xs font-bold text-slate-700">Aadhaar Front</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.aadhaarFront ? files.aadhaarFront.name : 'TAP TO UPLOAD'}
                    </span>
                    <input
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
                <label className="text-xs font-bold text-slate-700">RC Document (Registration Certificate)</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600 truncate">
                    {files.rcDocument ? files.rcDocument.name : 'TAP TO UPLOAD RC'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'rcDocument')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 1. Pollution (PUC) & 2. Vehicle Permit Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pollution (PUC) Certificate</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.pucDocument ? files.pucDocument.name : 'TAP TO UPLOAD PUC'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'pucDocument')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Commercial Vehicle Permit</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.permitDocument ? files.permitDocument.name : 'TAP TO UPLOAD PERMIT'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'permitDocument')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 3. Fitness Certificate & 4. Road Tax Receipt Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Fitness Certificate</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.fitnessDocument ? files.fitnessDocument.name : 'TAP TO UPLOAD FITNESS'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'fitnessDocument')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Road Tax Receipt</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-slate-400">upload</span>
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {files.roadTaxDocument ? files.roadTaxDocument.name : 'TAP TO UPLOAD ROAD TAX'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'roadTaxDocument')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 5. Form-21 (Sale Certificate) Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Form-21 (Sale / Manufacturer Certificate)</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600 truncate">
                    {files.form21Document ? files.form21Document.name : 'TAP TO UPLOAD FORM-21'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'form21Document')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* PAN Card Document Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Upload PAN Card Document (Optional)</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-xs font-bold text-slate-600 truncate">
                    {files.panCardDocument ? files.panCardDocument.name : 'TAP TO UPLOAD PAN CARD'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'panCardDocument')}
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
                <label className="text-xs font-bold text-slate-700">PAN Card Number</label>
                <input
                  type="text"
                  name="panCardNumber"
                  value={formData.panCardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, panCardNumber: e.target.value.toUpperCase() }))}
                  placeholder="Enter 10-digit PAN card number (e.g. ABCDE1234F)"
                  maxLength={10}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 uppercase outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleTextChange}
                  placeholder="Enter bank name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleTextChange}
                  placeholder="Enter account holder name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#15803d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Account Number</label>
                <input
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
                  <label className="text-xs font-bold text-slate-700">IFSC Code</label>
                  <input
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

            {/* Error Message Display */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-600 flex items-center gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
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

      {/* 📷 LIVE SELFIE CAMERA MODAL */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/70 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Camera size={18} className="text-emerald-400" />
                <span className="font-bold text-xs">Live Captain Selfie Capture</span>
              </div>
              <div className="flex items-center gap-1.5">
                {!tempCapturedImage && !cameraError && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    title="Switch Camera (Front/Back)"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  >
                    <RefreshCw size={14} />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Viewfinder / Preview Area */}
            <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[420px] overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center space-y-3 max-w-xs">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-200">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md mx-auto"
                  >
                    <RotateCcw size={14} /> Try Again
                  </button>
                </div>
              ) : tempCapturedImage ? (
                /* Snapped Photo Preview */
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={tempCapturedImage}
                    alt="Captured Selfie"
                    className="w-full h-auto max-h-[380px] object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                    <Check size={12} strokeWidth={3} /> Photo Captured
                  </div>
                </div>
              ) : (
                /* Live Camera Stream with Face Oval Guide */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-auto max-h-[380px] object-cover ${cameraFacingMode === 'user' ? '-scale-x-100' : ''}`}
                  />

                  {/* Oval Face Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                    <div className="w-48 h-60 sm:w-56 sm:h-72 border-2 border-dashed border-emerald-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-emerald-300/90 bg-black/60 px-2 py-0.5 rounded-full">
                        Fit Face Here
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 font-medium whitespace-nowrap">
                    Keep your head centered & look at camera
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls / Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              {tempCapturedImage ? (
                /* Confirm / Retake Controls */
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTempCapturedImage('')}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                  <button
                    type="button"
                    onClick={confirmSelfie}
                    className="flex-1 py-3 px-4 bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Check size={15} strokeWidth={3} /> Use This Photo
                  </button>
                </div>
              ) : !cameraError ? (
                /* Shutter Button */
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={snapSelfie}
                    className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 p-1 flex items-center justify-center shadow-lg transition-transform transform active:scale-90 cursor-pointer"
                  >
                    <div className="w-13 h-13 rounded-full border-2 border-slate-900 bg-[#15803d] flex items-center justify-center text-white">
                      <Camera size={22} />
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
};

export default CaptainRegister;
