import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocationContext } from '../../../context/LocationContext';
import { bannerService, categoryService, productService, sellerService } from '../../../services/authService';
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
  Minus,
  Check,
  Heart,
  MapPin,
  Mic,
  Gamepad2,
  Trash2,
  Store,
  Star,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../../../assets/user/categories/Grocery-removebg-preview.png';
import readyCookImg from '../../../assets/user/categories/readyfoot-removebg-preview.png';
import homeCareImg from '../../../assets/user/categories/homecare-removebg-preview.png';
import personalCareImg from '../../../assets/user/categories/personalcare-removebg-preview.png';
import { getImageUrl } from '../../../utils/imageUtils';

const allProducts = [
  { id: 'p1', name: 'Basmati Rice', price: 75, originalPrice: 95, discount: '21% OFF', image: grainsImg, unit: '1kg' },
  { id: 'p2', name: 'Sunflower Oil', price: 110, originalPrice: 140, discount: '21% OFF', image: oilGheeImg, unit: '1L' },
  { id: 'p3', name: 'Toor Dal', price: 120, originalPrice: 150, discount: '20% OFF', image: masalaImg, unit: '1kg' },
  { id: 'p4', name: 'Whole Wheat Atta', price: 250, originalPrice: 280, image: grainsImg, unit: '5kg' },
  { id: 'p5', name: 'Iodized Salt', price: 24, originalPrice: 28, image: masalaImg, unit: '1kg' },
  { id: 'p6', name: 'Refined Sugar', price: 45, originalPrice: 55, image: sugarImg, unit: '1kg' },
  { id: 'p7', name: 'Premium Tea', price: 145, originalPrice: 160, image: groceryImg, unit: '500g' },
];

const fallbackSellersList = [
  {
    _id: 'seller_fashion_hub',
    businessName: 'Fashion Hub',
    businessType: 'Retail & Grocery',
    tagline: 'Fresh staples & cooking oils',
    storeLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    deliveryTime: '15-25 min'
  },
  {
    _id: 'seller_clothing_hub',
    businessName: 'Clothing Hub',
    businessType: 'Fruits & Produce',
    tagline: 'Farm fresh fruits & vegetables',
    storeLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    deliveryTime: '20-30 min'
  },
  {
    _id: 'seller_granic_farms',
    businessName: 'GRANIC FARMS',
    businessType: 'Dry Fruits & Organics',
    tagline: 'Roasted nuts & superfoods',
    storeLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    deliveryTime: '15-20 min'
  },
  {
    _id: 'seller_apex_wholesale',
    businessName: 'Apex Wholesale Grocery',
    businessType: 'Superstore',
    tagline: 'Bulk groceries & household',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    deliveryTime: '25-35 min'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity, isInCart, cartCount, removeFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  const locationContext = useLocationContext();
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState(fallbackSellersList);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

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
        seller: p.seller || 'Fashion Hub',
        price: salePrice,
        originalPrice: mrp,
        discount: discountStr || '',
        image: p.image || p.mainImage || grainsImg,
        unit: p.unit || `${p.unitValue || 1} ${p.unitType || 'kg'}`
      };
    };

    const loadAllHomeData = async () => {
      try {
        const [bannersRes, categoriesRes, sellersRes, flashRes, bestRes] = await Promise.allSettled([
          bannerService.getBanners(),
          categoryService.getCategories(),
          sellerService.getPublicSellers(),
          productService.getProducts({ section: 'flash_sale' }),
          productService.getProducts({ section: 'bestseller' })
        ]);

        if (!isMounted) return;

        // Process Banners
        if (bannersRes.status === 'fulfilled' && bannersRes.value?.success && Array.isArray(bannersRes.value.banners)) {
          const active = bannersRes.value.banners.filter(b => b.status === 'Active');
          if (active.length > 0) setBanners(active);
        }

        // Process Categories
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.success && Array.isArray(categoriesRes.value.categories)) {
          const active = categoriesRes.value.categories.filter(c => c.status === 'Active');
          const roots = active.filter(c => !c.parent);
          if (roots.length > 0) setCategories(roots);
        }

        // Process Sellers
        if (sellersRes.status === 'fulfilled' && sellersRes.value?.success && Array.isArray(sellersRes.value.sellers) && sellersRes.value.sellers.length > 0) {
          setSellers(sellersRes.value.sellers);
        }

        // Process Flash Deals
        const localSaved = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
        let flashApi = [];
        if (flashRes.status === 'fulfilled' && flashRes.value?.products && Array.isArray(flashRes.value.products)) {
          flashApi = flashRes.value.products;
        }
        const localFlash = localSaved.filter(p => Array.isArray(p.homeSections) && p.homeSections.includes('flash_sale'));
        const combinedFlash = [];
        flashApi.forEach(p => combinedFlash.push(formatItem(p)));
        localFlash.forEach(p => {
          const item = formatItem(p);
          if (!combinedFlash.some(c => c.id === item.id || c.name === item.name)) combinedFlash.push(item);
        });
        setFlashDeals(combinedFlash);

        // Process Bestsellers
        let bestApi = [];
        if (bestRes.status === 'fulfilled' && bestRes.value?.products && Array.isArray(bestRes.value.products)) {
          bestApi = bestRes.value.products;
        }
        const localBest = localSaved.filter(p => Array.isArray(p.homeSections) && p.homeSections.includes('bestseller'));
        const combinedBest = [];
        bestApi.forEach(p => combinedBest.push(formatItem(p)));
        localBest.forEach(p => {
          const item = formatItem(p);
          if (!combinedBest.some(c => c.id === item.id || c.name === item.name)) combinedBest.push(item);
        });
        setBestsellerProducts(combinedBest);

      } catch (err) {
        console.error('[Home] Failed to load home screen data:', err);
      }
    };

    loadAllHomeData();

    return () => {
      isMounted = false;
    };
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

  const allLoadedProducts = [...flashDeals, ...bestsellerProducts];
  const searchResults = searchQuery 
    ? allLoadedProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAddToCart = async (product) => {
    const res = await addToCart(product, 1, { navigate, returnUrl: window.location.pathname });
    if (res && res.success) {
      setToastMessage(`${product.name} added to cart!`);
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    }
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
                   {locationContext?.currentLocation?.addressLine1 || locationContext?.currentLocation?.area || locationContext?.currentLocation?.city || "Select Location"}
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
          <div 
            onClick={() => navigate('/location')}
            className="flex items-center justify-between bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-3 py-2 text-white cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPin size={16} className="shrink-0 text-white" />
              <div className="text-[12px] flex items-center gap-1.5 truncate">
                <span className="font-extrabold uppercase tracking-wider shrink-0">
                  {(locationContext?.currentLocation?.addressType || locationContext?.currentLocation?.type || 'HOME').toUpperCase()}
                </span> 
                <span className="text-white/60 font-light mx-0.5 shrink-0">|</span>
                <span className="font-medium text-[12px] truncate">
                  {locationContext?.currentLocation?.addressLine1 || locationContext?.currentLocation?.address || locationContext?.currentLocation?.area || locationContext?.currentLocation?.city || 'Select Location'}
                </span>
              </div>
            </div>
            <ChevronDown size={16} className="text-white/90 shrink-0 ml-1" />
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
                    <img onClick={() => navigate(`/product/${product.id}`)} src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-[110px] object-cover bg-slate-50 cursor-pointer" />
                    <div className="flex flex-col p-3 pt-2">
                      <h4 className="text-[13px] font-bold m-0 mb-1 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</h4>
                      <p className="text-[11px] text-slate-400 m-0 mb-0.5">{product.unit}</p>
                      <p className="text-[10px] font-medium text-slate-500 m-0 mb-2 truncate">by:- <span className="font-bold text-slate-700">{product.seller || 'Fashion Hub'}</span></p>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-extrabold text-slate-900">₹{product.price.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                          {product.discount && <span className="text-[10px] font-extrabold text-[#ff5500]">{product.discount}</span>}
                        </div>
                        {!isInCart(product.id || product._id) ? (
                          <button 
                            onClick={() => handleAddToCart(product)} 
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-95 transition-all shrink-0"
                            aria-label="Add to cart"
                          >
                            <Plus size={13} strokeWidth={3} /> ADD
                          </button>
                        ) : (
                          <button 
                            onClick={() => removeFromCart(product.id || product._id)} 
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-95 transition-all shrink-0"
                            aria-label="Remove from cart"
                          >
                            <Trash2 size={12} strokeWidth={2.5} /> REMOVE
                          </button>
                        )}
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
              className="rounded-2xl relative overflow-hidden shadow-md cursor-pointer w-full h-[140px] bg-slate-100"
              style={{ transition: 'opacity 0.3s ease, transform 0.3s ease', opacity: bannerVisible ? 1 : 0, transform: bannerVisible ? 'translateY(0)' : 'translateY(6px)' }}
              onClick={() => navigate(banners[currentBannerIndex]?.redirectUrl || '/categories')}
            >
              <img
                src={getImageUrl(banners[currentBannerIndex]?.imageUrl, "/promo_banner_bg.png")}
                alt={banners[currentBannerIndex]?.title || "Promotional Banner"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/promo_banner_bg.png";
                }}
              />
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
          <div 
            className="rounded-2xl relative overflow-hidden mb-5 shadow-md cursor-pointer w-full h-[140px] bg-slate-100"
            onClick={() => navigate('/categories')}
          >
            <img 
              src="/promo_banner_bg.png" 
              alt="Promo Boxes" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/promo_banner_bg.png";
              }}
            />
          </div>
        )}

        {/* Dynamic Categories Grid */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-bold m-0 text-[#ff5500]">Categories</h3>
          <button onClick={() => navigate('/categories')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>
        <div className="grid grid-cols-4 gap-y-4 gap-x-3 mb-8">
          {categories.length > 0 ? (
            categories.slice(0, 8).map((cat) => (
              <div 
                key={cat._id || cat.name} 
                onClick={() => navigate('/categories')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] overflow-hidden p-1.5">
                  <img 
                    src={getImageUrl(cat.image, grainsImg)} 
                    alt={cat.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 object-contain" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = grainsImg;
                    }}
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
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={grainsImg} alt="Grains & Flours" loading="lazy" decoding="async" className="w-10 h-10 object-contain" /></div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Grains &<br/>Flours</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={oilGheeImg} alt="Oil & Ghee" loading="lazy" decoding="async" className="w-10 h-10 object-contain" /></div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Oil & Ghee</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={masalaImg} alt="Spices & Masala" loading="lazy" decoding="async" className="w-10 h-10 object-contain" /></div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Spices &<br/>Masala</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="bg-white border border-slate-100 rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"><img src={sugarImg} alt="Sugar & Sweeteners" loading="lazy" decoding="async" className="w-10 h-10 object-contain" /></div>
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
            <div key={prod.id} className="min-w-[155px] max-w-[155px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="h-[125px] w-full overflow-hidden bg-slate-50 relative cursor-pointer" onClick={() => navigate(`/product/${prod.id}`)}>
                <img 
                  src={getImageUrl(prod.image, grainsImg)} 
                  alt={prod.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = grainsImg;
                  }}
                />
              </div>
              <div className="flex flex-col p-2.5 flex-1 justify-between gap-2">
                <div>
                  <h4 className="text-[13px] font-bold m-0 mb-0.5 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 m-0">{prod.unit}</p>
                  <p className="text-[10px] font-medium text-slate-500 m-0 mt-0.5 truncate">by:- <span className="font-bold text-slate-700">{prod.seller || 'Fashion Hub'}</span></p>
                </div>
                
                <div className="flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{prod.price.toFixed(2)}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {prod.discount && (
                    <span className="text-[9.5px] font-extrabold text-[#ff5500] whitespace-nowrap shrink-0">{prod.discount}</span>
                  )}
                </div>

                <div>
                  {!isInCart(prod.id || prod._id) ? (
                    <button 
                      onClick={() => handleAddToCart(prod)} 
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                      aria-label="Add to cart"
                    >
                      <Plus size={14} strokeWidth={3} /> ADD
                    </button>
                  ) : (
                    <button 
                      onClick={() => removeFromCart(prod.id || prod._id)}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={13} strokeWidth={2.5} /> REMOVE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Best Sellers (List of All Sellers / Top Stores) */}
        <div className="flex justify-between items-center mb-3 mt-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold m-0 text-[#ff5500]">Best Sellers</h3>
            <span className="bg-amber-100 text-amber-900 text-[10.5px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles size={11} className="text-amber-600 fill-amber-500" /> Top Stores
            </span>
          </div>
          <button onClick={() => navigate('/sellers')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer hover:underline">See All</button>
        </div>

        <div className="flex overflow-x-auto gap-3.5 pb-4 -mr-5 pr-5 hide-scrollbar [&::-webkit-scrollbar]:hidden">
          {sellers.map((seller) => (
            <div 
              key={seller._id || seller.businessName}
              onClick={() => navigate(`/store/${encodeURIComponent(seller._id || seller.businessName)}`)}
              className="min-w-[190px] max-w-[190px] bg-white border border-slate-100/90 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all shrink-0 hover:-translate-y-0.5"
            >
              {/* Store Mini Banner & Logo */}
              <div className="h-20 w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={seller.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80'} 
                  alt={seller.businessName} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white/20">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  {seller.rating || 4.9}
                </div>

                {/* Store Avatar */}
                <div className="absolute -bottom-2 left-2.5 w-10 h-10 rounded-xl bg-white p-0.5 shadow-md border border-white overflow-hidden">
                  <img 
                    src={seller.storeLogo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80'} 
                    alt={seller.businessName} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Store Details */}
              <div className="p-3 pt-3.5 flex flex-col justify-between flex-1 gap-2">
                <div>
                  <h4 className="text-[13px] font-bold m-0 text-slate-800 truncate flex items-center gap-1">
                    {seller.businessName}
                    <CheckCircle size={13} className="text-emerald-500 fill-emerald-100 shrink-0" />
                  </h4>
                  <p className="text-[10.5px] text-slate-500 m-0 mt-0.5 truncate">{seller.tagline || seller.businessType || 'Verified Merchant'}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ⚡ {seller.deliveryTime || '15-25 min'}
                  </span>
                  <span className="font-bold text-[#ea580c] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Visit <ChevronRight size={12} />
                  </span>
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
          <button onClick={() => navigate('/bestseller')} className="bg-transparent border-none text-blue-600 text-[12px] font-semibold cursor-pointer">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          {bestsellerProducts.map((prod) => (
            <div key={prod.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="h-[125px] w-full overflow-hidden bg-slate-50 relative cursor-pointer" onClick={() => navigate(`/product/${prod.id}`)}>
                <img 
                  src={getImageUrl(prod.image, grainsImg)} 
                  alt={prod.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = grainsImg;
                  }}
                />
              </div>
              <div className="flex flex-col p-2.5 flex-1 justify-between gap-2">
                <div>
                  <h4 className="text-[13px] font-bold m-0 mb-0.5 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 m-0">{prod.unit}</p>
                  <p className="text-[10px] font-medium text-slate-500 m-0 mt-0.5 truncate">by:- <span className="font-bold text-slate-700">{prod.seller || 'Fashion Hub'}</span></p>
                </div>
                
                <div className="flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{prod.price.toFixed(2)}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {prod.discount && (
                    <span className="text-[9.5px] font-extrabold text-[#ff5500] whitespace-nowrap shrink-0">{prod.discount}</span>
                  )}
                </div>

                <div>
                  {!isInCart(prod.id || prod._id) ? (
                    <button 
                      onClick={() => handleAddToCart(prod)} 
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                      aria-label="Add to cart"
                    >
                      <Plus size={14} strokeWidth={3} /> ADD
                    </button>
                  ) : (
                    <button 
                      onClick={() => removeFromCart(prod.id || prod._id)}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={13} strokeWidth={2.5} /> REMOVE
                    </button>
                  )}
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
