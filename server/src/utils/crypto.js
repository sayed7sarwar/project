import crypto from 'node:crypto';

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
}
