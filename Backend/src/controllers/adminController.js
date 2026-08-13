import Seller from '../models/Seller.model.js';

// Get all sellers
export const getAllSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    next(error);
  }
};

// Toggle seller status (Approve/Pending/Reject)
export const toggleSellerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'approved', 'pending', or 'rejected'

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.status = status;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
      seller
    });
  } catch (error) {
    next(error);
  }
};

// Update seller commission percentage (%)
export const updateSellerCommission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commissionPercentage } = req.body;

    const commRate = Number(commissionPercentage);
    if (isNaN(commRate) || commRate < 0 || commRate > 100) {
      return res.status(400).json({ success: false, message: 'Please enter a valid commission percentage between 0 and 100' });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.commissionPercentage = commRate;
    await seller.save();

    console.log(`[Admin] Updated Seller "${seller.businessName}" Commission Percentage to ${commRate}%`);

    res.status(200).json({
      success: true,
      message: `Commission percentage updated to ${commRate}% for ${seller.businessName || 'Seller'}`,
      seller,
    });
  } catch (error) {
    next(error);
  }
};

