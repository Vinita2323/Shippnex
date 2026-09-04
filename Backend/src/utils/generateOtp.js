import crypto from 'crypto';

/**
 * Generates cryptographically secure 6-digit numeric OTP with 10-minute expiry
 * @returns {{ otp: string, otpExpiry: Date }}
 */
export const generateOtp = () => {
  // Generate cryptographically secure 6-digit numeric string (100000 - 999999)
  const otp = crypto.randomInt(100000, 1000000).toString();
  // Valid for 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return { otp, otpExpiry };
};

export default generateOtp;
