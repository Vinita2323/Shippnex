import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverProfile = () => {
  const navigate = useNavigate();
  const [autoAccept, setAutoAccept] = useState(true);
  const [voiceNav, setVoiceNav] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [driverName, setDriverName] = useState('vini');
  const [driverEmail, setDriverEmail] = useState('vini@shippnex.com');
  const [driverPhone, setDriverPhone] = useState('+91 9302841832');
  const [driverAvatar, setDriverAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCWXL3Qu0JRKDr039sF-aSx5rQfnGlz0S99DOqkSfKyAgFhfUIw6hAHglW9IK7FrROv33gWnGtkkeVe68aWnWRPo_JlvATZfBAwj3J1cTKNvZ2mkDmumyw4cVA5K8nxu-TyA-YCKB_Te10l5t920ethYbEdBGNGETh4MD316jQl5JqOZ1J-KxaJv4EH7uz0OkhKAME-QMK4hcqD20kyxCmIHXk2cGjM4GlLzhbLWAUTyPQalJ1U5BYsmrA2EGL2nH15ow7kn24EAxA');
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of ShippNex Dispatch?')) {
      navigate('/driver/login');
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-28">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-3xl px-4 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-black text-white tracking-tight">Driver Profile</h1>
            <p className="text-[10px] md:text-xs text-[#97fc43] font-medium tracking-wide uppercase mt-0.5">Account settings & telematics</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl p-2 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
          >
            <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 px-4 max-w-7xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-3xl border-white/60 flex flex-col items-center gap-4 max-w-xs mx-auto text-center w-full">
          <div className="relative group">
            <img
              className="w-24 h-24 rounded-full border-4 border-[#97fc43] object-cover shadow-lg bg-white"
              alt={driverName}
              src={driverAvatar || 'https://via.placeholder.com/150'}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
            />
            {isEditing && (
              <div 
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                onClick={() => {
                  const url = prompt('Enter image URL for Avatar:', driverAvatar);
                  if (url) setDriverAvatar(url);
                }}
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span className="text-[9px] font-bold mt-1">UPDATE</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#002625] text-[#97fc43] p-1 rounded-full border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-sm font-bold">verified</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className="flex flex-col items-center gap-3 w-full">
              {isEditing ? (
                <div className="flex flex-col gap-3 w-full animate-fade-in pb-2">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-[#002625] uppercase font-bold ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={driverName} 
                      onChange={(e) => setDriverName(e.target.value)}
                      className="text-sm font-bold text-primary bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-[#002625] uppercase font-bold ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={driverEmail} 
                      onChange={(e) => setDriverEmail(e.target.value)}
                      className="text-sm text-primary bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-[#002625] uppercase font-bold ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={driverPhone} 
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="text-sm text-primary bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 w-full animate-fade-in">
                  <h2 className="text-2xl font-bold text-[#002625]">{driverName}</h2>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="material-symbols-outlined text-[14px] text-[#15803d]">mail</span>
                    {driverEmail}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="material-symbols-outlined text-[14px] text-[#15803d]">call</span>
                    {driverPhone}
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <span className="bg-[#97fc43] text-[#002625] text-xs font-bold px-3 py-1 rounded-full mt-1 shadow-sm">
                  PLATINUM DRIVER
                </span>
              )}
            </div>
            
            {!isEditing && (
              <p className="text-[11px] text-slate-500 leading-relaxed px-4 pt-2 border-t border-slate-100">Senior Logistics Specialist • ID #SNX-DRV-4091</p>
            )}

            {/* Metrics */}
            <div className={`flex justify-center gap-6 ${!isEditing ? 'pt-2' : 'pt-2 mt-2 border-t border-slate-100'}`}>
              <div>
                <div className="flex items-center gap-1 font-bold text-primary text-base">
                  <span className="material-symbols-outlined text-amber-500 text-base active-icon">star</span>
                  4.98
                </div>
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Rating</p>
              </div>
              <div className="border-r border-outline-variant/30 h-8"></div>
              <div>
                <p className="font-bold text-primary text-base">1,420</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Trips Done</p>
              </div>
              <div className="border-r border-outline-variant/30 h-8"></div>
              <div>
                <p className="font-bold text-secondary text-base">99.4%</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">On-Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle Basic Info */}
        <div className="glass-panel p-5 rounded-3xl border-white/60 space-y-4 max-w-xs mx-auto">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <div>
              <h3 className="font-bold text-sm text-primary">Assigned Vehicle</h3>
              <p className="text-[10px] text-on-surface-variant">Plate #SNX-9921</p>
            </div>
            <span className="bg-[#97fc43] text-[#002625] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-full h-32 bg-surface-container-low rounded-xl overflow-hidden shadow-sm shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop" 
                alt="Volvo FH16 Diesel Heavy Duty" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-center">
              <div>
                <p className="text-[9px] font-label-sm text-on-surface-variant uppercase tracking-wider">Vehicle Model</p>
                <p className="text-sm font-bold text-primary leading-tight mt-0.5">Volvo FH16 Diesel Heavy Duty</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-left">
                <div className="bg-surface-container-low/70 p-2 rounded-xl border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-label-sm text-on-surface-variant uppercase">Type</p>
                  <p className="text-xs font-bold text-primary mt-0.5">Heavy Freight</p>
                </div>
                <div className="bg-surface-container-low/70 p-2 rounded-xl border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-label-sm text-on-surface-variant uppercase">Capacity</p>
                  <p className="text-xs font-bold text-primary mt-0.5">44 Tons</p>
                </div>
                <div className="bg-surface-container-low/70 p-2 rounded-xl border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-label-sm text-on-surface-variant uppercase">Fuel Type</p>
                  <p className="text-xs font-bold text-primary mt-0.5">Diesel</p>
                </div>
                <div className="bg-surface-container-low/70 p-2 rounded-xl border border-outline-variant/20 text-center">
                  <p className="text-[9px] font-label-sm text-on-surface-variant uppercase">Year</p>
                  <p className="text-xs font-bold text-primary mt-0.5">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Documents Verification */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-primary">Compliance & Documents</h3>

          <div className="space-y-2.5">
            {[
              { title: 'Commercial Driver License (CDL Class A)', expire: 'Expires Dec 2028', status: 'VERIFIED' },
              { title: 'HazMat & Heavy Freight Permit', expire: 'Expires Oct 2027', status: 'VERIFIED' },
              { title: 'ISO 27001 Logistics Safety Certification', expire: 'Expires Jan 2027', status: 'VERIFIED' },
              { title: 'Commercial Vehicle Insurance Policy', expire: 'Active (Renewal: Nov 2026)', status: 'ACTIVE' },
            ].map((doc, idx) => (
              <div 
                key={idx} 
                onClick={() => setPreviewDoc(doc)}
                className="flex justify-between items-center p-3 bg-surface-container-low hover:bg-surface-container-low/60 rounded-xl border border-outline-variant/20 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">verified_user</span>
                  <div>
                    <p className="font-bold text-xs text-primary">{doc.title}</p>
                    <p className="text-[11px] text-on-surface-variant">{doc.expire}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences & Toggles */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-primary">App Preferences</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-xs text-primary">Auto-Accept High-Payout Offers</p>
                <p className="text-[11px] text-on-surface-variant">Automatically lock jobs paying over ₹1,000</p>
              </div>
              <input
                type="checkbox"
                checked={autoAccept}
                onChange={(e) => setAutoAccept(e.target.checked)}
                className="w-5 h-5 accent-secondary rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center border-t border-outline-variant/20 pt-3">
              <div>
                <p className="font-bold text-xs text-primary">Voice Guidance Navigation</p>
                <p className="text-[11px] text-on-surface-variant">Turn-by-turn auditory route prompts</p>
              </div>
              <input
                type="checkbox"
                checked={voiceNav}
                onChange={(e) => setVoiceNav(e.target.checked)}
                className="w-5 h-5 accent-secondary rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center border-t border-outline-variant/20 pt-3">
              <div>
                <p className="font-bold text-xs text-primary">Night Mode</p>
                <p className="text-[11px] text-on-surface-variant">High contrast theme for nocturnal driving</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-5 h-5 accent-secondary rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <button
            onClick={() => alert('Broadcasting Emergency SOS to Dispatch Central...')}
            className="flex-1 py-3.5 bg-error/10 border border-error/30 text-error hover:bg-error/20 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            Emergency SOS Dispatch
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3.5 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        </div>
      </main>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
          <div 
            className="bg-surface rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-outline-variant/20">
              <h3 className="font-bold text-primary truncate pr-4 text-sm">{previewDoc.title}</h3>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors flex-shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-4 bg-surface-container-low flex justify-center">
               <div className="relative w-full aspect-[3/4] bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden flex items-center justify-center">
                 {/* Placeholder for actual document image. Using a stylized placeholder */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                   <span className="material-symbols-outlined text-6xl text-primary mb-2">description</span>
                   <p className="font-bold text-xs tracking-widest text-primary">OFFICIAL DOCUMENT</p>
                 </div>
                 
                 <div className="absolute inset-x-8 top-12 h-px bg-primary/20"></div>
                 <div className="absolute inset-x-8 top-16 h-px bg-primary/20"></div>
                 <div className="absolute inset-x-8 top-20 h-px bg-primary/20"></div>
                 <div className="absolute inset-x-8 top-24 h-px bg-primary/20 w-1/2"></div>
                 
                 <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-2 border-secondary flex items-center justify-center opacity-80 rotate-[-15deg]">
                   <div className="w-14 h-14 border border-secondary rounded-full flex items-center justify-center">
                     <span className="text-[10px] font-black text-secondary">VERIFIED</span>
                   </div>
                 </div>
               </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-surface">
              <span className="text-xs text-on-surface-variant font-medium">Status: <strong className={previewDoc.status === 'VERIFIED' ? 'text-secondary' : 'text-primary'}>{previewDoc.status}</strong></span>
              <span className="text-xs text-on-surface-variant font-medium">{previewDoc.expire}</span>
            </div>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverProfile;
