import Captain from '../models/Captain.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';
import CaptainMembership from '../models/CaptainMembership.model.js';
import { sendOtpSMS, normalizePhoneNumber } from '../services/smsIndiaHubService.js';

// Register Captain (Submit Registration Form)
export const registerCaptain = async (req, res, next) => {
  try {
    const {
      fullName,
      mobileNumber,
      alternateMobile,
      email,
      dob,
      age,
      fatherName,
      currentAddress,
      permanentAddress,
      city,
      state,
      pinCode,
      emergencyContact,
      aadhaarNumber,
      vehicleType,
      drivingLicenseNumber,
      rcNumber,
      vehicleInsuranceNumber,
      insuranceValidTill,
      pucNumber,
      pucValidTill,
      permitNumber,
      permitValidTill,
      fitnessCertNumber,
      fitnessValidTill,
      roadTaxNumber,
      roadTaxValidTill,
      gpsEnabled,
      gpsDeviceId,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      branchName,
      upiId,
      panCardNumber,
    } = req.body;

    const rawPhone = mobileNumber || req.body.phone;

    if (!rawPhone || !fullName) {
      return res.status(400).json({ success: false, message: 'Full Name and Mobile Number are required.' });
    }

    const phone = normalizePhoneNumber(rawPhone) || rawPhone;

    let captain = await Captain.findOne({
      $or: [
        { phone },
        { phone: `+91${phone}` },
        { phone: `+91 ${phone}` },
        { phone: new RegExp(phone + '$') },
        { phone: String(rawPhone).trim() },
      ]
    });

    if (captain) {
      // If already registered and approved
      if (captain.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'Account with this mobile number is already registered and approved. Please log in directly.',
        });
      }

      // If pending, update existing registration info
      captain.name = fullName;
      captain.email = email || captain.email;
      captain.alternateMobile = alternateMobile;
      captain.dob = dob;
      captain.age = age;
      captain.fatherName = fatherName;
      captain.currentAddress = currentAddress;
      captain.permanentAddress = permanentAddress;
      captain.city = city;
      captain.state = state;
      captain.pinCode = pinCode;
      captain.emergencyContact = emergencyContact;
      captain.aadhaarNumber = aadhaarNumber;
      if (panCardNumber) captain.panCardNumber = panCardNumber.toUpperCase();
      if (vehicleType) captain.vehicleType = vehicleType;
      captain.drivingLicenseNumber = drivingLicenseNumber;
      captain.rcNumber = rcNumber;
      captain.vehicleInsuranceNumber = vehicleInsuranceNumber;
      captain.insuranceValidTill = insuranceValidTill;
      captain.pucNumber = pucNumber;
      captain.pucValidTill = pucValidTill;
      captain.permitNumber = permitNumber;
      captain.permitValidTill = permitValidTill;
      captain.fitnessCertNumber = fitnessCertNumber;
      captain.fitnessValidTill = fitnessValidTill;
      captain.roadTaxNumber = roadTaxNumber;
      captain.roadTaxValidTill = roadTaxValidTill;
      if (gpsEnabled !== undefined) captain.gpsEnabled = gpsEnabled;
      captain.gpsDeviceId = gpsDeviceId;
      if (req.body.documents) {
        captain.documents = { ...(captain.documents || {}), ...req.body.documents };
      }
      captain.bankDetails = {
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        branchName,
        upiId,
        panCardNumber: panCardNumber ? panCardNumber.toUpperCase() : captain.bankDetails?.panCardNumber,
      };
      captain.status = 'pending'; // Re-submit for review
      await captain.save();
    } else {
      captain = await Captain.create({
        name: fullName,
        phone,
        email,
        alternateMobile,
        dob,
        age,
        fatherName,
        currentAddress,
        permanentAddress,
        city,
        state,
        pinCode,
        emergencyContact,
        aadhaarNumber,
        panCardNumber: panCardNumber ? panCardNumber.toUpperCase() : '',
        vehicleType: vehicleType || 'Motorcycle',
        drivingLicenseNumber,
        rcNumber,
        vehicleInsuranceNumber,
        insuranceValidTill,
        pucNumber,
        pucValidTill,
        permitNumber,
        permitValidTill,
        fitnessCertNumber,
        fitnessValidTill,
        roadTaxNumber,
        roadTaxValidTill,
        gpsEnabled: gpsEnabled !== undefined ? gpsEnabled : true,
        gpsDeviceId,
        documents: req.body.documents || {},
        bankDetails: {
          bankName,
          accountHolderName,
          accountNumber,
          ifscCode,
          branchName,
          upiId,
          panCardNumber: panCardNumber ? panCardNumber.toUpperCase() : '',
        },
        status: 'pending',
      });
    }

    console.log(`[CAPTAIN REGISTER] Registered Captain "${fullName}" (${phone}) - Status: PENDING Admin Approval`);

    res.status(201).json({
      success: true,
      message: 'Captain application submitted successfully! Your account is currently pending Admin approval.',
      captain: {
        id: captain._id,
        name: captain.name,
        phone: captain.phone,
        status: captain.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

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

    let captain = await Captain.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91${cleanPhone}` },
        { phone: `+91 ${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
        { phone: String(rawPhone).trim() },
      ]
    });

    if (!captain) {
      captain = await Captain.create({ phone: cleanPhone, otp, otpExpiry, status: 'pending' });
    } else {
      captain.otp = otp;
      captain.otpExpiry = otpExpiry;
      if (captain.phone !== cleanPhone) {
        captain.phone = cleanPhone;
      }
      await captain.save();
    }

    // Dispatch OTP through centralized SMS India Hub Service
    const smsResult = await sendOtpSMS({
      phone: cleanPhone,
      otp,
      appName: 'ShippNex',
      role: 'captain',
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

// Verify OTP & Status Approval Check
export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const cleanPhone = normalizePhoneNumber(phone);
    const cleanOtp = String(otp).trim();

    const captain = await Captain.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91${cleanPhone}` },
        { phone: `+91 ${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
        { phone: String(phone).trim() },
      ]
    });

    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain account not found. Please register first.' });
    }

    // Allow test OTP '123456' or matching OTP
    const isTestOtp = cleanOtp === '123456';
    const isMatchingOtp = captain.otp && String(captain.otp).trim() === cleanOtp;

    if (!isTestOtp && !isMatchingOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (!isTestOtp && captain.otpExpiry && new Date() > new Date(captain.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Status Gate Check: Only approved captains can log in!
    if (captain.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your application is currently PENDING Admin approval. Please wait for Admin to approve your account before logging in.',
        status: 'pending',
      });
    }

    if (captain.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your application has been REJECTED by Admin. Please contact support.',
        status: 'rejected',
      });
    }

    // Clear OTP after successful verification
    captain.otp = undefined;
    captain.otpExpiry = undefined;
    captain.isVerified = true;
    await captain.save();

    const token = generateToken({ id: captain._id, phone: captain.phone, role: captain.role });

    // Membership gate: check if captain has an active membership
    const now = new Date();
    const activeMembership = await CaptainMembership.findOne({
      captainId: captain._id,
      membershipStatus: 'active',
      expiryDate: { $gt: now },
    });

    // Auto-expire stale memberships
    await CaptainMembership.updateMany(
      { captainId: captain._id, membershipStatus: 'active', expiryDate: { $lte: now } },
      { $set: { membershipStatus: 'expired' } }
    );

    if (!activeMembership) {
      const pendingMembership = await CaptainMembership.findOne({
        captainId: captain._id,
        membershipStatus: 'pending_payment',
      });
      const membershipStatus = pendingMembership ? 'pending_payment' : 'none';

      return res.status(200).json({
        success: true,
        requiresMembership: true,
        membershipStatus,
        message: 'Membership purchase required to activate your captain account.',
        token,
        captain: {
          id: captain._id,
          name: captain.name,
          phone: captain.phone,
          role: captain.role,
          status: captain.status,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Captain verified successfully',
      token,
      captain: {
        id: captain._id,
        name: captain.name,
        phone: captain.phone,
        role: captain.role,
        status: captain.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
