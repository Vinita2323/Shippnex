import User from '../models/User.model.js';
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

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    // Log OTP for development/testing
    console.log(`\n========================================`);
    console.log(`[USER AUTH] OTP for ${phone}: ${otp}`);
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

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Allow hardcoded OTP '123456' for testing
    if (user.otp !== otp && otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    const token = generateToken({ id: user._id, phone: user.phone, role: user.role });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get User Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, city } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: false }
    ).select('-otp -otpExpiry');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};
