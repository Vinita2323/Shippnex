import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Star, Filter, Plus, Minus, Check, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { categoryService, productService } from '../../../services/authService';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';
import groceryImg from '../../../assets/user/categories/Grocery-removebg-preview.png';
import readyCookImg from '../../../assets/user/categories/readyfoot-removebg-preview.png';
import homeCareImg from '../../../assets/user/categories/homecare-removebg-preview.png';
import personalCareImg from '../../../assets/user/categories/personalcare-removebg-preview.png';

const fallbackCategories = [
  { name: 'Grains & Flours', image: grainsImg },
  { name: 'Oil & Ghee', image: oilGheeImg },
  { name: 'Spices & Masala', image: masalaImg },
  { name: 'Sugar & Sweeteners', image: sugarImg },
  { name: 'Grocery Essentials', image: groceryImg },
  { name: 'Ready-to-Cook', image: readyCookImg },
  { name: 'Home Care', image: homeCareImg },
  { name: 'Personal Care', image: personalCareImg }
];

const defaultSubCategoryMap = {
  'Grains & Flours': [
    { _id: 'sub_atta', name: 'Atta & Flours', image: grainsImg },
    { _id: 'sub_rice', name: 'Rice & Rice Products', image: grainsImg },
    { _id: 'sub_dal', name: 'Dal & Pulses', image: grainsImg }
  ],
  'Oil & Ghee': [
    { _id: 'sub_oil', name: 'Edible Oils', image: oilGheeImg },
    { _id: 'sub_ghee', name: 'Ghee & Vanaspati', image: oilGheeImg }
  ],
  'Spices & Masala': [
    { _id: 'sub_spices', name: 'Whole Spices', image: masalaImg },
    { _id: 'sub_powder', name: 'Powdered Spices', image: masalaImg }
  ],
  'Sugar & Sweeteners': [
    { _id: 'sub_sugar', name: 'Sugar & Salt', image: sugarImg }
  ]
};

const Categories = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, updateQuantity, getItemQuantity, isInCart, removeFromCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const [activeCategory, setActiveCategoryState] = useState(() => {
    return sessionStorage.getItem('shippnex_active_cat') || 'Grains & Flours';
  });
  const [activeSubCategory, setActiveSubCategoryState] = useState(() => {
    return sessionStorage.getItem('shippnex_active_sub') || null;
  });

  const setActiveCategory = (catName) => {
    setActiveCategoryState(catName);
    sessionStorage.setItem('shippnex_active_cat', catName);
  };

  const setActiveSubCategory = (subCatName) => {
    setActiveSubCategoryState(subCatName);
    if (subCatName) {
      sessionStorage.setItem('shippnex_active_sub', subCatName);
    } else {
      sessionStorage.removeItem('shippnex_active_sub');
    }
  };

  const [allCategories, setAllCategories] = useState([]);
  const [sidebarCategories, setSidebarCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        const res = await (categoryService.getAllCategories ? categoryService.getAllCategories() : categoryService.getCategories());
        if (res && res.success && Array.isArray(res.categories)) {
          setAllCategories(res.categories);
          const topLevel = res.categories.filter(c => !c.parent);
          if (topLevel.length > 0) {
            setSidebarCategories(topLevel);
          } else {
            setSidebarCategories(fallbackCategories);
          }
        } else {
          setSidebarCategories(fallbackCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setSidebarCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesData();
  }, []);

  React.useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await productService.getProducts({ 
          category: activeCategory, 
          subCategory: activeSubCategory || undefined 
        });
        if (res && res.success && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch category products:', err);
        setProducts([]);
      }
    };
    if (activeCategory) {
      fetchCategoryProducts();
    }
  }, [activeCategory, activeSubCategory]);

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const isAdded = toggleWishlist(product);
    if (isAdded) {
      setToastMessage('Item added to wishlist! ❤️');
      setTimeout(() => setToastMessage(''), 2500);
    } else {
      setToastMessage('Item removed from wishlist');
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#fdfaf6] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white shadow-2xs border-b border-slate-100/80 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[20px] font-extrabold text-[#1a1b41] m-0">All Categories</h2>
        </div>
        <div className="bg-[#f5f6fa] rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-100">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories or products..." 
            className="bg-transparent border-none outline-none text-[12px] w-full text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[82px] bg-white border-r border-slate-100 overflow-y-auto shrink-0 [&::-webkit-scrollbar]:hidden">
          {sidebarCategories.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <div 
                key={cat._id || idx}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setActiveSubCategory(null);
                }}
                className={`py-3 px-1 flex flex-col items-center justify-center cursor-pointer relative transition-all border-b border-slate-50 ${
                  isActive ? 'bg-[#fff5ee]' : 'hover:bg-slate-50/50'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5500] rounded-r-full"></div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 mb-1 transition-transform ${
                  isActive ? 'scale-105' : 'opacity-80'
                }`}>
                  <img src={cat.image || grainsImg} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className={`text-[9.5px] text-center font-bold leading-tight ${
                  isActive ? 'text-[#ff5500]' : 'text-slate-600'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
          <div className="h-[100px]"></div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-3 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-[#fdfaf6]">
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

          {/* Subcategories */}
          {(() => {
            const activeCatObj = sidebarCategories.find(c => c.name === activeCategory || c._id === activeCategory);
            const catId = activeCatObj ? (activeCatObj._id || activeCatObj.id) : null;
            let subCategories = catId 
              ? allCategories.filter(c => c.parent && (String(c.parent) === String(catId) || String(c.parent._id || '') === String(catId)))
              : [];

            if (subCategories.length === 0 && defaultSubCategoryMap[activeCategory]) {
              subCategories = defaultSubCategoryMap[activeCategory];
            }
            
            return (
              <div className="flex gap-4 overflow-x-auto pb-4 mb-2 [&::-webkit-scrollbar]:hidden">
                <div 
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                  onClick={() => setActiveSubCategory(null)}
                >
                  <div className={`w-[55px] h-[55px] rounded-[14px] bg-white border flex justify-center items-center overflow-hidden mb-1.5 shadow-sm transition-all ${
                    activeSubCategory === null ? 'border-[#ff5500] shadow-md' : 'border-slate-100 group-hover:border-[#ff5500] group-hover:shadow-md'
                  }`}>
                    <div className="w-[40px] h-[40px] flex items-center justify-center bg-orange-50 rounded-lg">
                      <span className="text-[#ff5500] font-bold text-sm">All</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold text-center w-16 leading-tight transition-colors ${
                    activeSubCategory === null ? 'text-[#ff5500]' : 'text-slate-600 group-hover:text-[#ff5500]'
                  }`}>All</span>
                </div>
                {subCategories.map(sub => (
                  <div 
                    key={sub._id || sub.name} 
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                    onClick={() => setActiveSubCategory(sub.name === activeSubCategory ? null : sub.name)}
                  >
                    <div className={`w-[55px] h-[55px] rounded-[14px] bg-white border flex justify-center items-center overflow-hidden mb-1.5 shadow-sm transition-all ${
                      activeSubCategory === sub.name ? 'border-[#ff5500] shadow-md' : 'border-slate-100 group-hover:border-[#ff5500] group-hover:shadow-md'
                    }`}>
                      <img src={sub.image || grainsImg} alt={sub.name} className="w-[40px] h-[40px] object-contain" />
                    </div>
                    <span className={`text-[10px] font-bold text-center w-16 leading-tight transition-colors ${
                      activeSubCategory === sub.name ? 'text-[#ff5500]' : 'text-slate-600 group-hover:text-[#ff5500]'
                    }`}>{sub.name}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3 pb-24">
            {products.map((item) => {
              const itemDiscount = item.mrp && item.salePrice ? Math.round(((item.mrp - item.salePrice) / item.mrp) * 100) : 0;
              const qty = getItemQuantity(item._id || item.id);
              return (
              <div 
                key={item._id} 
                className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative border border-slate-50 cursor-pointer transition-transform hover:-translate-y-1"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                
                {/* Image Section */}
                <div className="bg-[#f0f3f6] h-[125px] relative w-full overflow-hidden flex items-center justify-center">
                  {/* Heart */}
                  <div 
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 transition-all ${
                      isInWishlist(item._id || item.id) 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                        : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white'
                    }`}
                    onClick={(e) => handleWishlistClick(e, item)}
                  >
                    <Heart size={13} className={isInWishlist(item._id || item.id) ? "text-emerald-600 fill-emerald-600" : "text-slate-600"} />
                  </div>
                  
                  <img src={item.mainImage || grainsImg} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Rating Pill */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-700">0</span>
                    <Star size={9} className="text-teal-500 fill-teal-500" />
                    <span className="text-[10px] text-slate-300">|</span>
                    <span className="text-[10px] text-slate-500">0</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-2.5 pb-3 bg-white flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h4 className="text-[12px] font-bold text-slate-800 m-0 mb-0.5 leading-tight truncate">{item.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 m-0 truncate">{item.brand || 'No Brand'}</p>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-black text-slate-900">₹{item.salePrice || item.price}</span>
                      {item.mrp && item.mrp > (item.salePrice || item.price) && (
                        <span className="text-[10px] text-slate-400 line-through">₹{item.mrp}</span>
                      )}
                    </div>
                    {itemDiscount > 0 && <span className="text-[9.5px] font-extrabold text-[#ff5500]">-{itemDiscount}% OFF</span>}
                  </div>

                  {/* Green / Red Button BELOW Price Row */}
                  <div>
                    {!isInCart(item._id || item.id) ? (
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await addToCart(item, 1, { navigate, returnUrl: window.location.pathname });
                          if (res && res.success) {
                            setToastMessage('Item added to cart! 🛒');
                            setTimeout(() => setToastMessage(''), 2000);
                          }
                        }}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                        aria-label="Add to cart"
                      >
                        <Plus size={14} strokeWidth={3} /> ADD
                      </button>
                    ) : (
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          await removeFromCart(item._id || item.id);
                          setToastMessage('Item removed from cart');
                          setTimeout(() => setToastMessage(''), 2000);
                        }}
                        className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[12px] flex items-center justify-center gap-1 border-none cursor-pointer shadow-2xs active:scale-98 transition-all"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={13} strokeWidth={2.5} /> REMOVE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )})}
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
