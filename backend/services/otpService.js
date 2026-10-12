const twilio = require('twilio');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.sendOTP = async (recipient, otp, method = 'sms') => {
  try {
    if (method === 'sms') {
      await twilioClient.messages.create({
        body: `Your CJP verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient
      });
    } else if (method === 'email') {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'CJP - Verification Code',
        html: `
          <h2>Your Verification Code</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>Do not share this code with anyone.</p>
        `
      });
    }
    return true;
  } catch (error) {
    console.error('OTP send error:', error);
    throw error;
  }
};
