import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocationContext } from '../../../context/LocationContext';
import { bannerService, categoryService, productService } from '../../../services/authService';
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
  const locationContext = useLocationContext();
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [flashDeals, setFlashDeals] = useState(allProducts.slice(0, 3));
  const [bestsellerProducts, setBestsellerProducts] = useState(allProducts.slice(3));

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getBanners();
        if (res.success && res.banners.length > 0) {
          const active = res.banners.filter(b => b.status === 'Active');
          setBanners(active);
        }
      } catch (err) {
        console.error('Failed to load banners:', err);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success && res.categories.length > 0) {
          const active = res.categories.filter(c => c.status === 'Active');
          setCategories(active);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    const fetchHomeProducts = async () => {
      const localSaved = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');

      const formatItem = (p) => {
        const salePrice = Number(p.salePrice || p.price || 0);
        const mrp = Number(p.mrp || p.originalPrice || salePrice);
        let discountStr = p.discount;
        if (!discountStr && mrp > salePrice) {
          const pct = Math.round(((mrp - salePrice) / mrp) * 100);
          discountStr = `${pct}% OFF`;
        }
        return {
          id: p.id || p.sku || p._id || `p_${Math.random()}`,
          name: p.name,
          price: salePrice,
          originalPrice: mrp,
          discount: discountStr || '',
          image: p.image || p.mainImage || grainsImg,
          unit: p.unit || `${p.unitValue || 1} ${p.unitType || 'kg'}`
        };
      };

      // Flash sale products
      let flashApi = [];
      try {
        const res = await productService.getProducts({ section: 'flash_sale' });
        if (res && res.products && Array.isArray(res.products)) flashApi = res.products;
      } catch (err) {}

      const localFlash = localSaved.filter(p => !p.homeSections || p.homeSections.includes('flash_sale'));
      const combinedFlash = [];
      localFlash.forEach(p => combinedFlash.push(formatItem(p)));
      flashApi.forEach(p => {
        const item = formatItem(p);
        if (!combinedFlash.some(c => c.id === item.id || c.name === item.name)) combinedFlash.push(item);
      });
      allProducts.slice(0, 3).forEach(p => {
        if (!combinedFlash.some(c => c.id === p.id || c.name === p.name)) combinedFlash.push(p);
      });
      setFlashDeals(combinedFlash);

      // Bestseller products
      let bestApi = [];
      try {
        const res = await productService.getProducts({ section: 'bestseller' });
        if (res && res.products && Array.isArray(res.products)) bestApi = res.products;
      } catch (err) {}

      const localBest = localSaved.filter(p => !p.homeSections || p.homeSections.includes('bestseller'));
      const combinedBest = [];
      localBest.forEach(p => combinedBest.push(formatItem(p)));
      bestApi.forEach(p => {
        const item = formatItem(p);
        if (!combinedBest.some(c => c.id === item.id || c.name === item.name)) combinedBest.push(item);
      });
      allProducts.slice(3).forEach(p => {
        if (!combinedBest.some(c => c.id === p.id || c.name === p.name)) combinedBest.push(p);
      });
      setBestsellerProducts(combinedBest);
    };

    fetchBanners();
    fetchCategories();
    fetchHomeProducts();
  }, []);

  // Auto-scroll banners every 3.5 seconds with fade transition
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setBannerVisible(false);
      setTimeout(() => {
        setCurrentBannerIndex(prev => (prev + 1) % banners.length);
        setBannerVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [banners]);

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
    <div className="h-[100dvh] bg-white font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-y-auto overflow-x-hidden hide-scrollbar [&::-webkit-scrollbar]:hidden">
      {/* Top Header Section with Dark Orange Background */}
      <div className="bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] pb-3 mb-4 shadow-sm relative z-10 pt-1">
        {/* Header Section */}
        <header className="flex justify-between items-center px-4 pt-1.5 pb-2.5">
          <div className="flex items-center flex-1">
            <div className="bg-white rounded-xl p-1 shadow-sm flex items-center justify-center w-11 h-11 shrink-0">
              <img src="/Logo.png" alt="ShippNex Logo" className="w-full h-full object-contain" />
            </div>
            
            <div className="flex flex-col ml-3 text-white cursor-pointer overflow-hidden" onClick={() => navigate('/location')}>
               <div className="text-[10px] font-semibold opacity-90 flex items-center">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   Deliver to
               </div>
               <div className="text-[13px] font-bold leading-tight truncate max-w-[140px]">
                   {locationContext?.currentLocation?.area || locationContext?.currentLocation?.city || "Select Location"}
               </div>
            </div>
          </div>
          <div className="flex gap-4 items-center pr-1 shrink-0">
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
        {/* Dynamic Promo Banner */}
        {banners.length > 0 ? (
          <div className="mb-5">
            <div
              className="bg-gradient-to-br from-[#1e2b4f] to-[#151d38] rounded-2xl py-4 px-5 flex justify-between items-center relative overflow-hidden text-white shadow-md"
              style={{ transition: 'opacity 0.3s ease, transform 0.3s ease', opacity: bannerVisible ? 1 : 0, transform: bannerVisible ? 'translateY(0)' : 'translateY(6px)' }}
            >
              <div className="relative z-10 max-w-[55%]">
                <h3 className="text-[15px] font-extrabold m-0 uppercase tracking-wide">{banners[currentBannerIndex].title}</h3>
                <p className="text-[12px] font-medium mt-0.5 mb-2">{banners[currentBannerIndex].subtitle}</p>
                {banners[currentBannerIndex].discountBadge && (
                  <div className="bg-[#ff5500] text-white text-[11px] font-bold px-2 py-0.5 rounded-md inline-block mb-2.5">
                    {banners[currentBannerIndex].discountBadge}
                  </div>
                )}
                <button
                  onClick={() => navigate(banners[currentBannerIndex].redirectUrl || '/categories')}
                  className="bg-white text-[#1e2b4f] border-none rounded-md px-3.5 py-1.5 text-[11px] font-bold cursor-pointer block hover:bg-slate-100 transition-colors"
                >
                  {banners[currentBannerIndex].ctaText || 'Shop Now'}
                </button>
              </div>
              <div className="absolute -right-5 -bottom-2 w-[160px] h-full z-0">
                <img
                  src={banners[currentBannerIndex].imageUrl || "/promo_banner_bg.png"}
                  alt={banners[currentBannerIndex].title}
                  className="w-full h-[150%] object-cover absolute bottom-0 right-0"
                />
                <div className="absolute top-[20%] right-[35px] bg-white rounded-lg p-1 w-9 flex items-center justify-center shadow-sm">
                  <img src="/splashscreenlogo.png" alt="ShippNex" className="w-full h-auto" />
                </div>
              </div>
            </div>
            {/* Dot Indicators */}
            {banners.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setBannerVisible(false); setTimeout(() => { setCurrentBannerIndex(i); setBannerVisible(true); }, 300); }}
                    className="border-none cursor-pointer p-0 rounded-full transition-all duration-300"
                    style={{ width: i === currentBannerIndex ? '20px' : '6px', height: '6px', background: i === currentBannerIndex ? '#ff5500' : '#cbd5e1' }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1e2b4f] to-[#151d38] rounded-2xl py-4 px-5 flex justify-between items-center relative overflow-hidden mb-5 text-white">
            <div className="relative z-10 max-w-[55%]">
              <h3 className="text-[15px] font-extrabold m-0 uppercase tracking-wide">BIG SAVINGS</h3>
              <p className="text-[12px] font-medium mt-0.5 mb-2">on Bulk Orders</p>
              <div className="bg-[#ff5500] text-white text-[11px] font-bold px-2 py-0.5 rounded-md inline-block mb-2.5">Up to 25% OFF</div>
              <button onClick={() => navigate('/categories')} className="bg-white text-[#1e2b4f] border-none rounded-md px-3.5 py-1.5 text-[11px] font-bold cursor-pointer block">Shop Now</button>
            </div>
            <div className="absolute -right-5 -bottom-2 w-[160px] h-full z-0">
              <img src="/promo_banner_bg.png" alt="Promo Boxes" className="w-full h-[150%] object-cover absolute bottom-0 right-0" />
              <div className="absolute top-[20%] right-[35px] bg-white rounded-lg p-1 w-9 flex items-center justify-center shadow-sm">
                <img src="/splashscreenlogo.png" alt="ShippNex" className="w-full h-auto" />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Categories Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-3 mb-8">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div 
                key={cat._id || cat.name} 
                onClick={() => navigate('/categories')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] overflow-hidden p-1.5">
                  <img 
                    src={cat.image || grainsImg} 
                    alt={cat.name} 
                    className="w-10 h-10 object-contain" 
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))
          ) : (
            <>
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
            </>
          )}
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
          <button onClick={() => navigate('/flash-sale')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mr-5 pr-5 [&::-webkit-scrollbar]:hidden">
          {flashDeals.map((prod) => (
            <div key={prod.id} className="min-w-[140px] max-w-[140px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <img onClick={() => navigate(`/product/${prod.id}`)} src={prod.image} alt={prod.name} className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
              <div className="flex flex-col p-3 pt-2 flex-1 justify-between">
                <div>
                  <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 m-0 mb-2">{prod.unit}</p>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{prod.price.toFixed(2)}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice.toFixed(2)}</span>
                    )}
                    {prod.discount && (
                      <span className="text-[10px] font-extrabold text-[#ff5500]">{prod.discount}</span>
                    )}
                  </div>
                  <button onClick={() => handleAddToCart(prod)} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-transform active:scale-95"><Plus size={16} color="white" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Best Selling Products */}
        <div className="flex justify-between items-center mb-4 mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold m-0 text-[#ff5500]">Best Selling Products</h3>
          </div>
          <button onClick={() => navigate('/categories')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          {bestsellerProducts.map((prod) => (
            <div key={prod.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <img onClick={() => navigate(`/product/${prod.id}`)} src={prod.image} alt={prod.name} className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
              <div className="flex flex-col p-3 pt-2 flex-1 justify-between">
                <div>
                  <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 m-0 mb-2">{prod.unit}</p>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{prod.price.toFixed(2)}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button onClick={() => handleAddToCart(prod)} className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-transform active:scale-95"><Plus size={16} color="white" /></button>
                </div>
              </div>
            </div>
          ))}
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
