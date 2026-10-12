const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anonymousId: {
    type: String,
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    metadata: {
      timeSpent: Number,
      changed: Boolean
    }
  }],
  location: {
    state: String,
    district: String,
    pincode: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    }
  },
  deviceInfo: {
    userAgent: String,
    platform: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate responses
responseSchema.index({ surveyId: 1, userId: 1 }, { unique: true });
responseSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Response', responseSchema);
