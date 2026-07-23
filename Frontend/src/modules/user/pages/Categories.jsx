import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Star, Filter } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../../../assets/user/categories/Grocery-removebg-preview.png';
import readyCookImg from '../../../assets/user/categories/readyfoot-removebg-preview.png';
import homeCareImg from '../../../assets/user/categories/homecare-removebg-preview.png';
import personalCareImg from '../../../assets/user/categories/personalcare-removebg-preview.png';

const Categories = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('Grains & Flours');
  
  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const isAdded = toggleWishlist(product);
    if (isAdded) {
      setToastMessage('Your item is added to wishlist!');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      setToastMessage('Item removed from wishlist');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const sidebarCategories = [
    { name: 'Grains & Flours', image: grainsImg },
    { name: 'Oil & Ghee', image: oilGheeImg },
    { name: 'Spices & Masala', image: masalaImg },
    { name: 'Sugar & Sweeteners', image: sugarImg },
    { name: 'Grocery Essentials', image: groceryImg },
    { name: 'Ready-to-Cook', image: readyCookImg },
    { name: 'Home Care', image: homeCareImg },
    { name: 'Personal Care', image: personalCareImg }
  ];

  const products = [
    { id: 1, name: 'Premium Basmati', brand: 'Mynzo World', price: 2499, originalPrice: 3998, discount: 38, image: grainsImg },
    { id: 2, name: 'Refined Oil', brand: 'Mynzo World', price: 699, originalPrice: 1118, discount: 38, image: oilGheeImg },
    { id: 3, name: 'Toor Dal 5kg', brand: 'Mynzo World', price: 1499, originalPrice: 2398, discount: 38, image: masalaImg },
    { id: 4, name: 'Organic Sugar', brand: 'Mynzo World', price: 1299, originalPrice: 2078, discount: 38, image: sugarImg },
  ];

  return (
    <div className="h-[100dvh] bg-[#fbf9f6] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative">
        <h2 className="text-[20px] font-semibold m-0 text-white">Categories</h2>
        <Search size={22} color="white" className="cursor-pointer" />
      </header>

      <div className="flex flex-1 overflow-hidden relative z-0">
        {/* Left Sidebar */}
        <div className="w-[90px] bg-[#f0f3f6] border-r border-slate-200 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden z-10">
          {sidebarCategories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <div 
                key={cat.name}
                className={`py-3 flex flex-col items-center cursor-pointer relative transition-all duration-200`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1a1b41] rounded-r-md"></div>
                )}
                
                <div className={`w-[60px] h-[60px] flex justify-center items-center rounded-[16px] bg-white mb-1.5 shadow-sm transition-all ${
                  isActive ? 'border-[2px] border-[#ff5500]' : 'border-[2px] border-transparent'
                }`}>
                  <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain" />
                </div>
                
                <span className={`text-[10px] text-center leading-[1.1] px-1 ${
                  isActive ? 'font-bold text-[#1a1b41]' : 'font-medium text-slate-500'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
          <div className="h-[100px]"></div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-[#fdfaf6]">
          {/* Top Info */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-[14px] font-extrabold text-[#1a1b41] uppercase m-0 mb-1">{activeCategory}</h3>
              <p className="text-[10px] font-semibold text-slate-400 m-0 uppercase">{products.length} ITEMS FOUND</p>
            </div>
            <div className="cursor-pointer text-[#6259a8]">
              <Filter size={20} strokeWidth={2} />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 pb-24">
            {products.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative border border-slate-50 cursor-pointer transition-transform hover:-translate-y-1"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                
                {/* Image Section */}
                <div className="bg-[#f0f3f6] h-[110px] relative w-full flex items-center justify-center p-3">
                  {/* Heart */}
                  <div 
                    className="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 hover:bg-slate-50"
                    onClick={(e) => handleWishlistClick(e, item)}
                  >
                    <Heart size={13} className={isInWishlist(item.id) ? "text-red-500" : "text-slate-600"} fill={isInWishlist(item.id) ? "currentColor" : "none"} />
                  </div>
                  
                  <img src={item.image} alt={item.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply" />
                  
                  {/* Rating Pill */}
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-700">0</span>
                    <Star size={9} className="text-teal-500" fill="currentColor" />
                    <span className="text-[10px] text-slate-300">|</span>
                    <span className="text-[10px] text-slate-500">0</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-2.5 pb-3 bg-white flex flex-col">
                  <h4 className="text-[12px] font-bold text-slate-800 m-0 mb-0.5 leading-tight">{item.name}</h4>
                  <p className="text-[10px] font-medium text-slate-400 m-0 mb-2">{item.brand}</p>
                  
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{item.price}</span>
                    <span className="text-[11px] text-slate-400 line-through">₹{item.originalPrice}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#ff5500]">-{item.discount}% OFF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full text-[13px] font-medium shadow-lg z-[100] animate-fade-in-up whitespace-nowrap">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Categories;
