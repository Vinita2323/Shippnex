import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, HelpCircle, ChevronRight, Check, Truck, MapPin, CreditCard, Box, ShieldCheck, Clock, User, Phone, KeyRound } from 'lucide-react';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import { orderService } from '../../../services/authService';

const TrackOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialOrder = location.state?.order;

  const [liveOrder, setLiveOrder] = useState(initialOrder || null);
  const [loadingOrder, setLoadingOrder] = useState(!initialOrder);

  // Poll for live status update every 4 seconds
  useEffect(() => {
    const targetId = liveOrder?._id || liveOrder?.id || liveOrder?.orderId || initialOrder?._id || initialOrder?.orderId;
    if (!targetId) return;

    let isMounted = true;
    const fetchLive = async () => {
      try {
        const res = await orderService.getOrderById(targetId);
        if (isMounted && res.success && res.order) {
          setLiveOrder(res.order);
        }
      } catch (err) {
        console.warn('TrackOrder fetch error:', err.message);
      } finally {
        if (isMounted) setLoadingOrder(false);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const order = liveOrder || initialOrder;

  // Order Details
  const orderId = order?.id || order?.orderId || order?._id || 'ORD-849201';
  const orderDate = order?.date || (order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today');
  const orderStatus = order?.orderStatus || order?.status || 'Placed';
  const captainStatus = order?.captainStatus || '';
  const deliveryOtp = order?.deliveryOtp || '';

  const items = order?.items && order.items.length > 0 ? order.items : [
    { name: 'Basmati Rice Premium 5kg', price: 540, quantity: 1, image: grainsImg }
  ];
  const grandTotal = order?.total || order?.grandTotal || items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const shippingAddress = order?.shippingAddress || {
    fullName: localStorage.getItem('shippnex_user_name') || 'Customer',
    addressLine1: 'Sector 45, Near Film City',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    phone: localStorage.getItem('shippnex_user_phone') || '+91 9876543210',
  };
  const paymentMethod = order?.paymentMethod || 'COD';
  const paymentStatus = order?.paymentStatus || (paymentMethod === 'COD' ? 'Pending' : 'Paid');

  // Status steps mapping
  const steps = [
    { key: 'Placed', label: 'Order Placed', sub: 'Order received' },
    { key: 'Processing', label: 'Store Processing', sub: captainStatus === 'At Pickup' ? 'Captain at Store' : 'Preparing items' },
    { key: 'Out for Delivery', label: 'Out for Delivery', sub: 'On the way to you' },
    { key: 'Delivered', label: 'Delivered', sub: 'Order completed' },
  ];

  const getStepIndex = () => {
    if (orderStatus === 'Delivered' || captainStatus === 'Delivered') return 3;
    if (orderStatus === 'Out for Delivery' || captainStatus === 'In Transit' || captainStatus === 'Picked Up') return 2;
    if (orderStatus === 'Accepted' || orderStatus === 'Processing' || orderStatus === 'Reached Store / Pickup' || ['Assigned', 'Accepted', 'At Pickup'].includes(captainStatus)) return 1;
    return 0;
  };

  const currentStepIndex = getStepIndex();

  const getDisplayStatusBadge = () => {
    if (orderStatus === 'Delivered' || captainStatus === 'Delivered') return { text: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (orderStatus === 'Out for Delivery' || captainStatus === 'In Transit') return { text: 'Out for Delivery', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (captainStatus === 'At Pickup' || orderStatus === 'Reached Store / Pickup') return { text: 'Captain at Store', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (orderStatus === 'Accepted' || captainStatus === 'Accepted' || captainStatus === 'Assigned') return { text: 'Order Accepted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (orderStatus === 'Rejected') return { text: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' };
    return { text: 'Order Placed', color: 'bg-orange-50 text-[#ea580c] border-orange-200/60' };
  };

  const statusBadge = getDisplayStatusBadge();

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-4 bg-white border-b border-slate-100 z-10 sticky top-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} className="text-slate-800" />
          </button>
          <h2 className="text-[15px] font-extrabold tracking-wide m-0 text-slate-900 uppercase">Live Order Tracking</h2>
        </div>
        <button 
          onClick={() => navigate('/support')}
          className="bg-transparent border-none cursor-pointer p-0 flex items-center gap-1 text-[#ea580c] font-bold text-[12px]"
        >
          <HelpCircle size={16} />
          HELP
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-[40px] [&::-webkit-scrollbar]:hidden p-4 space-y-4">
        
        {/* Order Header Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
          <div className="flex justify-between items-start pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Order ID</span>
              <span className="text-[15px] font-extrabold text-slate-900">#{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Placed On</span>
              <span className="text-[13px] font-bold text-slate-700">{orderDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-500">Live Status</span>
            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase border ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
          </div>

          {/* Delivery OTP Box for Customer */}
          {deliveryOtp && orderStatus !== 'Delivered' && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <KeyRound size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block">Delivery Verification OTP</span>
                  <span className="text-[11px] text-emerald-700">Share this code with the delivery partner upon arrival</span>
                </div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-xs font-mono font-black text-base text-emerald-900 tracking-widest">
                {deliveryOtp}
              </div>
            </div>
          )}

          {/* Rejection Alert Box */}
          {orderStatus === 'Rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs mt-1">
              <span className="font-extrabold block text-red-800">✕ Order Rejected by Seller</span>
              <span className="font-medium text-slate-700">Reason: "{order?.rejectionReason || 'Unable to fulfill order'}"</span>
            </div>
          )}
        </div>

        {/* Live Delivery Progress Steps */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#ea580c]" />
              <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider m-0">Delivery Progress</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Auto-synced</span>
          </div>

          <div className="relative py-2">
            <div className="flex justify-between relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5 w-1/4">
                    <div 
                      className={`w-[28px] h-[28px] rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted 
                          ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                    </div>
                    <span className={`text-[10px] text-center font-bold leading-tight ${isCurrent ? 'text-[#ea580c]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[9px] text-center text-slate-400 leading-tight">
                      {step.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Captain Information (If Assigned) */}
        {order?.captainId && (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Truck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Delivery Captain</span>
                <p className="text-xs font-bold text-slate-900 m-0">{order.captainId.name || 'Assigned Partner'}</p>
                <p className="text-[11px] text-emerald-700 font-semibold m-0">{order.captainId.vehicleType || 'Two Wheeler'} • {statusBadge.text}</p>
              </div>
            </div>
            {order.captainId.phone && (
              <a
                href={`tel:${order.captainId.phone}`}
                className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors shadow-2xs no-underline"
              >
                <Phone size={16} />
              </a>
            )}
          </div>
        )}

        {/* Real Order Items List */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
          <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider m-0">Ordered Items ({items.length})</h3>
          
          <div className="flex flex-col divide-y divide-slate-100">
            {items.map((item, idx) => {
              const itemImg = item.image || item.product?.mainImage || grainsImg;
              const itemName = item.name || item.product?.name || 'Product';
              const itemPrice = Number(item.price || item.product?.salePrice || 0);
              const qty = item.quantity || 1;
              const itemSubtotal = itemPrice * qty;

              return (
                <div key={idx} className="py-3 flex gap-3 items-center first:pt-0 last:pb-0">
                  <div className="w-[54px] h-[54px] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={itemImg} alt={itemName} className="w-[85%] h-[85%] object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <h4 className="text-[13px] font-bold text-slate-900 m-0 line-clamp-1">{itemName}</h4>
                    <span className="text-[12px] font-semibold text-slate-500">
                      ₹{itemPrice.toFixed(2)} × {qty}
                    </span>
                  </div>
                  <span className="text-[14px] font-extrabold text-slate-900 shrink-0">
                    ₹{itemSubtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={18} className="text-[#ea580c]" />
            <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider m-0">Delivery Address</h3>
          </div>
          <div className="pl-6 flex flex-col gap-1">
            <span className="text-[13px] font-bold text-slate-900">
              {shippingAddress.fullName || shippingAddress.name || 'Customer'}
            </span>
            <p className="text-[12px] text-slate-600 leading-relaxed m-0">
              {shippingAddress.addressLine1 || shippingAddress.address}
              {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
              {shippingAddress.landmark && ` (Near ${shippingAddress.landmark})`}
              <br />
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode || shippingAddress.zip}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 m-0 mt-1">
              📞 {shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment & Price Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
          <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider m-0">Payment Summary</h3>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-semibold text-slate-500">Payment Mode</span>
              <span className="font-bold text-slate-900 uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-semibold text-slate-500">Payment Status</span>
              <span className={`font-bold ${paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                {paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-semibold text-slate-500">Items Total</span>
              <span className="font-bold text-slate-900">₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="font-semibold text-slate-500">Delivery Charge</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>

            <div className="flex justify-between items-center pt-3 mt-1 border-t border-dashed border-slate-200">
              <span className="text-[14px] font-extrabold text-slate-900">Grand Total</span>
              <span className="text-[16px] font-extrabold text-slate-900">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
