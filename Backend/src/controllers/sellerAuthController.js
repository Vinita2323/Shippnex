import Seller from '../models/Seller.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';

// Send OTP
export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const { otp, otpExpiry } = generateOtp();

    let seller = await Seller.findOne({ phone });

    if (!seller) {
      // Default new sellers to pending status
      seller = await Seller.create({ phone, otp, otpExpiry, status: 'pending' });
    } else {
      seller.otp = otp;
      seller.otpExpiry = otpExpiry;
      await seller.save();
    }

    // Log OTP for development/testing
    console.log(`\n========================================`);
    console.log(`[SELLER AUTH] OTP for ${phone}: ${otp}`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phone,
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const seller = await Seller.findOne({ phone });

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller record not found' });
    }

    // Allow hardcoded OTP '123456' for testing
    if (seller.otp !== otp && otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (new Date() > new Date(seller.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    seller.otp = undefined;
    seller.otpExpiry = undefined;
    seller.isVerified = true;
    await seller.save();

    // Check admin approval status
    if (seller.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: 'Your seller account is currently under review by admin.',
      });
    }

    if (seller.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: 'Your seller account application has been rejected.',
      });
    }

    const token = generateToken({ id: seller._id, phone: seller.phone, role: seller.role });

    res.status(200).json({
      success: true,
      message: 'Seller verified successfully',
      token,
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        phone: seller.phone,
        role: seller.role,
        status: seller.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
