import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3); // 1: Shift, 2: Pickup, 3: In Transit, 4: Delivered
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'dispatch', text: 'Order #SNX-1024 assigned. Priority Cold Chain cargo.', time: '09:00 AM' },
    { sender: 'driver', text: 'Arrived at Global Logistics Hub A1 Gate 4.', time: '09:12 AM' },
    { sender: 'dispatch', text: 'Verified! Please proceed to Bay 14 for loading.', time: '09:14 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleCall = () => {
    setShowCallingModal(true);
    // Trigger native tel prompt
    window.location.href = 'tel:+919876543210';
  };

  const handleSendChatMessage = (textToSend) => {
    const msg = textToSend || newMessage;
    if (!msg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'driver', text: msg, time: now }]);
    setNewMessage('');

    // Simulated dispatch reply after 1 sec
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'dispatch', text: 'Copy that. Update logged in dispatch console.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 1200);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Compact Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-2xl md:rounded-b-3xl border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 border-2 border-[#97fc43] shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Driver Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsf0YqUfmzLmy9UGvpLZ3D1i_eeYyDLS8tW8R5-RRgLjawmbAhDUY4x8P1PZjth4SklRupUNZ5HGpqhp9QmHIVGM2KInMVWjSipTskHVcffILdPAGn-Fuk6n_WBjxr1jJU0WfzT_OqQsLti5OGPpFfogpL80PKIvA3beoEfjjDdS9P1k6rxlu2N7tKEFn1wPi_4AbHxfL19v6d4S4ii_nVkyTPZu1UbowNUhPTBqYqmFJ5aVyfDUZynjhyw5_5SrTs3rTW4Afj4NU"
            />
          </div>
          <div className="leading-tight mt-0.5">
            <h1 className="font-headline-md text-sm md:text-base font-bold text-white tracking-wide">ShippNex Nav</h1>
            <p className="text-[9px] md:text-[10px] text-[#97fc43] uppercase font-bold tracking-widest mt-0.5">#SNX-1024 • Chicago</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/driver/notifications')}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors relative cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-2 border-[#002625] bg-[#97fc43] rounded-full"></span>
        </button>
      </header>

      {/* Main Content Container */}
      <main className="pt-20 md:pt-24 px-3.5 max-w-3xl mx-auto space-y-3 mt-2.5">
        {/* Order Header Card */}
        <div className="glass-panel p-3.5 rounded-xl shadow-xs border-white/60 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-black block">Active Shipment</span>
            <h2 className="font-headline-md text-base md:text-lg font-black text-primary truncate mt-0.5">Order #SNX-1024</h2>
          </div>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-xs font-bold shadow-xs shrink-0 whitespace-nowrap">
            {currentStep === 4 ? 'DELIVERED' : 'IN TRANSIT'}
          </div>
        </div>

        {/* Action Quick Bar - Working Call & Chat Buttons */}
        <div className="glass-panel p-3 rounded-xl shadow-xs border-white/60 flex justify-around items-center">
          <button
            onClick={handleCall}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer border-r border-outline-variant/20"
          >
            <div className="w-11 h-11 rounded-full bg-secondary-container text-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <span className="text-xs font-bold text-primary">Call Dispatch</span>
          </button>

          <button
            onClick={() => setShowChatModal(true)}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-primary-container text-primary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative">
              <span className="material-symbols-outlined text-xl">chat</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary-fixed rounded-full ring-2 ring-white"></span>
            </div>
            <span className="text-xs font-bold text-primary">Chat / Message</span>
          </button>
        </div>

        {/* Warehouse & Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">warehouse</span>
              <span className="font-label-sm text-[10px] font-black text-outline uppercase tracking-wider">PICKUP LOCATION</span>
            </div>
            <p className="font-extrabold text-sm text-on-surface">Global Logistics Hub A1</p>
            <p className="text-on-surface-variant text-xs truncate">2424 Enterprise Way, Suite 100, North District</p>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">location_on</span>
              <span className="font-label-sm text-[10px] font-black text-outline uppercase tracking-wider">DROP-OFF LOCATION</span>
            </div>
            <p className="font-extrabold text-sm text-on-surface">NexGen Fulfilment Center</p>
            <p className="text-on-surface-variant text-xs truncate">1200 Tech Boulevard, East Wing, Bay 42</p>
          </div>
        </div>

        {/* Vertical Delivery Timeline */}
        <div className="glass-panel p-4 rounded-xl shadow-xs border-white/60 space-y-3.5">
          <h3 className="font-label-sm text-xs text-outline tracking-widest uppercase font-black">Delivery Progress</h3>
          <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
            {/* Step 1 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(1)}>
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 1 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs md:text-sm ${currentStep >= 1 ? 'text-primary' : 'text-outline'}`}>Shift Started</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Industrial Hub North • 08:00 AM</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(2)}>
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 2 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs md:text-sm ${currentStep >= 2 ? 'text-primary' : 'text-outline'}`}>Pickup Verified</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Global Logistics Hub A1 • 09:15 AM</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(3)}>
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 3 ? 'bg-secondary-container ring-2 ring-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs md:text-sm ${currentStep >= 3 ? 'text-primary' : 'text-outline'}`}>In Transit</p>
                <p className="text-on-surface-variant text-xs mt-0.5">ETA: 11:45 AM (3.2 km remaining)</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 relative z-10 items-start cursor-pointer" onClick={() => setCurrentStep(4)}>
              <div className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 ${currentStep >= 4 ? 'bg-secondary' : 'bg-outline-variant'}`}></div>
              <div>
                <p className={`font-bold text-xs md:text-sm ${currentStep >= 4 ? 'text-primary' : 'text-outline'}`}>Drop-off Completion</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Pending Signature at Bay 42</p>
              </div>
            </div>
          </div>

          {currentStep < 4 ? (
            <button
              onClick={() => navigate('/driver/delivery-verification')}
              className="w-full mt-3 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Complete Drop-off
            </button>
          ) : (
            <button
              onClick={() => navigate('/driver/dashboard')}
              className="w-full mt-3 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </main>

      {/* Calling Dispatcher Modal */}
      {showCallingModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border-white shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">Dialing Dispatcher...</h3>
              <p className="text-xs text-on-surface-variant mt-1">+91 98765 43210</p>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-0.5">Connected • Order #SNX-1024</p>
            </div>
            <button
              onClick={() => setShowCallingModal(false)}
              className="w-full py-2.5 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 transition-all cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Full Page Chat / Messaging Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col w-full h-[100dvh] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                DP
              </div>
              <div className="leading-tight">
                <h3 className="font-bold text-sm text-white">Dispatcher Support</h3>
                <p className="text-[10px] text-secondary-fixed font-medium">Live • Order #SNX-1024</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatModal(false)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Chat Thread - Full Page Scrollable */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-surface-container-lowest">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'driver' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'driver'
                      ? 'bg-secondary text-white rounded-br-none shadow-xs'
                      : 'bg-surface-container-high text-primary rounded-bl-none border border-outline-variant/30 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-outline mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Chips */}
          <div className="px-3.5 py-2 bg-surface-container-low flex gap-2 overflow-x-auto hide-scrollbar border-t border-outline-variant/20 shrink-0">
            {['Arrived at pickup', 'Traffic delay +10m', 'Package loaded'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendChatMessage(chip)}
                className="px-3 py-1.5 bg-white border border-outline-variant/40 rounded-full text-xs font-bold text-primary hover:bg-secondary/10 whitespace-nowrap cursor-pointer shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-outline-variant/20 flex gap-2 shrink-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Type message to dispatcher..."
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:ring-1 focus:ring-secondary focus:outline-none"
            />
            <button
              onClick={() => handleSendChatMessage()}
              className="px-4 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation (Hidden when chat modal is open) */}
      {!showChatModal && <DriverBottomNav />}
    </div>
  );
};

export default ActiveDelivery;
