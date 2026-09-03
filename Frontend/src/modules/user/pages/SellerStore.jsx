import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Store, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ShoppingCart, 
  Heart, 
  Plus, 
  Trash2,
  Phone,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { sellerService, productService } from '../../../services/authService';
import { getImageUrl } from '../../../utils/imageUtils';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';

const fallbackStoreData = {
  _id: 'default_seller',
  businessName: 'Fashion Hub',
  ownerName: 'Sunita Sharma',
  businessType: 'Retail & Grocery',
  tagline: 'Fresh staples, cooking oils, snacks & daily groceries',
  storeLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
  categories: ['Groceries', 'Oil & Ghee', 'Grains'],
  rating: 4.9,
  reviewsCount: 184,
  deliveryTime: '15-25 min',
  distance: '1.2 km',
  warehouseLocation: {
    storeAddress: 'Shop 12, Market Square, Central Market',
    city: 'Mumbai',
  },
  isVerified: true
};

const SellerStore = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, removeFromCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const decoded = decodeURIComponent(sellerId || '');
        const res = await sellerService.getSellerStore(decoded);
        
        if (res.success && res.seller) {
          setSeller(res.seller);
          setProducts(res.products || []);
        } else {
          // If no specific API data, fallback gracefully
          setSeller({ ...fallbackStoreData, businessName: decoded || fallbackStoreData.businessName });
          // Fetch some products for showcase
          const prodRes = await productService.getProducts({});
          if (prodRes.success && prodRes.products) {
            setProducts(prodRes.products);
          }
        }
      } catch (err) {
        console.warn('Fallback store details:', err);
        setSeller(fallbackStoreData);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [sellerId]);

  const handleAddToCart = async (product) => {
    const res = await addToCart(product, 1, { navigate, returnUrl: window.location.pathname });
    if (res && res.success) {
      setToastMessage(`${product.name} added to cart!`);
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] pb-16">
      {/* Store Banner & Navigation */}
      <div className="relative h-44 bg-slate-800 w-full overflow-hidden">
        <img 
          src={seller?.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'} 
          alt={seller?.businessName || 'Store Banner'} 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>

        {/* Top Navbar */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/cart')} 
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer relative hover:bg-black/60 transition-all"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Store Avatar & Badge Info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-white overflow-hidden shrink-0">
              <img 
                src={seller?.storeLogo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80'} 
                alt={seller?.businessName} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="text-white">
              <h1 className="text-base font-bold m-0 flex items-center gap-1.5 leading-tight">
                {seller?.businessName}
                <CheckCircle size={15} className="text-emerald-400 fill-emerald-400/20" />
              </h1>
              <p className="text-[11px] text-white/80 m-0 mt-0.5 line-clamp-1">{seller?.tagline || 'Verified Merchant'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-400 text-slate-900 font-extrabold text-xs px-2 py-0.5 rounded-lg shadow-sm">
            <Star size={12} className="fill-slate-900" />
            {seller?.rating || 4.9}
          </div>
        </div>
      </div>

      {/* Store Quick Info Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-emerald-600" />
          <span className="font-semibold text-slate-800">{seller?.deliveryTime || '15-25 min'}</span>
          <span className="text-slate-300">|</span>
          <MapPin size={13} className="text-slate-400" />
          <span className="truncate max-w-[150px]">{seller?.warehouseLocation?.storeAddress || seller?.warehouseLocation?.city || 'Local Store'}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <ShieldCheck size={12} />
          <span>FSSAI & GST Verified</span>
        </div>
      </div>

      {/* In-Store Search */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-2xs">
          <Search size={16} className="text-slate-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder={`Search items in ${seller?.businessName || 'this store'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none outline-none text-xs bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Store Products */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 m-0">Store Products ({filteredProducts.length})</h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading store inventory...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((prod) => {
              const salePrice = Number(prod.salePrice || prod.price || 0);
              const originalPrice = Number(prod.mrp || prod.originalPrice || salePrice);
              const discount = prod.discount || (originalPrice > salePrice ? `${Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% OFF` : '');

              return (
                <div key={prod._id || prod.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="h-[125px] w-full overflow-hidden bg-slate-50 relative cursor-pointer" onClick={() => navigate(`/product/${prod._id || prod.id}`)}>
                    <img 
                      src={getImageUrl(prod.mainImage || prod.image, grainsImg)} 
                      alt={prod.name} 
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
                      <p className="text-[11px] text-slate-400 m-0">{prod.unit || `${prod.unitValue || 1} ${prod.unitType || 'kg'}`}</p>
                    </div>
                    
                    <div className="flex items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[14px] font-extrabold text-slate-900">₹{salePrice.toFixed(2)}</span>
                        {originalPrice > salePrice && (
                          <span className="text-[10px] text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {discount && (
                        <span className="text-[9.5px] font-extrabold text-[#ff5500] whitespace-nowrap shrink-0">{discount}</span>
                      )}
                    </div>

                    <div>
                      {!isInCart(prod.id || prod._id) ? (
                        <button 
                          onClick={() => handleAddToCart({ ...prod, id: prod._id || prod.id, price: salePrice, originalPrice, discount, image: prod.mainImage || prod.image })} 
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
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 mt-2">
            <Store size={36} className="text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 m-0">No items found</h4>
            <p className="text-xs text-slate-400 m-0 mt-1">This store does not have items matching your search</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-xl z-50 whitespace-nowrap flex items-center gap-2 transition-all duration-300">
          <ShoppingCart size={14} />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SellerStore;
