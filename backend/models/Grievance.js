const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['infrastructure', 'health', 'education', 'employment', 'law-order', 'environment', 'corruption', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    block: String,
    village: String,
    pincode: String,
    address: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    url: String,
    uploadedAt: Date,
    verified: Boolean
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anonymousId: String,
  status: {
    type: String,
    enum: ['submitted', 'under-validation', 'validated', 'assigned', 'in-progress', 'resolved', 'rejected'],
    default: 'submitted'
  },
  validationQueue: [{
    validatorId: mongoose.Schema.Types.ObjectId,
    validatedAt: Date,
    verdict: String,
    comments: String
  }],
  assignedTo: {
    department: String,
    officialId: mongoose.Schema.Types.ObjectId,
    assignedAt: Date
  },
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: mongoose.Schema.Types.ObjectId,
    evidence: [String]
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [mongoose.Schema.Types.ObjectId],
  viewCount: {
    type: Number,
    default: 0
  },
  escalationLevel: {
    type: Number,
    default: 0
  },
  autoEscalatedAt: Date,
  tags: [String]
}, {
  timestamps: true
});

// Indexes
grievanceSchema.index({ 'location.coordinates': '2dsphere' });
grievanceSchema.index({ status: 1, createdAt: -1 });
grievanceSchema.index({ category: 1, 'location.state': 1 });

// Auto-escalation logic
grievanceSchema.methods.checkEscalation = function() {
  const daysSinceSubmission = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  
  if (this.status === 'submitted' && daysSinceSubmission > 7) {
    this.escalationLevel = 1;
    this.autoEscalatedAt = new Date();
  } else if (this.status === 'in-progress' && daysSinceSubmission > 30) {
    this.escalationLevel = 2;
  } else if (daysSinceSubmission > 60 && this.status !== 'resolved') {
    this.escalationLevel = 3;
  }
  
  return this.escalationLevel;
};

module.exports = mongoose.model('Grievance', grievanceSchema);
