import Banner from '../models/Banner.model.js';

// Initial default seed banners
const initialBanners = [
  {
    title: 'BIG SAVINGS',
    subtitle: 'on Bulk Orders',
    discountBadge: 'Up to 25% OFF',
    ctaText: 'Shop Now',
    redirectUrl: '/categories',
    imageUrl: '/promo_banner_bg.png',
    position: 'Hero Banner',
    priority: 1,
    status: 'Active',
  },
  {
    title: 'FASTEST DELIVERY',
    subtitle: 'Express Logistics Guarantee',
    discountBadge: 'Flat 20% OFF',
    ctaText: 'Book Transport',
    redirectUrl: '/transport',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&auto=format&fit=crop&q=80',
    position: 'Hero Banner',
    priority: 2,
    status: 'Active',
  },
];

// Get all banners (Public for User App)
export const getBanners = async (req, res, next) => {
  try {
    let banners = await Banner.find().sort({ priority: 1 });

    // Seed default banners if empty
    if (banners.length === 0) {
      banners = await Banner.insertMany(initialBanners);
    }

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    next(error);
  }
};

// Create new banner (Admin)
export const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, discountBadge, ctaText, redirectUrl, imageUrl, position, priority, status } = req.body;

    const banner = await Banner.create({
      title,
      subtitle,
      discountBadge,
      ctaText,
      redirectUrl,
      imageUrl,
      position: position || 'Hero Banner',
      priority: priority || 1,
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// Update banner (Admin)
export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// Delete banner (Admin)
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
