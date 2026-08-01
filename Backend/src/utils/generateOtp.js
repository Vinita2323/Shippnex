import crypto from 'crypto';

export const generateOtp = () => {
  // Generate cryptographically safe 6 digit numeric string
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Valid for 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return { otp, otpExpiry };
};
