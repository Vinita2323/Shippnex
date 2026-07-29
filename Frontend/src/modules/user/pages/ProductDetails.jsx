import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ShoppingCart, ChevronRight, ChevronDown, Truck, ShieldCheck, Tag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';
import oilGheeImg from '../../../assets/user/categories/OilGhee-removebg-preview.png';
import masalaImg from '../../../assets/user/categories/masala-removebg-preview.png';
import sugarImg from '../../../assets/user/categories/Sugar-removebg-preview.png';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Mock product info
  const product = {
    id: id,
    name: 'Premium Basmati',
    brand: 'Mynzo World',
    price: 2499,
    originalPrice: 3998,
    discount: 38,
    image: grainsImg,
    description: 'High-quality premium basmati rice, perfect for everyday meals and special occasions. Carefully aged for the best texture and aroma.'
  };

  const similarProducts = [
    { id: 2, name: 'Refined Oil', brand: 'Mynzo World', price: 699, originalPrice: 1118, discount: 38, image: oilGheeImg },
    { id: 3, name: 'Toor Dal 5kg', brand: 'Mynzo World', price: 1499, originalPrice: 2398, discount: 38, image: masalaImg },
    { id: 4, name: 'Organic Sugar', brand: 'Mynzo World', price: 1299, originalPrice: 2078, discount: 38, image: sugarImg },
  ];

  const handleWishlistClick = () => {
    const isAdded = toggleWishlist(product);
    if (isAdded) {
      setToastMessage('Your item is added to wishlist!');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      setToastMessage('Item removed from wishlist');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setToastMessage('Item added to cart!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const isFav = isInWishlist(product.id);

  // Modal content mapping
  const modalContent = {
    product: {
      title: 'Product Details',
      content: (
        <ul className="text-[13px] text-slate-600 space-y-2 pl-4 m-0">
          <li><strong>Brand:</strong> {product.brand}</li>
          <li><strong>Type:</strong> Basmati Rice</li>
          <li><strong>Weight:</strong> 5 kg</li>
          <li><strong>Shelf Life:</strong> 24 Months</li>
          <li><strong>Dietary Preference:</strong> Vegetarian</li>
        </ul>
      )
    },
    delivery: {
      title: 'Delivery Details',
      content: (
        <div className="text-[13px] text-slate-600 space-y-3">
          <p className="m-0"><strong>Standard Delivery:</strong> Free delivery by tomorrow for orders above ₹500.</p>
          <p className="m-0"><strong>Express Delivery:</strong> Available in select areas within 2 hours for an additional ₹49.</p>
          <p className="m-0"><strong>Tracking:</strong> You can track your order in the 'Orders' section once dispatched.</p>
        </div>
      )
    },
    policy: {
      title: 'All Details & Policy',
      content: (
        <div className="text-[13px] text-slate-600 space-y-3">
          <p className="m-0"><strong>Return Policy:</strong> 7-day easy returns for defective or damaged products. Please keep the original packaging intact.</p>
          <p className="m-0"><strong>Refunds:</strong> Processed within 3-5 business days to original payment method after return is approved.</p>
          <p className="m-0"><strong>Customer Support:</strong> Available 24/7 via the help center for any queries or assistance.</p>
        </div>
      )
    }
  };

  return (
    <div className="h-[100dvh] bg-white font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar [&::-webkit-scrollbar]:hidden pb-24">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-5 absolute top-0 w-full z-10">
        <div 
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </div>
        <div 
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer shadow-sm"
          onClick={handleWishlistClick}
        >
          <Heart size={20} className={isFav ? "text-red-500" : "text-slate-700"} fill={isFav ? "currentColor" : "none"} />
        </div>
      </header>

      {/* Image Area */}
      <div className="bg-[#f0f3f6] w-full h-[350px] flex items-center justify-center pt-10 rounded-b-[40px] shadow-sm relative">
        <img src={product.image} alt={product.name} className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply" />
      </div>

      {/* Product Info */}
      <div className="px-5 pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-[22px] font-extrabold text-slate-900 m-0 mb-1">{product.name}</h1>
            <p className="text-[13px] font-medium text-slate-500 m-0">{product.brand}</p>
          </div>
          <div className="bg-orange-50 px-2 py-1 rounded-md flex items-center gap-1">
            <span className="text-[12px] font-bold text-orange-600">4.5</span>
            <Star size={12} className="text-orange-500" fill="currentColor" />
          </div>
        </div>

        <div className="flex items-end gap-2 mb-6 mt-4">
          <span className="text-[24px] font-extrabold text-slate-900 leading-none">₹{product.price}</span>
          <span className="text-[14px] text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
          <span className="text-[12px] font-extrabold text-[#ff5500] mb-1.5 ml-1">-{product.discount}% OFF</span>
        </div>

        <h3 className="text-[16px] font-bold text-slate-800 mb-2">Description</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Additional Details */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleAccordion('product')}
            >
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-slate-500" />
                <span className="text-[14px] font-bold text-slate-800">Product Details</span>
              </div>
              {activeAccordion === 'product' ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </div>
            {activeAccordion === 'product' && (
              <div className="px-4 pb-4 pt-1 animate-fade-in">
                {modalContent['product'].content}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleAccordion('delivery')}
            >
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-slate-500" />
                <div className="flex flex-col">
                   <span className="text-[14px] font-bold text-slate-800">Delivery Details</span>
                   <span className="text-[11px] font-medium text-slate-500 mt-0.5">Free delivery by tomorrow</span>
                </div>
              </div>
              {activeAccordion === 'delivery' ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </div>
            {activeAccordion === 'delivery' && (
              <div className="px-4 pb-4 pt-1 animate-fade-in">
                {modalContent['delivery'].content}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleAccordion('policy')}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-500" />
                <span className="text-[14px] font-bold text-slate-800">All Details & Policy</span>
              </div>
              {activeAccordion === 'policy' ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </div>
            {activeAccordion === 'policy' && (
              <div className="px-4 pb-4 pt-1 animate-fade-in">
                {modalContent['policy'].content}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[16px] font-bold text-slate-800 m-0">Similar Products</h3>
            <div className="flex items-center gap-0.5 text-[#ff5500] cursor-pointer hover:underline" onClick={() => navigate('/categories')}>
              <span className="text-[12px] font-bold">See more</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden -mx-5 px-5">
            {similarProducts.map(item => (
              <div 
                key={item.id} 
                className="min-w-[140px] bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-50 cursor-pointer transition-transform hover:-translate-y-1" 
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="bg-[#f0f3f6] h-[120px] relative w-full flex items-center justify-center p-3">
                  <img src={item.image} alt={item.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply" />
                </div>
                <div className="p-3 bg-white flex flex-col">
                  <h4 className="text-[12px] font-bold text-slate-800 m-0 mb-1 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 m-0 mb-2 truncate">{item.brand}</p>
                  <div className="flex items-center gap-1.5 mt-auto">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-[24px] flex gap-3 z-50 border-t border-slate-50">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-slate-50 text-slate-800 border-none rounded-xl p-3.5 text-[14px] font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} className="text-slate-700" /> Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#ff5500] text-white border-none rounded-xl p-3.5 text-[14px] font-bold cursor-pointer shadow-[0_4px_12px_rgba(255,85,0,0.2)] transition-transform duration-200 active:scale-[0.98]"
        >
          Buy Now
        </button>
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

export default ProductDetails;
