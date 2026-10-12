const Survey = require('../models/Survey');
const Response = require('../models/Response');
const logger = require('../utils/logger');

exports.getActiveSurveys = async (req, res) => {
  try {
    const { category, state, district } = req.query;
    
    const filter = {
      status: 'active',
      startDate: { $lte: new Date() },
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    };

    if (category) filter.category = category;
    if (state) filter['targetAudience.states'] = state;
    if (district) filter['targetAudience.districts'] = district;

    const surveys = await Survey.find(filter)
      .select('-__v')
      .sort({ startDate: -1 })
      .lean();

    const userId = req.user.id;
    const surveyIds = surveys.map(s => s._id);
    const userResponses = await Response.find({
      userId,
      surveyId: { $in: surveyIds }
    }).select('surveyId');

    const respondedSurveyIds = new Set(
      userResponses.map(r => r.surveyId.toString())
    );

    const surveysWithStatus = surveys.map(survey => ({
      ...survey,
      hasResponded: respondedSurveyIds.has(survey._id.toString())
    }));

    res.json({
      success: true,
      count: surveysWithStatus.length,
      surveys: surveysWithStatus
    });

  } catch (error) {
    logger.error('Get surveys error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surveys'
    });
  }
};

exports.submitResponse = async (req, res) => {
  try {
    const { surveyId, answers, location } = req.body;

    const survey = await Survey.findOne({
      _id: surveyId,
      status: 'active'
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found or inactive'
      });
    }

    const existingResponse = await Response.findOne({
      surveyId,
      userId: req.user.id
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this survey'
      });
    }

    const response = new Response({
      surveyId,
      userId: req.user.id,
      anonymousId: req.user.anonymousId,
      answers,
      location,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform']
      }
    });

    await response.save();

    survey.totalResponses += 1;
    await survey.save();

    const io = req.app.get('io');
    io.to('dashboard').emit('response-update', {
      surveyId,
      totalResponses: survey.totalResponses,
      timestamp: new Date()
    });

    logger.info(`Response submitted for survey ${surveyId} by user ${req.user.anonymousId}`);

    res.json({
      success: true,
      message: 'Response submitted successfully',
      totalResponses: survey.totalResponses
    });

  } catch (error) {
    logger.error('Submit response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response'
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    const responses = await Response.aggregate([
      { $match: { surveyId: survey._id } },
      { $unwind: '$answers' },
      {
        $group: {
          _id: {
            questionId: '$answers.questionId',
            answer: '$answers.answer'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.questionId',
          options: {
            $push: {
              answer: '$_id.answer',
              count: '$count'
            }
          },
          totalResponses: { $sum: '$count' }
        }
      }
    ]);

    const stateWise = await Response.aggregate([
      { $match: { surveyId: survey._id } },
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      survey: {
        title: survey.title,
        totalResponses: survey.totalResponses,
        startDate: survey.startDate
      },
      questionBreakdown: responses,
      stateWiseBreakdown: stateWise
    });

  } catch (error) {
    logger.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};
