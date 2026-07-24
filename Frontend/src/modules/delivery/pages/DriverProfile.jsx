import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverProfile = () => {
  const navigate = useNavigate();
  const [autoAccept, setAutoAccept] = useState(true);
  const [voiceNav, setVoiceNav] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of ShippNex Dispatch?')) {
      navigate('/driver/login');
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-28">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl font-bold text-primary">Driver Profile</h1>
            <p className="text-xs text-on-surface-variant">Account settings & vehicle telematics</p>
          </div>
          <button
            onClick={() => alert('Editing driver profile details...')}
            className="p-2 text-primary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 max-w-7xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-3xl border-white/60 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full border-4 border-secondary-container object-cover shadow-lg"
              alt="Marcus Reed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWXL3Qu0JRKDr039sF-aSx5rQfnGlz0S99DOqkSfKyAgFhfUIw6hAHglW9IK7FrROv33gWnGtkkeVe68aWnWRPo_JlvATZfBAwj3J1cTKNvZ2mkDmumyw4cVA5K8nxu-TyA-YCKB_Te10l5t920ethYbEdBGNGETh4MD316jQl5JqOZ1J-KxaJv4EH7uz0OkhKAME-QMK4hcqD20kyxCmIHXk2cGjM4GlLzhbLWAUTyPQalJ1U5BYsmrA2EGL2nH15ow7kn24EAxA"
            />
            <div className="absolute bottom-0 right-0 bg-secondary text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">verified</span>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h2 className="text-2xl font-bold text-primary">Marcus Reed</h2>
              <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-0.5 rounded-full">
                PLATINUM DRIVER
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Senior Logistics Specialist • ID #SNX-DRV-4091</p>

            {/* Metrics */}
            <div className="flex justify-center md:justify-start gap-6 pt-2">
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

        {/* Assigned Vehicle Telematics */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <div>
              <h3 className="font-bold text-base text-primary">Assigned Vehicle</h3>
              <p className="text-xs text-on-surface-variant">Volvo FH Electric Heavy Duty • Plate #SNX-9921</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-primary">local_shipping</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Battery Level</p>
              <p className="text-base font-bold text-secondary mt-0.5">82% Charged</p>
              <p className="text-[10px] text-on-surface-variant">240 km estimated range</p>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Tire Pressure</p>
              <p className="text-base font-bold text-primary mt-0.5">110 PSI</p>
              <p className="text-[10px] text-emerald-600 font-semibold">All 18 Wheels Optimal</p>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Brake Pad Health</p>
              <p className="text-base font-bold text-primary mt-0.5">94% Good</p>
              <p className="text-[10px] text-on-surface-variant">Inspected 2 days ago</p>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Next Maintenance</p>
              <p className="text-base font-bold text-primary mt-0.5">4,200 km</p>
              <p className="text-[10px] text-on-surface-variant">Scheduled: Aug 15</p>
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
              <div key={idx} className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
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
                <p className="text-[11px] text-on-surface-variant">Automatically lock jobs paying over $100</p>
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

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverProfile;
