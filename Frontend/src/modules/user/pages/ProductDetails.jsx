import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Star, ShoppingCart, ChevronRight, ChevronDown, 
  ShieldCheck, Tag, Share2, Plus, Minus, Clock, Check
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { productService } from '../../../services/authService';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';

const getImageUrl = (url, fallback = grainsImg) => {
  if (!url) return fallback;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`;
    return `${baseUrl}${url}`;
  }
  return url;
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        if (res && res.success && res.product) {
          setProduct(res.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const similarProducts = [
    { id: 2, name: 'Refined Sunflower Oil', brand: 'ShippNex Select', price: 699, originalPrice: 1118, discount: 38, image: oilGheeImg, rating: 4.6 },
    { id: 3, name: 'Premium Toor Dal 5kg', brand: 'ShippNex Select', price: 1499, originalPrice: 2398, discount: 38, image: masalaImg, rating: 4.8 },
    { id: 4, name: 'Organic Fine Sugar', brand: 'ShippNex Select', price: 1299, originalPrice: 2078, discount: 38, image: sugarImg, rating: 4.7 },
  ];

  const handleWishlistClick = () => {
    const isAdded = toggleWishlist(product);
    setToastMessage(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'ShippNex Product',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setToastMessage(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  const isFav = product && isInWishlist(product.id || product._id);

  if (loading) {
    return (
      <div className="h-[100dvh] bg-white flex flex-col items-center justify-center max-w-[480px] mx-auto">
        <div className="w-9 h-9 border-3 border-orange-200 border-t-[#ff5500] rounded-full animate-spin mb-3"></div>
        <p className="text-slate-500 font-medium text-xs">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-[100dvh] bg-white flex flex-col items-center justify-center max-w-[480px] mx-auto px-6 text-center">
        <p className="text-slate-600 font-medium text-sm mb-4">{error || 'Product not found'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-5 py-2 bg-[#ff5500] text-white font-bold rounded-xl border-none cursor-pointer text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.price || 0;
  const originalPrice = product.mrp || product.originalPrice || 0;
  const hasDiscount = originalPrice > currentPrice;
  const discountCalc = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const savingsAmount = hasDiscount ? (originalPrice - currentPrice) : 0;

  return (
    <div className="min-h-[100dvh] bg-white font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_25px_rgba(0,0,0,0.05)] flex flex-col pb-24">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button 
          className="w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        
        <span className="font-semibold text-slate-800 text-sm truncate max-w-[220px]">
          {product.name}
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            className="w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors"
            onClick={handleShare}
          >
            <Share2 size={16} />
          </button>
          <button 
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors ${
              isFav ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            onClick={handleWishlistClick}
          >
            <Heart size={17} className={isFav ? "text-emerald-600 fill-emerald-600" : "text-slate-600"} />
          </button>
        </div>
      </header>

      {/* 2. Full-Cover Hero Product Image Canvas */}
      <div className="w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
        
        {/* Floating Express Delivery Badge */}
        <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md border border-emerald-200/80 text-emerald-700 font-medium text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Clock size={12} className="text-emerald-600" /> 10-MIN EXPRESS DELIVERY
        </div>

        {/* Full Edge-to-Edge Image Container */}
        <div className="w-full h-[300px] sm:h-[340px] relative overflow-hidden bg-slate-100">
          <img 
            src={getImageUrl(activeImage || product.image || product.mainImage)} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = grainsImg;
            }}
          />
        </div>

        {/* Thumbnail Selector Row */}
        <div className="flex justify-center items-center gap-2 py-2.5 px-4 bg-white border-t border-slate-100">
          {[
            product.image || product.mainImage, 
            ...(product.galleryImages || [])
          ].filter(Boolean).slice(0, 4).map((imgUrl, idx) => {
            const isSelected = (activeImage || product.image || product.mainImage) === imgUrl;
            return (
              <button 
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`w-12 h-12 rounded-lg bg-slate-50 border cursor-pointer p-0.5 overflow-hidden flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-[#ff5500] ring-2 ring-[#ff5500]/20 shadow-xs scale-105' 
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(imgUrl)} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Product Info Content */}
      <div className="px-4 py-4 flex flex-col gap-3">

        {/* Title & Rating Header */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[18px] font-semibold text-slate-800 m-0 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
            <span className="text-[11px] font-bold text-amber-800">4.5</span>
            <Star size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] text-amber-600 font-medium">(128)</span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex flex-col gap-1 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-slate-800 leading-none">
              ₹{currentPrice}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[13px] font-normal text-slate-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="bg-[#ff5500] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider">
                  {discountCalc}% OFF
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <span className="text-[11px] font-medium text-emerald-600">
              Save ₹{savingsAmount} on this pack
            </span>
          )}
          <span className="text-[10px] text-slate-400">Inclusive of all taxes</span>
        </div>

        {/* Seamless Divider */}
        <hr className="border-slate-100 my-1 -mx-4" />

        {/* Product Overview & Description */}
        <div>
          <h3 className="text-[13px] font-semibold text-slate-800 mb-1.5">Product Description</h3>
          {product.description ? (
            <p className="text-[12px] text-slate-600 leading-relaxed m-0 font-normal">
              {product.description}
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-slate-600 font-normal">
              <p className="m-0">🌾 Freshly milled and processed under hygienic standards.</p>
              <p className="m-0">🧼 100% natural, free from harmful additives and preservatives.</p>
              <p className="m-0">📦 Sealed in high-grade moisture-proof packaging for maximum freshness.</p>
            </div>
          )}
        </div>

        {/* Expandable Accordions */}
        <div className="flex flex-col border-t border-slate-100 mt-1">
          
          <div className="border-b border-slate-100 py-2.5">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion('product')}
            >
              <span className="text-[13px] font-medium text-slate-700">Product Specifications</span>
              {activeAccordion === 'product' ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
            </div>
            {activeAccordion === 'product' && (
              <div className="pt-2 text-[12px] text-slate-600 grid grid-cols-2 gap-2 font-normal">
                <div><span className="text-slate-400">Brand:</span> <strong>{product.brand || product.seller || 'ShippNex'}</strong></div>
                <div><span className="text-slate-400">Category:</span> <strong>{product.category || 'Grocery'}</strong></div>
                <div><span className="text-slate-400">Sub-Category:</span> <strong>{product.subCategory || 'Staples'}</strong></div>
                <div><span className="text-slate-400">Stock:</span> <strong className="text-emerald-600">Available ({product.stock || 50})</strong></div>
              </div>
            )}
          </div>

          <div className="border-b border-slate-100 py-2.5">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion('delivery')}
            >
              <span className="text-[13px] font-medium text-slate-700">Delivery Information</span>
              {activeAccordion === 'delivery' ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
            </div>
            {activeAccordion === 'delivery' && (
              <div className="pt-2 text-[12px] text-slate-600 space-y-1 font-normal">
                <p className="m-0">⚡ Express delivery within 10-15 minutes.</p>
                <p className="m-0">🚚 Standard free delivery for orders above ₹499.</p>
              </div>
            )}
          </div>

          <div className="border-b border-slate-100 py-2.5">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion('policy')}
            >
              <span className="text-[13px] font-medium text-slate-700">Return & Refund Policy</span>
              {activeAccordion === 'policy' ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
            </div>
            {activeAccordion === 'policy' && (
              <div className="pt-2 text-[12px] text-slate-600 space-y-1 font-normal">
                <p className="m-0">🛡️ 7-day replacement warranty for damaged or incorrect items.</p>
              </div>
            )}
          </div>

        </div>

        {/* Similar Items Carousel */}
        <div className="pt-1">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-[13px] font-semibold text-slate-800 m-0">Similar Products</h3>
            <button 
              onClick={() => navigate('/categories')} 
              className="text-[#ff5500] text-[12px] font-medium bg-transparent border-none cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
            {similarProducts.map((item) => {
              const qty = getItemQuantity(item.id || item._id);
              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="min-w-[135px] w-[135px] bg-white rounded-xl border border-slate-100 p-2.5 flex flex-col justify-between cursor-pointer shrink-0"
                >
                  <div className="bg-slate-50 rounded-lg h-[90px] w-full flex items-center justify-center p-2 mb-2">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-medium text-slate-800 m-0 truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 m-0 mb-1 truncate">{item.brand}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12px] font-bold text-slate-800">₹{item.price}</span>
                      {qty === 0 ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                            setToastMessage('Item added to cart! 🛒');
                            setTimeout(() => setToastMessage(''), 2000);
                          }}
                          className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center border-none cursor-pointer shadow-2xs active:scale-90 transition-transform shrink-0"
                          aria-label="Add to cart"
                        >
                          <Plus size={13} strokeWidth={3} />
                        </button>
                      ) : (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="bg-emerald-600 text-white rounded-md p-0.5 flex items-center justify-between shadow-2xs border-none shrink-0"
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id || item._id, -1);
                            }}
                            className="w-5 h-5 rounded bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold flex items-center justify-center cursor-pointer border-none active:scale-90 transition-transform"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} strokeWidth={3} />
                          </button>
                          <span className="px-1 text-[10px] font-black text-white min-w-[12px] text-center">
                            {qty}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id || item._id, 1);
                            }}
                            className="w-5 h-5 rounded bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold flex items-center justify-center cursor-pointer border-none active:scale-90 transition-transform"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} strokeWidth={3} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 z-50">
        
        {/* Quantity Stepper */}
        <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200/80 p-0.5">
          <button 
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="w-7 h-7 rounded-md bg-white text-slate-700 font-medium flex items-center justify-center cursor-pointer border-none active:scale-95 transition-transform"
          >
            <Minus size={13} />
          </button>
          <span className="w-7 text-center text-[12px] font-bold text-slate-800">{quantity}</span>
          <button 
            onClick={() => setQuantity(prev => prev + 1)}
            className="w-7 h-7 rounded-md bg-white text-slate-700 font-medium flex items-center justify-center cursor-pointer border-none active:scale-95 transition-transform"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex items-center gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-slate-900 text-white rounded-xl py-2.5 text-[13px] font-medium cursor-pointer border-none flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
          >
            <ShoppingCart size={15} /> Add
          </button>

          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl py-2.5 text-[13px] font-medium cursor-pointer border-none active:scale-98 transition-transform shadow-sm"
          >
            Buy Now
          </button>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-[12px] font-medium shadow-lg z-[100] whitespace-nowrap">
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
