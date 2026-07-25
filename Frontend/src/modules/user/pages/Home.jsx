import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Bell, 
  ShoppingCart, 
  ChevronDown, 
  Search, 
  ScanLine, 
  Wheat, 
  Droplet,
  Flame,
  Coffee,
  ShoppingBag,
  Utensils,
  Sparkles, 
  Home as HomeIcon, 
  Zap, 
  Plus,
  Heart,
  MapPin,
  Mic,
  Gamepad2
} from 'lucide-react';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../../../assets/user/categories/Grocery-removebg-preview.png';
import readyCookImg from '../../../assets/user/categories/readyfoot-removebg-preview.png';
import homeCareImg from '../../../assets/user/categories/homecare-removebg-preview.png';
import personalCareImg from '../../../assets/user/categories/personalcare-removebg-preview.png';

const allProducts = [
  { id: 'p1', name: 'Basmati Rice', price: 75, originalPrice: 95, discount: '21% OFF', image: grainsImg, unit: '1kg' },
  { id: 'p2', name: 'Sunflower Oil', price: 110, originalPrice: 140, discount: '21% OFF', image: oilGheeImg, unit: '1L' },
  { id: 'p3', name: 'Toor Dal', price: 120, originalPrice: 150, discount: '20% OFF', image: masalaImg, unit: '1kg' },
  { id: 'p4', name: 'Whole Wheat Atta', price: 250, originalPrice: 280, image: grainsImg, unit: '5kg' },
  { id: 'p5', name: 'Iodized Salt', price: 24, originalPrice: 28, image: masalaImg, unit: '1kg' },
  { id: 'p6', name: 'Refined Sugar', price: 45, originalPrice: 55, image: sugarImg, unit: '1kg' },
  { id: 'p7', name: 'Premium Tea', price: 145, originalPrice: 160, image: groceryImg, unit: '500g' },
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setToastMessage('Listening...');
      recognition.onresult = (e) => {
        setSearchQuery(e.results[0][0].transcript);
      };
      recognition.start();
    } else {
      setToastMessage('Mic not supported in your browser.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const searchResults = searchQuery 
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className="h-[100dvh] bg-white font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-y-auto overflow-x-hidden">
      {/* Top Header Section with Dark Orange Background */}
      <div className="bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] pb-3 mb-4 shadow-sm relative z-10 pt-1">
        {/* Header Section */}
        <header className="flex justify-between items-center px-4 pt-1.5 pb-2.5">
          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center justify-center w-11 h-11">
            <img src="/Logo.png" alt="ShippNex Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-4 items-center pr-1">
            <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
              <Bell size={22} color="white" strokeWidth={1.8} />
              <span className="absolute top-[2px] right-[2px] bg-white w-2 h-2 rounded-full border border-[#ea580c]"></span>
            </div>
            <div className="cursor-pointer relative" onClick={() => navigate('/wishlist')}>
              <Heart size={22} color="white" strokeWidth={1.8} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-[#ea580c] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </div>
            <div className="cursor-pointer relative" onClick={() => navigate('/cart')}>
              <ShoppingCart size={22} color="white" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-[#ea580c] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Address Section */}
        <div className="px-4 pb-2.5">
          <div className="flex items-center justify-between bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-white cursor-pointer">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <div className="text-[12px] flex items-center gap-1.5">
                <span className="font-extrabold uppercase tracking-wider">HOME</span> 
                <span className="text-white/60 font-light mx-0.5">|</span>
                <span className="font-medium text-[12px]">Select Location</span>
              </div>
            </div>
            <ChevronDown size={16} className="text-white/90" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2.5 flex gap-2.5">
          <div className="flex-1 flex items-center bg-white rounded-[14px] px-3 py-2 shadow-sm">
            <Search size={18} className="text-slate-400 mr-2" strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none text-[14px] bg-transparent text-slate-700 placeholder:text-slate-400 font-medium"
            />
            <Mic size={18} className="text-slate-400 cursor-pointer ml-1" strokeWidth={2} onClick={handleMicClick} />
          </div>
        </div>
      </div>

      <div className="px-5">
        {searchQuery ? (
          <div className="pb-4">
            <h3 className="text-[16px] font-bold mb-4 text-[#ff5500]">Search Results for "{searchQuery}"</h3>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map(product => (
                  <div key={product.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
                    <img onClick={() => navigate(`/product/${product.id}`)} src={product.image} alt={product.name} className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
                    <div className="flex flex-col p-3 pt-2">
                      <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</h4>
                      <p className="text-[11px] text-slate-400 m-0 mb-2">{product.unit}</p>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-extrabold text-slate-900">₹{product.price.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                          {product.discount && <span className="text-[10px] font-extrabold text-[#ff5500]">{product.discount}</span>}
                        </div>
                        <button onClick={() => handleAddToCart(product)} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 font-medium">No products found matching "{searchQuery}".</div>
            )}
            <div className="h-[80px]"></div>
          </div>
        ) : (
          <>
        {/* Promo Banner */}
        <div className="bg-gradient-to-br from-[#1e2b4f] to-[#151d38] rounded-2xl py-4 px-5 flex justify-between items-center relative overflow-hidden mb-5 text-white">
          <div className="relative z-10 max-w-[55%]">
            <h3 className="text-[15px] font-extrabold m-0 uppercase tracking-wide">BIG SAVINGS</h3>
            <p className="text-[12px] font-medium mt-0.5 mb-2">on Bulk Orders</p>
            <div className="bg-[#ff5500] text-white text-[11px] font-bold px-2 py-0.5 rounded-md inline-block mb-2.5">Up to 25% OFF</div>
            <button className="bg-white text-[#1e2b4f] border-none rounded-md px-3.5 py-1.5 text-[11px] font-bold cursor-pointer block">Shop Now</button>
          </div>
          <div className="absolute -right-5 -bottom-2 w-[160px] h-full z-0">
            <img src="/promo_banner_bg.png" alt="Promo Boxes" className="w-full h-[150%] object-cover absolute bottom-0 right-0" />
            <div className="absolute top-[20%] right-[35px] bg-white rounded-lg p-1 w-9 flex items-center justify-center shadow-sm">
              <img src="/splashscreenlogo.png" alt="ShippNex" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-3 mb-8">
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={grainsImg} alt="Grains & Flours" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Grains &<br/>Flours</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={oilGheeImg} alt="Oil & Ghee" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Oil & Ghee</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={masalaImg} alt="Spices & Masala" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Spices &<br/>Masala</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={sugarImg} alt="Sugar & Sweeteners" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Sugar &<br/>Sweeteners</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={groceryImg} alt="Grocery Essentials" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Grocery<br/>Essentials</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={readyCookImg} alt="Ready-to-Cook" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Ready-to-<br/>Cook</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={homeCareImg} alt="Home Care" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Home<br/>Care</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={personalCareImg} alt="Personal Care" className="w-10 h-10 object-contain" /></div>
            <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Personal<br/>Care</span>
          </div>
        </div>

        {/* Flash Deals */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold m-0 text-[#ff5500]">Flash Deals</h3>
            <div className="flex items-center gap-1 font-bold text-blue-900">
              <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[12px]">02</span>:
              <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[12px]">45</span>:
              <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[12px]">30</span>
            </div>
          </div>
          <button onClick={() => navigate('/categories')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mr-5 pr-5 [&::-webkit-scrollbar]:hidden">
          {/* Product Card 1 */}
          <div className="min-w-[140px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p1')} src={grainsImg} alt="Basmati Rice" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Basmati Rice</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">1kg</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹75.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹95.00</span>
                  <span className="text-[10px] font-extrabold text-[#ff5500]">21% OFF</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p1', name: 'Basmati Rice', price: 75, originalPrice: 95, image: grainsImg, unit: '1kg' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="min-w-[140px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p2')} src={oilGheeImg} alt="Sunflower Oil" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Sunflower Oil</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">1L</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹110.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹140.00</span>
                  <span className="text-[10px] font-extrabold text-[#ff5500]">21% OFF</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p2', name: 'Sunflower Oil', price: 110, originalPrice: 140, image: oilGheeImg, unit: '1L' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>

          {/* Product Card 3 */}
          <div className="min-w-[140px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p3')} src={masalaImg} alt="Toor Dal" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Toor Dal</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">1kg</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹120.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹150.00</span>
                  <span className="text-[10px] font-extrabold text-[#ff5500]">20% OFF</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p3', name: 'Toor Dal', price: 120, originalPrice: 150, image: masalaImg, unit: '1kg' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Best Selling Products */}
        <div className="flex justify-between items-center mb-4 mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold m-0 text-[#ff5500]">Best Selling Products</h3>
          </div>
          <button onClick={() => navigate('/categories')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          {/* Product Card 1 */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p4')} src={grainsImg} alt="Whole Wheat Atta" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Whole Wheat Atta</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">5kg</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹250.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹280.00</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p4', name: 'Whole Wheat Atta', price: 250, originalPrice: 280, image: grainsImg, unit: '5kg' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p5')} src={masalaImg} alt="Iodized Salt" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Iodized Salt</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">1kg</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹24.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹28.00</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p5', name: 'Iodized Salt', price: 24, originalPrice: 28, image: masalaImg, unit: '1kg' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>
          
          {/* Product Card 3 */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p6')} src={sugarImg} alt="Refined Sugar" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Refined Sugar</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">1kg</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹45.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹55.00</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p6', name: 'Refined Sugar', price: 45, originalPrice: 55, image: sugarImg, unit: '1kg' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>

          {/* Product Card 4 */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <img onClick={() => navigate('/product/p7')} src={groceryImg} alt="Premium Tea" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
            <div className="flex flex-col p-3 pt-2">
              <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">Premium Tea</h4>
              <p className="text-[11px] text-slate-400 m-0 mb-2">500g</p>
              <div className="flex justify-between items-end mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-extrabold text-slate-900">₹145.00</span>
                  <span className="text-[10px] text-slate-400 line-through">₹160.00</span>
                </div>
                <button onClick={() => handleAddToCart({ id: 'p7', name: 'Premium Tea', price: 145, originalPrice: 160, image: groceryImg, unit: '500g' })} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"><Plus size={16} color="white" /></button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[80px]"></div> {/* Spacing for bottom nav */}
          </>
        )}
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-xl z-50 whitespace-nowrap flex items-center gap-2 transition-all duration-300">
            <ShoppingCart size={14} />
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
