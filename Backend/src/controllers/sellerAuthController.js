import Seller from '../models/Seller.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

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
      // Auto approve seller 9302841832
      const initialStatus = phone === '9302841832' ? 'approved' : 'pending';
      seller = await Seller.create({ 
        phone, 
        otp, 
        otpExpiry, 
        status: initialStatus,
        isVerified: true,
        businessName: phone === '9302841832' ? 'Official Seller Store' : 'Seller Store'
      });
    } else {
      seller.otp = otp;
      seller.otpExpiry = otpExpiry;
      if (phone === '9302841832') {
        seller.status = 'approved';
        seller.isVerified = true;
      }
      await seller.save();
    }

    // Log OTP for development/testing
    console.log(`\n========================================`);
    console.log(`[SELLER AUTH] OTP for ${phone}: ${otp} (Testing OTP: 123456)`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Use code 123456 or generated OTP.',
      phone,
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
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

    let seller = await Seller.findOne({ phone });

    if (!seller) {
      if (phone === '9302841832') {
        seller = await Seller.create({
          phone,
          status: 'approved',
          isVerified: true,
          businessName: 'Official Seller Store',
        });
      } else {
        return res.status(404).json({ success: false, message: 'Seller record not found' });
      }
    }

    // Allow test OTP '123456'
    const isTestOtp = otp === '123456';
    if (!isTestOtp && seller.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (!isTestOtp && seller.otpExpiry && new Date() > new Date(seller.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    seller.otp = undefined;
    seller.otpExpiry = undefined;
    seller.isVerified = true;
    
    // Auto-approve seller 9302841832
    if (phone === '9302841832') {
      seller.status = 'approved';
    }

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

    const token = generateToken({ id: seller._id, phone: seller.phone, role: seller.role || 'seller' });

    res.status(200).json({
      success: true,
      message: 'Seller verified successfully',
      token,
      seller,
    });
  } catch (error) {
    next(error);
  }
};

// Register Seller
export const registerSeller = async (req, res, next) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      email,
      businessType,
      storeLogo,
      serviceRadius,
      completeAddress,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      fssaiLicense
    } = req.body;

    if (!phone || !businessName) {
      return res.status(400).json({ success: false, message: 'Phone and Business Name are required' });
    }

    let existingSeller = await Seller.findOne({ phone });
    if (existingSeller && existingSeller.status !== 'pending') {
       return res.status(400).json({ success: false, message: 'Phone number already registered and processed.' });
    }

    let processedLogo = '';
    if (storeLogo && typeof storeLogo === 'string' && storeLogo.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(storeLogo, 'sellers/logos');
        processedLogo = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for seller logo:', err.message);
      }
    }

    const sellerData = {
      businessName,
      ownerName,
      phone,
      email,
      businessType,
      storeLogo: processedLogo || storeLogo,
      serviceRadius: serviceRadius ? Number(serviceRadius) : 5,
      gstNumber,
      panNumber,
      fssaiLicense,
      warehouseLocation: {
        storeAddress: completeAddress,
        city,
        state,
        pincode,
        location: { type: 'Point', coordinates: [0, 0] }
      },
      status: 'pending' // Requires admin approval
    };

    let seller;
    if (existingSeller) {
      seller = await Seller.findByIdAndUpdate(existingSeller._id, sellerData, { new: true });
    } else {
      seller = await Seller.create(sellerData);
    }

    res.status(201).json({
      success: true,
      message: 'Seller registration submitted successfully. Pending admin approval.',
      seller
    });
  } catch (error) {
    next(error);
  }
};

// Get Seller Profile
export const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found' });
    }
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    next(error);
  }
};

// Update Seller Profile
export const updateSellerProfile = async (req, res, next) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      businessType,
      storeLogo,
      serviceRadius,
      tagline,
      gstNumber,
      panNumber,
      fssaiLicense,
      bankName,
      accountNumber,
      ifscCode,
      categories,
      storeAddress,
      city,
      state,
      pincode,
    } = req.body;

    const seller = await Seller.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found' });
    }

    if (businessName !== undefined) seller.businessName = businessName;
    if (ownerName !== undefined) seller.ownerName = ownerName;
    if (email !== undefined) seller.email = email;
    if (businessType !== undefined) seller.businessType = businessType;
    
    if (storeLogo && typeof storeLogo === 'string' && storeLogo.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(storeLogo, 'sellers/logos');
        seller.storeLogo = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for seller logo:', err.message);
        seller.storeLogo = storeLogo;
      }
    } else if (storeLogo !== undefined) {
      seller.storeLogo = storeLogo;
    }

    if (serviceRadius !== undefined) seller.serviceRadius = Number(serviceRadius);
    if (tagline !== undefined) seller.tagline = tagline;
    if (gstNumber !== undefined) seller.gstNumber = gstNumber;
    if (panNumber !== undefined) seller.panNumber = panNumber;
    if (fssaiLicense !== undefined) seller.fssaiLicense = fssaiLicense;
    if (bankName !== undefined) seller.bankName = bankName;
    if (accountNumber !== undefined) seller.accountNumber = accountNumber;
    if (ifscCode !== undefined) seller.ifscCode = ifscCode;
    if (categories !== undefined) seller.categories = categories;

    if (storeAddress !== undefined || city !== undefined || state !== undefined || pincode !== undefined) {
      seller.warehouseLocation = {
        ...seller.warehouseLocation,
        storeAddress: storeAddress !== undefined ? storeAddress : seller.warehouseLocation?.storeAddress,
        city: city !== undefined ? city : seller.warehouseLocation?.city,
        state: state !== undefined ? state : seller.warehouseLocation?.state,
        pincode: pincode !== undefined ? pincode : seller.warehouseLocation?.pincode,
      };
    }

    await seller.save();

    res.status(200).json({
      success: true,
      message: 'Seller profile updated successfully',
      seller,
    });
  } catch (error) {
    next(error);
  }
};

