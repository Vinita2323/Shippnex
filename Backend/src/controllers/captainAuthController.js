import Captain from '../models/Captain.model.js';
import { generateOtp } from '../utils/generateOtp.js';
import { generateToken } from '../utils/generateToken.js';

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
    } = req.body;

    const phone = mobileNumber || req.body.phone;

    if (!phone || !fullName) {
      return res.status(400).json({ success: false, message: 'Full Name and Mobile Number are required.' });
    }

    let captain = await Captain.findOne({ phone });

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
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const { otp, otpExpiry } = generateOtp();

    let captain = await Captain.findOne({ phone });

    if (!captain) {
      captain = await Captain.create({ phone, otp, otpExpiry, status: 'pending' });
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

// Verify OTP & Status Approval Check
export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const captain = await Captain.findOne({ phone });

    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain account not found. Please register first.' });
    }

    // Allow hardcoded OTP '123456' for testing
    if (captain.otp !== otp && otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    if (captain.otpExpiry && new Date() > new Date(captain.otpExpiry)) {
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
