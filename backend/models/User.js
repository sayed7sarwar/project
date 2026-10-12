const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true
  },
  otpHash: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  anonymousId: {
    type: String,
    unique: true,
    required: true
  },
  state: String,
  district: String,
  pincode: String,
  role: {
    type: String,
    enum: ['citizen', 'validator', 'admin'],
    default: 'citizen'
  },
  votedSurveys: [{
    surveyId: mongoose.Schema.Types.ObjectId,
    votedAt: Date
  }],
  submittedGrievances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grievance'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  ipAddress: String,
  deviceFingerprint: String
}, {
  timestamps: true
});

// Hash OTP before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('otpHash')) {
    this.otpHash = await bcrypt.hash(this.otpHash, 10);
  }
  next();
});

// Compare OTP
userSchema.methods.compareOTP = async function(otp) {
  return await bcrypt.compare(otp, this.otpHash);
};

module.exports = mongoose.model('User', userSchema);
