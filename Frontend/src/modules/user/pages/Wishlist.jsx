import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 py-4 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <ArrowLeft size={22} color="white" className="cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="text-[20px] font-semibold m-0 text-white">My Wishlist</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden">
        {wishlistItems.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-[60vh]">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <Heart size={28} className="text-red-300" fill="currentColor" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800 m-0 mb-1">Your wishlist is empty</h3>
            <p className="text-[13px] text-slate-400 m-0 text-center">Save items you love here and buy them later.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-5 bg-[#ff5500] text-white border-none rounded-lg px-6 py-2.5 text-[13px] font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-6">
            {wishlistItems.map((item) => {
              const itemImg = item.image || item.mainImage || grainsImg;
              const itemPrice = item.price || item.salePrice || 0;
              const itemMrp = item.originalPrice || item.mrp || itemPrice;

              return (
                <div key={item.id || item._id} className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative border border-slate-50 cursor-pointer transition-transform hover:-translate-y-1" onClick={() => navigate(`/product/${item.id || item._id}`)}>
                  
                  {/* Image Section */}
                  <div className="relative w-full h-[145px] bg-slate-100 overflow-hidden">
                    <div 
                      className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs w-7 h-7 rounded-full flex items-center justify-center shadow-md cursor-pointer z-10 hover:bg-red-50 transition-all active:scale-95 border border-slate-100"
                      onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id || item._id); }}
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </div>
                    
                    <img 
                      src={itemImg} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = grainsImg; }}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>

                  {/* Details Section */}
                  <div className="p-2.5 pb-3 bg-white flex flex-col">
                    <h4 className="text-[12px] font-bold text-slate-800 m-0 mb-0.5 leading-tight">{item.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 m-0 mb-2">{item.brand || 'ShippNex Select'}</p>
                    
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[14px] font-extrabold text-slate-900">₹{itemPrice}</span>
                      {itemMrp > itemPrice && (
                        <span className="text-[11px] text-slate-400 line-through">₹{itemMrp}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
