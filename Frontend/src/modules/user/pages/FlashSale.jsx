import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../../../services/authService';

import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../../../assets/user/categories/Grocery-removebg-preview.png';

const defaultFlashSaleProducts = [
  { id: 'p1', name: 'Basmati Rice', price: 75, originalPrice: 95, discount: '21% OFF', image: grainsImg, unit: '1kg' },
  { id: 'p2', name: 'Sunflower Oil', price: 110, originalPrice: 140, discount: '21% OFF', image: oilGheeImg, unit: '1L' },
  { id: 'p3', name: 'Toor Dal', price: 120, originalPrice: 150, discount: '20% OFF', image: masalaImg, unit: '1kg' },
  { id: 'p5', name: 'Iodized Salt', price: 24, originalPrice: 28, discount: '14% OFF', image: masalaImg, unit: '1kg' },
  { id: 'p6', name: 'Refined Sugar', price: 45, originalPrice: 55, discount: '18% OFF', image: sugarImg, unit: '1kg' },
  { id: 'p7', name: 'Premium Tea', price: 145, originalPrice: 160, discount: '9% OFF', image: groceryImg, unit: '500g' },
];

const FlashSale = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState('');
  const [productsList, setProductsList] = useState(defaultFlashSaleProducts);

  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFlashProducts = async () => {
      let apiItems = [];
      try {
        const res = await productService.getProducts({ section: 'flash_sale' });
        if (res && res.products && Array.isArray(res.products)) {
          apiItems = res.products;
        }
      } catch (err) {
        console.warn('Backend flash sale fetch fallback:', err.message);
      }

      const localSaved = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
      const localFlashItems = localSaved.filter(p => {
        if (!p.homeSections || p.homeSections.length === 0) return true;
        return p.homeSections.includes('flash_sale');
      });

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

      const combined = [];
      // Put custom local items first
      localFlashItems.forEach(p => combined.push(formatItem(p)));

      // Add API items
      apiItems.forEach(p => {
        const formatted = formatItem(p);
        if (!combined.some(c => c.id === formatted.id || c.name === formatted.name)) {
          combined.push(formatted);
        }
      });

      // Add default mock items
      defaultFlashSaleProducts.forEach(p => {
        if (!combined.some(c => c.id === p.id || c.name === p.name)) {
          combined.push(p);
        }
      });

      setProductsList(combined);
    };

    fetchFlashProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const isWishlisted = (id) => wishlistItems?.some(item => item.id === id);

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between py-4 px-5 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-b-[20px] shadow-sm z-10 relative mb-2">
        <div className="flex items-center gap-3">
          <ArrowLeft size={22} color="white" className="cursor-pointer" onClick={() => navigate(-1)} />
          <div>
            <h2 className="text-[18px] font-bold m-0 text-white flex items-center gap-1.5">
              Flash Sale <Zap size={18} className="fill-yellow-300 text-yellow-300 animate-pulse" />
            </h2>
          </div>
        </div>

        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <ShoppingCart size={22} color="white" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-slate-900 text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* Timer Sub-header Banner */}
      <div className="px-4 py-2">
        <div className="bg-orange-500/10 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-[13px] font-bold text-orange-700 flex items-center gap-1">
            Ends In:
          </span>
          <div className="flex items-center gap-1 font-bold text-orange-900">
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-[13px] font-mono">{formatNumber(timeLeft.hours)}</span>:
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-[13px] font-mono">{formatNumber(timeLeft.minutes)}</span>:
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-[13px] font-mono">{formatNumber(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-2 [&::-webkit-scrollbar]:hidden pb-8">
        <div className="grid grid-cols-2 gap-3">
          {productsList.map((product) => {
            const wishlisted = isWishlisted(product.id);
            return (
              <div 
                key={product.id} 
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col relative transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-[#ff5500] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded z-10">
                    {product.discount}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => toggleWishlist(e, product)}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm z-10 border-none cursor-pointer"
                >
                  <Heart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                </button>

                {/* Image */}
                <img 
                  onClick={() => navigate(`/product/${product.id}`)} 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[120px] object-cover bg-slate-50 cursor-pointer" 
                />

                {/* Details */}
                <div className="flex flex-col p-3 pt-2 flex-1 justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold m-0 mb-0.5 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 m-0 mb-2">{product.unit}</p>
                  </div>

                  <div className="flex justify-between items-end mt-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-extrabold text-slate-900">₹{Number(product.price).toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through">₹{Number(product.originalPrice).toFixed(2)}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="bg-slate-900 border-none rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                    >
                      <Plus size={16} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
