import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3); // 1: Shift, 2: Pickup, 3: In Transit, 4: Delivered

  const handleCall = () => {
    alert('Calling Dispatcher at NexGen Fulfilment (+1 800 555 0199)...');
  };

  const handleChat = () => {
    alert('Opening encrypted live chat with dispatch team...');
  };

  const handleNavigate = () => {
    navigate('/driver/navigation-active');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Compact Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2.5 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="p-1.5 rounded-lg hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-fixed border border-secondary-fixed shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Driver Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsf0YqUfmzLmy9UGvpLZ3D1i_eeYyDLS8tW8R5-RRgLjawmbAhDUY4x8P1PZjth4SklRupUNZ5HGpqhp9QmHIVGM2KInMVWjSipTskHVcffILdPAGn-Fuk6n_WBjxr1jJU0WfzT_OqQsLti5OGPpFfogpL80PKIvA3beoEfjjDdS9P1k6rxlu2N7tKEFn1wPi_4AbHxfL19v6d4S4ii_nVkyTPZu1UbowNUhPTBqYqmFJ5aVyfDUZynjhyw5_5SrTs3rTW4Afj4NU"
            />
          </div>
          <div className="leading-tight">
            <h1 className="font-headline-md text-sm font-bold text-primary">ShippNex Navigation</h1>
            <p className="text-[10px] text-on-surface-variant font-medium">Vehicle #SNX-1024 • Chicago</p>
          </div>
        </div>
        <button
          onClick={() => alert('Notifications: Traffic delay detected on I-90 E (+6 mins)')}
          className="p-1.5 text-primary hover:opacity-80 transition-opacity relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full"></span>
        </button>
      </header>

      {/* Main Content Container - Directly on Page */}
      <main className="pt-16 md:pt-20 px-3.5 max-w-3xl mx-auto space-y-3.5 mt-2">
        {/* Order Header Card */}
        <div className="glass-panel p-4 rounded-2xl shadow-sm border-white/60 flex justify-between items-center">
          <div>
            <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-bold">Active Shipment</span>
            <h2 className="font-headline-md text-xl font-extrabold text-primary mt-0.5">Order #SNX-1024</h2>
          </div>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-xs font-bold shadow-xs">
            {currentStep === 4 ? 'DELIVERED' : 'IN TRANSIT'}
          </div>
        </div>

        {/* Action Quick Bar */}
        <div className="glass-panel p-3.5 rounded-2xl shadow-sm border-white/60 flex justify-around items-center">
          <button onClick={handleCall} className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-primary-container text-primary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-lg">call</span>
            </div>
            <span className="text-[11px] font-label-sm font-bold text-primary">Call</span>
          </button>

          <button onClick={handleChat} className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-primary-container text-primary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-lg">chat</span>
            </div>
            <span className="text-[11px] font-label-sm font-bold text-primary">Chat</span>
          </button>

          <button onClick={handleNavigate} className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-secondary-container text-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-lg active-icon">near_me</span>
            </div>
            <span className="text-[11px] font-label-sm font-bold text-secondary">Navigate</span>
          </button>
        </div>

        {/* Warehouse & Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="glass-panel p-4 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">warehouse</span>
              <span className="font-label-sm text-[10px] font-bold text-outline uppercase tracking-wider">PICKUP LOCATION</span>
            </div>
            <p className="font-bold text-sm text-on-surface">Global Logistics Hub A1</p>
            <p className="text-on-surface-variant text-xs">2424 Enterprise Way, Suite 100, North District</p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">location_on</span>
              <span className="font-label-sm text-[10px] font-bold text-outline uppercase tracking-wider">DROP-OFF LOCATION</span>
            </div>
            <p className="font-bold text-sm text-on-surface">NexGen Fulfilment Center</p>
            <p className="text-on-surface-variant text-xs">1200 Tech Boulevard, East Wing, Bay 42</p>
          </div>
        </div>

        {/* Vertical Delivery Timeline */}
        <div className="glass-panel p-4.5 rounded-2xl shadow-sm border-white/60 space-y-4">
          <h3 className="font-label-sm text-xs text-outline tracking-widest uppercase font-bold">Delivery Progress</h3>
          <div className="space-y-4 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
            {/* Step 1 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(1)}>
              <div className={`w-5 h-5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 1 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs ${currentStep >= 1 ? 'text-primary' : 'text-outline'}`}>Shift Started</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">Industrial Hub North • 08:00 AM</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(2)}>
              <div className={`w-5 h-5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 2 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs ${currentStep >= 2 ? 'text-primary' : 'text-outline'}`}>Pickup Verified</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">Global Logistics Hub A1 • 09:15 AM</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(3)}>
              <div className={`w-5 h-5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 3 ? 'bg-secondary-container ring-2 ring-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs ${currentStep >= 3 ? 'text-primary' : 'text-outline'}`}>In Transit</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">ETA: 11:45 AM (3.2 km remaining)</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(4)}>
              <div className={`w-5 h-5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 4 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs ${currentStep >= 4 ? 'text-primary' : 'text-outline'}`}>Drop-off Completion</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">Pending Signature at Bay 42</p>
              </div>
            </div>
          </div>

          {currentStep < 4 ? (
            <button
              onClick={() => navigate('/driver/delivery-verification')}
              className="w-full mt-4 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Complete Drop-off
            </button>
          ) : (
            <button
              onClick={() => navigate('/driver/dashboard')}
              className="w-full mt-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </main>

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default ActiveDelivery;
