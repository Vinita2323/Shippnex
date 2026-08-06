import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';

const getImageUrl = (url, fallback = grainsImg) => {
  if (!url) return fallback;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`;
    return `${baseUrl}${url}`;
  }
  return url;
};

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, originalTotal } = useCart();
  
  const safeCartTotal = Number(cartTotal || 0);
  const safeOriginalTotal = Number(originalTotal || 0);
  const deliveryCharge = safeCartTotal > 500 || safeCartTotal === 0 ? 0 : 40;
  const youSaved = Math.max(0, safeOriginalTotal - safeCartTotal);
  const grandTotal = safeCartTotal + deliveryCharge;

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 py-3 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <ArrowLeft size={22} color="white" className="cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="text-[20px] font-semibold m-0 text-white">Cart</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 [&::-webkit-scrollbar]:hidden">
        {/* Cart Items */}
        <div className="flex flex-col gap-3 mb-4">
          {cartItems.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <ShoppingCart size={28} className="text-slate-300" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-800 m-0 mb-1">Your cart is empty</h3>
              <p className="text-[13px] text-slate-400 m-0 text-center">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-5 bg-[#ff5500] text-white border-none rounded-lg px-6 py-2.5 text-[13px] font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemId = item.id || item._id;
              const itemPrice = Number(item.price ?? item.salePrice ?? 0);
              const itemImg = getImageUrl(item.image || item.mainImage);

              return (
                <div key={itemId} className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="w-[60px] h-[70px] flex justify-center items-center overflow-hidden rounded-lg bg-slate-50">
                    <img 
                      src={itemImg} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = grainsImg;
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[13px] font-bold text-slate-800 m-0 mb-1 max-w-[85%]">{item.name}</h4>
                      <button onClick={() => removeFromCart(itemId)} className="bg-transparent border-none cursor-pointer p-0 flex">
                        <Trash2 size={16} className="text-slate-300 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 m-0 mb-3">{item.unit || item.variation || '1 Pack'}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[15px] font-extrabold text-slate-900">₹{itemPrice.toFixed(2)}</span>
                      <div className="flex items-center gap-3 border border-slate-200 rounded-lg py-1 px-2">
                        <button onClick={() => updateQuantity(itemId, -1)} className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5 text-slate-500"><Minus size={14} /></button>
                        <span className="text-[13px] font-bold text-slate-900 min-w-[12px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemId, 1)} className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5 text-slate-500"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Apply Coupon */}
        {cartItems.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <Tag size={20} color="#64748b" />
              <span className="text-[13px] font-semibold text-slate-700">Apply Coupon</span>
            </div>
            <button className="bg-transparent border-none text-blue-600 text-[13px] font-semibold cursor-pointer">Apply</button>
          </div>
        )}

        {/* Bill Details */}
        {cartItems.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-medium text-slate-500">Item Total ({cartItems.length} items)</span>
              <span className="text-[12px] font-semibold text-slate-700">₹{safeCartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-medium text-slate-500">Delivery Charges</span>
              <div className="flex items-center gap-2">
                {deliveryCharge === 0 ? (
                  <>
                    <span className="text-[11px] text-slate-400 line-through">₹40.00</span>
                    <span className="text-[12px] font-bold text-green-500">FREE</span>
                  </>
                ) : (
                  <span className="text-[12px] font-semibold text-slate-700">₹{deliveryCharge.toFixed(2)}</span>
                )}
              </div>
            </div>
            {youSaved > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] font-medium text-slate-500">You Saved</span>
                <span className="text-[12px] font-bold text-green-500">- ₹{youSaved.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-slate-200">
              <span className="text-[14px] font-extrabold text-slate-900">Grand Total</span>
              <span className="text-[16px] font-extrabold text-slate-900">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {/* Padding for fixed buttons at bottom */}
        <div className="h-[100px]"></div>
      </div>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full pt-4 pb-6 px-5 bg-gradient-to-t from-white via-white/90 to-transparent z-[90]">
          <button 
            className="w-full bg-[#ff5500] text-white border-none rounded-xl p-4 text-[15px] font-bold cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.2)] transition-transform duration-200 active:scale-[0.98]" 
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout • ₹{grandTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
