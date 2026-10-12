const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['national', 'state', 'district', 'local'],
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'rating', 'text', 'priority-ranking'],
      required: true
    },
    options: [String],
    required: {
      type: Boolean,
      default: true
    }
  }],
  targetAudience: {
    states: [String],
    districts: [String],
    ageGroups: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'draft'
  },
  startDate: Date,
  endDate: Date,
  totalResponses: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for performance
surveySchema.index({ status: 1, category: 1, startDate: -1 });

module.exports = mongoose.model('Survey', surveySchema);
