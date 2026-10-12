const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTP, generateOTP } = require('../services/otpService');
const { generateAnonymousId } = require('../utils/encryption');
const logger = require('../utils/logger');

// Request OTP
exports.requestOTP = async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;
    
    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email required'
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE));

    let user = await User.findOne({ 
      $or: [{ phoneNumber }, { email }] 
    });

    if (!user) {
      user = new User({
        phoneNumber,
        email,
        anonymousId: generateAnonymousId(),
        ipAddress: req.ip
      });
    }

    user.otpHash = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(phoneNumber || email, otp, phoneNumber ? 'sms' : 'email');

    logger.info(`OTP sent to ${phoneNumber || email}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: process.env.OTP_EXPIRE
    });

  } catch (error) {
    logger.error('OTP request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, email, otp } = req.body;

    const user = await User.findOne({
      $or: [{ phoneNumber }, { email }],
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    const isValidOTP = await user.compareOTP(otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    user.isVerified = true;
    user.lastLogin = new Date();
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        anonymousId: user.anonymousId,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    logger.info(`User ${user.anonymousId} logged in successfully`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        anonymousId: user.anonymousId,
        role: user.role,
        state: user.state,
        district: user.district
      }
    });

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { state, district, pincode } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.state = state;
    user.district = district;
    user.pincode = pincode;
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        anonymousId: user.anonymousId,
        state: user.state,
        district: user.district
      }
    });

  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
};
