const Grievance = require('../models/Grievance');
const logger = require('../utils/logger');

exports.submitGrievance = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      location, 
      evidence 
    } = req.body;

    const grievance = new Grievance({
      title,
      description,
      category,
      location,
      evidence,
      submittedBy: req.user.id,
      anonymousId: req.user.anonymousId
    });

    await grievance.save();

    const io = req.app.get('io');
    io.to('dashboard').emit('new-grievance', {
      id: grievance._id,
      category: grievance.category,
      location: grievance.location,
      timestamp: grievance.createdAt
    });

    logger.info(`Grievance ${grievance._id} submitted by ${req.user.anonymousId}`);

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      grievanceId: grievance._id
    });

  } catch (error) {
    logger.error('Submit grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit grievance'
    });
  }
};

exports.getGrievances = async (req, res) => {
  try {
    const { 
      category, 
      state, 
      district, 
      status, 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (state) filter['location.state'] = state;
    if (district) filter['location.district'] = district;
    if (status) filter.status = status;

    const grievances = await Grievance.find(filter)
      .select('-submittedBy -evidence.url')
      .sort({ createdAt: -1, upvotes: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Grievance.countDocuments(filter);

    res.json({
      success: true,
      grievances,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    logger.error('Get grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grievances'
    });
  }
};

exports.upvoteGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const grievance = await Grievance.findById(id);
    
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    if (grievance.upvotedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already upvoted'
      });
    }

    grievance.upvotes += 1;
    grievance.upvotedBy.push(userId);
    await grievance.save();

    res.json({
      success: true,
      upvotes: grievance.upvotes
    });

  } catch (error) {
    logger.error('Upvote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upvote'
    });
  }
};
