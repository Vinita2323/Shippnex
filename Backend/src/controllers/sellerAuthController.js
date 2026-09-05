import Seller from '../models/Seller.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import SellerMembership from '../models/SellerMembership.model.js';
import SellerMembershipPlan from '../models/SellerMembershipPlan.model.js';
import { sendOtpSMS, normalizePhoneNumber } from '../services/smsIndiaHubService.js';
import crypto from 'crypto';

// Send OTP
export const sendOtp = async (req, res, next) => {
  try {
    const rawPhone = req.body.phone;

    if (!rawPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = normalizePhoneNumber(rawPhone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    const { otp, otpExpiry } = generateOtp();

    let seller = await Seller.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91${cleanPhone}` },
        { phone: `+91 ${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
        { phone: String(rawPhone).trim() },
      ]
    });

    if (!seller) {
      // Auto approve seller 9302841832
      const initialStatus = cleanPhone === '9302841832' ? 'approved' : 'pending';
      seller = await Seller.create({ 
        phone: cleanPhone, 
        otp, 
        otpExpiry, 
        status: initialStatus,
        isVerified: true,
        businessName: cleanPhone === '9302841832' ? 'Official Seller Store' : 'Seller Store'
      });
    } else {
      seller.otp = otp;
      seller.otpExpiry = otpExpiry;
      if (seller.phone !== cleanPhone) {
        seller.phone = cleanPhone;
      }
      if (cleanPhone === '9302841832') {
        seller.status = 'approved';
        seller.isVerified = true;
      }
      await seller.save();
    }

    // Dispatch OTP through centralized SMS India Hub Service
    const smsResult = await sendOtpSMS({
      phone: cleanPhone,
      otp,
      appName: 'ShippNex',
      role: 'seller',
    });

    if (!smsResult.success) {
      return res.status(502).json({
        success: false,
        message: smsResult.message || 'Unable to deliver SMS OTP. Please verify phone number and try again.',
        phone: cleanPhone,
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      });
    }

    res.status(200).json({
      success: true,
      message: smsResult.message || 'OTP sent successfully to your mobile number',
      phone: cleanPhone,
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

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();

    let seller = await Seller.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91${cleanPhone}` },
        { phone: `+91 ${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
        { phone: String(phone).trim() },
      ]
    });

    if (!seller) {
      if (cleanPhone === '9302841832') {
        seller = await Seller.create({
          phone: cleanPhone,
          status: 'approved',
          isVerified: true,
          businessName: 'Official Seller Store',
        });
      } else {
        return res.status(404).json({ success: false, message: 'Seller record not found' });
      }
    }

    // Allow test OTP '123456' or exact matching OTP
    const isTestOtp = cleanOtp === '123456';
    const isMatchingOtp = seller.otp && String(seller.otp).trim() === cleanOtp;

    if (!isTestOtp && !isMatchingOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (!isTestOtp && seller.otpExpiry && new Date() > new Date(seller.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Clear OTP after successful verification
    seller.otp = undefined;
    seller.otpExpiry = undefined;
    seller.isVerified = true;
    if (seller.phone !== cleanPhone) {
      seller.phone = cleanPhone;
    }
    
    // Auto-approve seller 9302841832
    if (phone === '9302841832' || cleanPhone === '9302841832') {
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

    // Membership gate: check if seller has an active membership
    const now = new Date();
    const activeMembership = await SellerMembership.findOne({
      sellerId: seller._id,
      membershipStatus: 'active',
      expiryDate: { $gt: now },
    });

    // Auto-expire stale memberships
    await SellerMembership.updateMany(
      { sellerId: seller._id, membershipStatus: 'active', expiryDate: { $lte: now } },
      { $set: { membershipStatus: 'expired' } }
    );

    if (!activeMembership) {
      // Determine the pending membership status (if any)
      const pendingMembership = await SellerMembership.findOne({
        sellerId: seller._id,
        membershipStatus: 'pending_payment',
      });
      const membershipStatus = pendingMembership ? 'pending_payment' : 'none';

      return res.status(200).json({
        success: true,
        requiresMembership: true,
        membershipStatus,
        message: 'Membership purchase required to activate your seller account.',
        token,
        seller,
      });
    }

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
      fssaiLicense,
      gstPhoto,
      bankPassbookPhoto,
      categories,
      planId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
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

    let processedGstPhoto = '';
    if (gstPhoto && typeof gstPhoto === 'string' && gstPhoto.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(gstPhoto, 'sellers/documents');
        processedGstPhoto = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for GST photo:', err.message);
        processedGstPhoto = gstPhoto;
      }
    } else {
      processedGstPhoto = gstPhoto || '';
    }

    let processedPassbookPhoto = '';
    if (bankPassbookPhoto && typeof bankPassbookPhoto === 'string' && bankPassbookPhoto.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(bankPassbookPhoto, 'sellers/documents');
        processedPassbookPhoto = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for passbook photo:', err.message);
        processedPassbookPhoto = bankPassbookPhoto;
      }
    } else {
      processedPassbookPhoto = bankPassbookPhoto || '';
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
      gstPhoto: processedGstPhoto,
      bankPassbookPhoto: processedPassbookPhoto,
      categories: Array.isArray(categories) && categories.length > 0 ? categories : [],
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

    // Process Membership if provided
    if (planId) {
      const plan = await SellerMembershipPlan.findById(planId);
      if (plan && plan.status === 'active') {
        if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
          // Verify Razorpay Signature
          const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

          if (generatedSignature === razorpaySignature) {
            const startDate = new Date();
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

            await SellerMembership.create({
              sellerId: seller._id,
              planId: plan._id,
              planName: plan.name,
              durationType: plan.durationType,
              durationMonths: plan.durationMonths,
              priceAtPurchase: plan.price,
              membershipStatus: 'active',
              paymentStatus: 'paid',
              paymentReference: razorpayPaymentId,
              paymentMethod: 'razorpay',
              transactionId: razorpayOrderId,
              startDate,
              expiryDate
            });
            await Seller.findByIdAndUpdate(seller._id, { membershipStatus: 'active' });
          }
        } else if (req.body.paymentMethod === 'cod' || req.body.paymentMethod === 'manual') {
          // Create pending membership for COD/Manual
          await SellerMembership.create({
            sellerId: seller._id,
            planId: plan._id,
            planName: plan.name,
            durationType: plan.durationType,
            durationMonths: plan.durationMonths,
            priceAtPurchase: plan.price,
            membershipStatus: 'pending_payment',
            paymentStatus: 'pending',
            paymentReference: 'COD',
            paymentMethod: req.body.paymentMethod || 'cod',
            transactionId: `COD-${Date.now()}`
          });
          await Seller.findByIdAndUpdate(seller._id, { membershipStatus: 'pending_payment' });
        }
      }
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

    const membership = await SellerMembership.findOne({
      sellerId: seller._id,
      membershipStatus: { $in: ['active', 'pending_payment'] },
    }).populate('planId').sort({ createdAt: -1 });

    const sellerObj = seller.toObject();
    sellerObj.membership = membership || null;

    res.status(200).json({
      success: true,
      seller: sellerObj,
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
      gstPhoto,
      bankPassbookPhoto,
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

    if (gstPhoto && typeof gstPhoto === 'string' && gstPhoto.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(gstPhoto, 'sellers/documents');
        seller.gstPhoto = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for GST photo:', err.message);
        seller.gstPhoto = gstPhoto;
      }
    } else if (gstPhoto !== undefined) {
      seller.gstPhoto = gstPhoto;
    }

    if (bankPassbookPhoto && typeof bankPassbookPhoto === 'string' && bankPassbookPhoto.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(bankPassbookPhoto, 'sellers/documents');
        seller.bankPassbookPhoto = uploadRes.secure_url;
      } catch (err) {
        console.warn('Cloudinary upload failed for passbook photo:', err.message);
        seller.bankPassbookPhoto = bankPassbookPhoto;
      }
    } else if (bankPassbookPhoto !== undefined) {
      seller.bankPassbookPhoto = bankPassbookPhoto;
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

    const {
      lat,
      lng,
      area,
      latitude,
      longitude,
    } = req.body;

    const finalLat = lat !== undefined ? lat : latitude;
    const finalLng = lng !== undefined ? lng : longitude;

    if (
      storeAddress !== undefined ||
      city !== undefined ||
      state !== undefined ||
      pincode !== undefined ||
      area !== undefined ||
      finalLat !== undefined ||
      finalLng !== undefined
    ) {
      const currentCoords = seller.warehouseLocation?.location?.coordinates || [0, 0];
      const newCoords = (finalLat != null && finalLng != null)
        ? [parseFloat(finalLng), parseFloat(finalLat)]
        : currentCoords;

      seller.warehouseLocation = {
        ...seller.warehouseLocation,
        storeAddress: storeAddress !== undefined ? storeAddress : seller.warehouseLocation?.storeAddress,
        city: city !== undefined ? city : seller.warehouseLocation?.city,
        state: state !== undefined ? state : seller.warehouseLocation?.state,
        pincode: pincode !== undefined ? pincode : seller.warehouseLocation?.pincode,
        area: area !== undefined ? area : seller.warehouseLocation?.area,
        location: {
          type: 'Point',
          coordinates: newCoords,
        },
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

