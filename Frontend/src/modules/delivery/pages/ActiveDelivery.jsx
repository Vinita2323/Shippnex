import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';
import { captainService } from '../../../services/authService';

const STEP_MAP = {
  'Assigned': 1,
  'Accepted': 1,
  'At Pickup': 2,
  'Picked Up': 3,
  'In Transit': 3,
  'Delivered': 4,
};

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'dispatch', text: 'You have an active delivery assigned. Proceed to pickup location.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchActiveDelivery();
  }, []);

  const fetchActiveDelivery = async () => {
    setLoading(true);
    try {
      const res = await captainService.getActiveDelivery();
      if (res.success && res.order) {
        setActiveOrder(res.order);
        setCurrentStep(STEP_MAP[res.order.captainStatus] || 1);
      } else {
        setActiveOrder(null);
      }
    } catch (err) {
      console.error('Fetch active delivery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!activeOrder) return;
    setStatusUpdating(true);
    try {
      await captainService.updateDeliveryStatus(activeOrder.orderId || activeOrder._id, newStatus);
      setCurrentStep(STEP_MAP[newStatus] || 1);
      setActiveOrder(prev => ({ ...prev, captainStatus: newStatus }));

      if (newStatus === 'Delivered') {
        navigate('/captain/delivery-verification');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert(err?.response?.data?.message || 'Failed to update status. Try again.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCall = () => {
    setShowCallingModal(true);
    const phone = activeOrder?.shippingAddress?.phone || activeOrder?.user?.phone;
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleSendChatMessage = (textToSend) => {
    const msg = textToSend || newMessage;
    if (!msg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'captain', text: msg, time: now }]);
    setNewMessage('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'dispatch', text: 'Copy that. Update logged in dispatch console.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-5xl text-secondary animate-spin">sync</span>
        <p className="text-sm font-semibold text-on-surface-variant">Loading active delivery…</p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">local_shipping</span>
        <h2 className="font-bold text-lg text-primary">No Active Delivery</h2>
        <p className="text-sm text-on-surface-variant">You don't have any active delivery right now. Accept a job from your job queue.</p>
        <button onClick={() => navigate('/captain/jobs')} className="mt-2 px-6 py-3 bg-secondary text-white font-bold text-sm rounded-xl cursor-pointer">
          View Job Queue
        </button>
        <CaptainBottomNav />
      </div>
    );
  }

  const recipientName = activeOrder.shippingAddress?.fullName || activeOrder.user?.name || 'Customer';
  const recipientPhone = activeOrder.shippingAddress?.phone || activeOrder.user?.phone || '';
  const pickupAddress = 'Seller Warehouse';
  const dropAddress = `${activeOrder.shippingAddress?.addressLine1}, ${activeOrder.shippingAddress?.city}`;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-2xl md:rounded-b-3xl border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 border-2 border-[#97fc43] shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Captain Profile"
              src={localStorage.getItem('shippnex_captain_avatar') || "https://ui-avatars.com/api/?name=Captain&background=366b00&color=fff"}
            />
          </div>
          <div className="leading-tight mt-0.5">
            <h1 className="font-headline-md text-sm md:text-base font-bold text-white tracking-wide">ShippNex Nav</h1>
            <p className="text-[9px] md:text-[10px] text-[#97fc43] uppercase font-bold tracking-widest mt-0.5">
              #{activeOrder.orderId} • {activeOrder.shippingAddress?.city || 'In Transit'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/captain/notifications')}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors relative cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-2 border-[#002625] bg-[#97fc43] rounded-full"></span>
        </button>
      </header>

      <main className="pt-20 md:pt-24 px-3.5 max-w-3xl mx-auto space-y-3 mt-2.5">
        {/* Order Header Card */}
        <div className="glass-panel p-3.5 rounded-xl shadow-xs border-white/60 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-black block">Active Shipment</span>
            <h2 className="font-headline-md text-base md:text-lg font-black text-primary truncate mt-0.5">Order #{activeOrder.orderId}</h2>
          </div>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-xs font-bold shadow-xs shrink-0 whitespace-nowrap">
            {activeOrder.captainStatus?.toUpperCase() || 'IN TRANSIT'}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-3 rounded-xl shadow-xs border-white/60 flex justify-around items-center">
          <button
            onClick={handleCall}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer border-r border-outline-variant/20"
          >
            <div className="w-11 h-11 rounded-full bg-secondary-container text-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <span className="text-xs font-bold text-primary">Call Customer</span>
          </button>

          <button
            onClick={() => setShowChatModal(true)}
            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-primary-container text-primary-fixed-dim flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <span className="text-xs font-bold text-primary">Chat / Message</span>
          </button>
        </div>

        {/* Pickup & Drop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">warehouse</span>
              <span className="font-label-sm text-[10px] font-black text-outline uppercase tracking-wider">PICKUP LOCATION</span>
            </div>
            <p className="font-extrabold text-sm text-on-surface">Seller Warehouse</p>
            <p className="text-on-surface-variant text-xs truncate">Contact admin for exact pickup address</p>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-white/60 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">location_on</span>
              <span className="font-label-sm text-[10px] font-black text-outline uppercase tracking-wider">DROP-OFF LOCATION</span>
            </div>
            <p className="font-extrabold text-sm text-on-surface">{recipientName}</p>
            <p className="text-on-surface-variant text-xs truncate">{dropAddress}</p>
          </div>
        </div>

        {/* Delivery Progress */}
        <div className="glass-panel p-4 rounded-xl shadow-xs border-white/60 space-y-3.5">
          <h3 className="font-label-sm text-xs text-outline tracking-widest uppercase font-black">Delivery Progress</h3>
          <div className="space-y-3.5 relative before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-outline-variant/40">
            {[
              { step: 1, label: 'Order Accepted', sub: 'Captain assigned & accepted order' },
              { step: 2, label: 'Reached Store', sub: currentStep >= 2 ? 'Arrived at pickup location' : 'Proceeding to pickup location' },
              { step: 3, label: 'Out for Delivery', sub: currentStep >= 3 ? `Delivering to ${activeOrder.shippingAddress?.city || 'customer'}` : 'Pending store pickup' },
              { step: 4, label: 'Delivered', sub: 'Customer OTP verification & completed' },
            ].map(({ step, label, sub }) => (
              <div key={step} className="flex gap-3 relative z-10 items-start">
                <div className={`w-4.5 h-4.5 rounded-full border-2 border-surface shrink-0 mt-0.5 ${
                  currentStep >= step
                    ? step === currentStep ? 'bg-secondary-container ring-2 ring-secondary' : 'bg-secondary'
                    : 'bg-outline-variant'
                }`} />
                <div>
                  <p className={`font-bold text-xs md:text-sm ${currentStep >= step ? 'text-primary' : 'text-outline'}`}>{label}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {activeOrder.captainStatus === 'Accepted' && (
              <button
                onClick={() => handleUpdateStatus('At Pickup')}
                disabled={statusUpdating}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? <span className="material-symbols-outlined animate-spin text-base">sync</span> : <span className="material-symbols-outlined text-base">store</span>}
                Arrived at Store / Pickup
              </button>
            )}
            {activeOrder.captainStatus === 'At Pickup' && (
              <button
                onClick={() => handleUpdateStatus('In Transit')}
                disabled={statusUpdating}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {statusUpdating ? <span className="material-symbols-outlined animate-spin text-base">sync</span> : <span className="material-symbols-outlined text-base">local_shipping</span>}
                Pick Up & Start Delivery
              </button>
            )}
            {(activeOrder.captainStatus === 'In Transit' || activeOrder.captainStatus === 'Picked Up') && (
              <button
                onClick={() => navigate('/captain/delivery-verification')}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Complete Drop-off (Verify OTP)
              </button>
            )}
          </div>
        </div>

        {/* Earnings Card */}
        <div className="glass-panel p-4 rounded-xl border border-white/60 flex justify-between items-center">
          <div>
            <p className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Your Payout</p>
            <p className="text-2xl font-extrabold text-secondary mt-1">₹{(activeOrder.captainEarnings || 0).toFixed(2)}</p>
          </div>
          <div className="text-right text-xs text-on-surface-variant">
            <p className="font-bold text-primary">{activeOrder.items?.length || 0} items</p>
            <p>{activeOrder.deliverySlot?.time || 'Standard'}</p>
          </div>
        </div>
      </main>

      {/* Calling Modal */}
      {showCallingModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border-white shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">Calling Customer...</h3>
              <p className="text-xs text-on-surface-variant mt-1">{recipientPhone}</p>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-0.5">Order #{activeOrder.orderId}</p>
            </div>
            <button onClick={() => setShowCallingModal(false)} className="w-full py-2.5 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 transition-all cursor-pointer">
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col w-full h-[100dvh] overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowChatModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer">
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs shrink-0">DP</div>
              <div className="leading-tight">
                <h3 className="font-bold text-sm text-white">Dispatcher Support</h3>
                <p className="text-[10px] text-secondary-fixed font-medium">Order #{activeOrder.orderId}</p>
              </div>
            </div>
            <button onClick={() => setShowChatModal(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-surface-container-lowest">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === 'captain' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[82%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'captain'
                    ? 'bg-secondary text-white rounded-br-none shadow-xs'
                    : 'bg-surface-container-high text-primary rounded-bl-none border border-outline-variant/30 shadow-xs'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-outline mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="px-3.5 py-2 bg-surface-container-low flex gap-2 overflow-x-auto hide-scrollbar border-t border-outline-variant/20 shrink-0">
            {['Arrived at pickup', 'Traffic delay +10m', 'Package loaded', 'Reached destination'].map((chip) => (
              <button key={chip} onClick={() => handleSendChatMessage(chip)} className="px-3 py-1.5 bg-white border border-outline-variant/40 rounded-full text-xs font-bold text-primary hover:bg-secondary/10 whitespace-nowrap cursor-pointer shadow-xs">
                {chip}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-outline-variant/20 flex gap-2 shrink-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Type message to dispatcher..."
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:ring-1 focus:ring-secondary focus:outline-none"
            />
            <button onClick={() => handleSendChatMessage()} className="px-4 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}

      {!showChatModal && <CaptainBottomNav />}
    </div>
  );
};

export default ActiveDelivery;
