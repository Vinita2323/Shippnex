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
