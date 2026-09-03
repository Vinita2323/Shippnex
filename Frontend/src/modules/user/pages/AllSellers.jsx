import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Store, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { sellerService } from '../../../services/authService';

const fallbackSellersList = [
  {
    _id: 'seller_fashion_hub',
    businessName: 'Fashion Hub',
    ownerName: 'Sunita Sharma',
    businessType: 'Retail & Grocery',
    tagline: 'Fresh staples, premium cooking oils & daily packaged food',
    storeLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    categories: ['Groceries', 'Oil & Ghee', 'Staples'],
    rating: 4.9,
    reviewsCount: 184,
    deliveryTime: '15-25 min',
    distance: '1.2 km',
    warehouseLocation: {
      storeAddress: 'Shop 12, Market Square',
      area: 'Central Market',
      city: 'Mumbai',
    },
    isVerified: true
  },
  {
    _id: 'seller_clothing_hub',
    businessName: 'Clothing Hub',
    ownerName: 'Rajesh Kumar',
    businessType: 'Farm Fresh & Essentials',
    tagline: 'Direct-from-farm fresh fruits, crisp greens & veggies',
    storeLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    categories: ['Fresh Produce', 'Fruits', 'Vegetables'],
    rating: 4.8,
    reviewsCount: 142,
    deliveryTime: '20-30 min',
    distance: '2.1 km',
    warehouseLocation: {
      storeAddress: '45 Green Park Road',
      area: 'Green Park',
      city: 'Delhi',
    },
    isVerified: true
  },
  {
    _id: 'seller_granic_farms',
    businessName: 'GRANIC FARMS',
    ownerName: 'Anand Patel',
    businessType: 'Organic Dry Fruits',
    tagline: '100% natural roasted dry fruits, raw nuts & superfoods',
    storeLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80',
    categories: ['Dry Fruits', 'Organic', 'Superfoods'],
    rating: 5.0,
    reviewsCount: 215,
    deliveryTime: '15-20 min',
    distance: '0.8 km',
    warehouseLocation: {
      storeAddress: '88 Heritage Avenue',
      area: 'Indiranagar',
      city: 'Bengaluru',
    },
    isVerified: true
  },
  {
    _id: 'seller_apex_wholesale',
    businessName: 'Apex Wholesale Grocery',
    ownerName: 'Robert Vance',
    businessType: 'Superstore',
    tagline: 'Bulk groceries, family packs & staples at wholesale prices',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=80',
    categories: ['Grains & Flours', 'Household', 'Spices'],
    rating: 4.7,
    reviewsCount: 96,
    deliveryTime: '25-35 min',
    distance: '3.4 km',
    warehouseLocation: {
      storeAddress: 'Warehouse 4B, Industrial Sector',
      area: 'Sector 18',
      city: 'Noida',
    },
    isVerified: true
  }
];

const AllSellers = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const res = await sellerService.getPublicSellers();
        if (res.success && Array.isArray(res.sellers) && res.sellers.length > 0) {
          setSellers(res.sellers);
        } else {
          setSellers(fallbackSellersList);
        }
      } catch (err) {
        console.warn('Fallback to local sellers:', err);
        setSellers(fallbackSellersList);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const categories = ['All', 'Groceries', 'Fresh Produce', 'Organic', 'Dry Fruits', 'Superstore'];

  const filteredSellers = sellers.filter(s => {
    const nameMatch = s.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      s.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.businessType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return nameMatch;
    
    const catMatch = s.categories?.some(cat => 
      cat.toLowerCase().includes(selectedCategory.toLowerCase())
    ) || s.businessType?.toLowerCase().includes(selectedCategory.toLowerCase());

    return nameMatch && catMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white px-4 pt-3 pb-4 rounded-b-[24px] shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer flex items-center justify-center transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-bold m-0 flex items-center justify-center gap-1.5">
              <Store size={18} className="text-white" />
              Best Sellers & Stores
            </h1>
            <p className="text-[11px] text-white/80 m-0">Verified Merchants & Local Supermarkets</p>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Search Box */}
        <div className="relative flex items-center bg-white rounded-xl px-3 py-2 shadow-sm">
          <Search size={16} className="text-slate-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search stores by name, groceries, fruits..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none outline-none text-xs bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-none cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#ea580c] text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sellers List */}
      <div className="px-4 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading best seller stores...
          </div>
        ) : filteredSellers.length > 0 ? (
          filteredSellers.map((seller) => (
            <div 
              key={seller._id || seller.businessName}
              onClick={() => navigate(`/store/${encodeURIComponent(seller._id || seller.businessName)}`)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Store Banner */}
              <div className="h-28 w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={seller.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'} 
                  alt={seller.businessName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Delivery Badge */}
                <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                  <Clock size={11} className="text-emerald-400" />
                  {seller.deliveryTime || '15-25 min'}
                </div>

                {/* Store Avatar */}
                <div className="absolute -bottom-2 left-4 w-14 h-14 rounded-2xl bg-white p-1 shadow-md border-2 border-white overflow-hidden">
                  <img 
                    src={seller.storeLogo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80'} 
                    alt={seller.businessName} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Store Details */}
              <div className="pt-4 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 m-0">
                      {seller.businessName}
                      <CheckCircle size={14} className="text-emerald-600 fill-emerald-100 shrink-0" />
                    </h3>
                    <p className="text-[11px] text-slate-500 m-0 mt-0.5 line-clamp-1">{seller.tagline || seller.businessType}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-bold">{seller.rating || 4.9}</span>
                  </div>
                </div>

                {/* Categories and Location */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-1 truncate max-w-[240px]">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">
                      {seller.warehouseLocation?.area || seller.warehouseLocation?.city || 'City Market'}
                      {seller.distance && ` • ${seller.distance}`}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#ea580c] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Visit Store <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 mt-4">
            <Store size={36} className="text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 m-0">No sellers found</h4>
            <p className="text-xs text-slate-400 m-0 mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
