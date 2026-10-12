const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  requestOTP,
  verifyOTP,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
  '/request-otp',
  [
    body('phoneNumber')
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Invalid Indian phone number'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email')
  ],
  requestOTP
);

router.post(
  '/verify-otp',
  [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  verifyOTP
);

router.put(
  '/profile',
  protect,
  [
    body('state').notEmpty(),
    body('district').notEmpty(),
    body('pincode').matches(/^\d{6}$/)
  ],
  updateProfile
);

module.exports = router;
