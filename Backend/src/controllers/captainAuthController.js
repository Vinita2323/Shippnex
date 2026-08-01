import Captain from '../models/Captain.model.js';
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

    let captain = await Captain.findOne({ phone });

    if (!captain) {
      captain = await Captain.create({ phone, otp, otpExpiry });
    } else {
      captain.otp = otp;
      captain.otpExpiry = otpExpiry;
      await captain.save();
    }

    // Log OTP for development/testing
    console.log(`\n========================================`);
    console.log(`[CAPTAIN AUTH] OTP for ${phone}: ${otp}`);
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

    const captain = await Captain.findOne({ phone });

    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    if (captain.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (new Date() > new Date(captain.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    captain.otp = undefined;
    captain.otpExpiry = undefined;
    captain.isVerified = true;
    await captain.save();

    const token = generateToken({ id: captain._id, phone: captain.phone, role: captain.role });

    res.status(200).json({
      success: true,
      message: 'Captain verified successfully',
      token,
      captain: {
        id: captain._id,
        name: captain.name,
        phone: captain.phone,
        role: captain.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
