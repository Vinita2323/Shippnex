import express from 'express';
import mongoose from 'mongoose';
import Seller from '../models/Seller.model.js';
import Product from '../models/Product.model.js';

const router = express.Router();

// Fallback curated top sellers when database has fewer items
const fallbackSellers = [
  {
    _id: 'seller_fashion_hub',
    businessName: 'Fashion Hub',
    ownerName: 'Sunita Sharma',
    businessType: 'Retail & Grocery',
    tagline: 'Fresh staples, oils & packaged goods',
    storeLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    categories: ['Grocery', 'Oil & Ghee', 'Grains'],
    rating: 4.9,
    reviewsCount: 184,
    deliveryTime: '15-25 min',
    distance: '1.2 km',
    warehouseLocation: {
      storeAddress: 'Shop 12, Market Square',
      area: 'Central Market',
      city: 'Mumbai',
    },
    isVerified: true,
    status: 'approved'
  },
  {
    _id: 'seller_clothing_hub',
    businessName: 'Clothing Hub',
    ownerName: 'Rajesh Kumar',
    businessType: 'Fruits & Essentials',
    tagline: 'Farm fresh fruits, vegetables & produce',
    storeLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    categories: ['Fresh Fruits', 'Vegetables', 'Organic'],
    rating: 4.8,
    reviewsCount: 142,
    deliveryTime: '20-30 min',
    distance: '2.1 km',
    warehouseLocation: {
      storeAddress: '45 Green Park Road',
      area: 'Green Park',
      city: 'Delhi',
    },
    isVerified: true,
    status: 'approved'
  },
  {
    _id: 'seller_granic_farms',
    businessName: 'GRANIC FARMS',
    ownerName: 'Anand Patel',
    businessType: 'Dry Fruits & Organics',
    tagline: '100% natural roasted dry fruits & superfoods',
    storeLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80',
    categories: ['Dry Fruits', 'Healthy Snacks', 'Superfoods'],
    rating: 5.0,
    reviewsCount: 215,
    deliveryTime: '15-20 min',
    distance: '0.8 km',
    warehouseLocation: {
      storeAddress: '88 Heritage Avenue',
      area: 'Indiranagar',
      city: 'Bengaluru',
    },
    isVerified: true,
    status: 'approved'
  },
  {
    _id: 'seller_apex_wholesale',
    businessName: 'Apex Wholesale Grocery',
    ownerName: 'Robert Vance',
    businessType: 'Superstore',
    tagline: 'Bulk groceries & household supplies at best prices',
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
    isVerified: true,
    status: 'approved'
  }
];

// @desc    Get all public sellers
// @route   GET /api/sellers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let dbQuery = {};
    if (search) {
      dbQuery.businessName = { $regex: search, $options: 'i' };
    }
    if (category) {
      dbQuery.categories = { $regex: category, $options: 'i' };
    }

    const dbSellers = await Seller.find(dbQuery)
      .select('businessName ownerName businessType storeLogo tagline warehouseLocation categories isVerified status rating createdAt')
      .sort({ createdAt: -1 });

    // Combine DB sellers with fallback sellers
    const combined = [];
    
    // Add DB sellers
    dbSellers.forEach(s => {
      const plain = s.toObject();
      combined.push({
        _id: plain._id.toString(),
        businessName: plain.businessName || 'Store',
        ownerName: plain.ownerName || '',
        businessType: plain.businessType || 'Retail Store',
        tagline: plain.tagline || 'Quality groceries & daily essentials',
        storeLogo: plain.storeLogo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
        categories: plain.categories && plain.categories.length > 0 ? plain.categories : ['Groceries', 'Daily Needs'],
        rating: 4.8,
        reviewsCount: 120,
        deliveryTime: '15-25 min',
        distance: '1.5 km',
        warehouseLocation: plain.warehouseLocation || { storeAddress: 'Local Store', city: 'City' },
        isVerified: plain.isVerified || plain.status === 'approved',
        status: plain.status || 'approved'
      });
    });

    // Add fallback sellers if not duplicated
    fallbackSellers.forEach(fb => {
      const exists = combined.some(c => c.businessName?.toLowerCase() === fb.businessName.toLowerCase() || c._id === fb._id);
      if (!exists) {
        if (!search || fb.businessName.toLowerCase().includes(search.toLowerCase()) || fb.tagline.toLowerCase().includes(search.toLowerCase())) {
          if (!category || fb.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))) {
            combined.push(fb);
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: combined.length,
      sellers: combined
    });
  } catch (error) {
    console.error('[PUBLIC SELLERS FETCH ERROR]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching sellers',
      sellers: fallbackSellers
    });
  }
});

// @desc    Get single seller details + their products
// @route   GET /api/sellers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let seller = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      seller = await Seller.findById(id).select('businessName ownerName businessType storeLogo tagline warehouseLocation categories isVerified status phone email');
    }

    if (!seller) {
      // Find in fallback sellers by ID or name
      const cleanId = decodeURIComponent(id).toLowerCase();
      const fb = fallbackSellers.find(f => f._id.toLowerCase() === cleanId || f.businessName.toLowerCase() === cleanId);
      if (fb) {
        seller = fb;
      } else {
        // Create standard fallback profile
        seller = {
          _id: id,
          businessName: decodeURIComponent(id),
          ownerName: 'Store Manager',
          businessType: 'Retail Store',
          tagline: 'Premium quality products and lightning-fast delivery',
          storeLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&auto=format&fit=crop&q=80',
          banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
          categories: ['Groceries', 'Daily Needs'],
          rating: 4.8,
          reviewsCount: 150,
          deliveryTime: '15-25 min',
          distance: '1.2 km',
          warehouseLocation: {
            storeAddress: 'Local Store Hub',
            area: 'Market Area',
            city: 'City'
          },
          isVerified: true,
          status: 'approved'
        };
      }
    }

    // Fetch products belonging to this seller
    let productQuery = {
      $or: [
        { seller: seller.businessName },
        { seller: { $regex: new RegExp(`^${seller.businessName}$`, 'i') } }
      ]
    };

    if (mongoose.Types.ObjectId.isValid(id)) {
      productQuery.$or.push({ sellerId: id });
    }

    let products = await Product.find(productQuery).sort({ createdAt: -1 });

    // If no specific DB products matched, provide matching or generic products
    if (products.length === 0) {
      const allProducts = await Product.find().limit(8);
      products = allProducts;
    }

    res.status(200).json({
      success: true,
      seller,
      products
    });
  } catch (error) {
    console.error('[GET SELLER STORE ERROR]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching seller store'
    });
  }
});

export default router;
