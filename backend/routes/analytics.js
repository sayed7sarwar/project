const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Grievance = require('../models/Grievance');
const Survey = require('../models/Survey');

router.get('/overview', async (req, res) => {
  try {
    const totalSurveys = await Survey.countDocuments({ status: 'active' });
    const totalResponses = await Response.countDocuments();
    const totalGrievances = await Grievance.countDocuments();
    const resolvedGrievances = await Grievance.countDocuments({ status: 'resolved' });

    res.json({
      success: true,
      data: {
        totalSurveys,
        totalResponses,
        totalGrievances,
        resolvedGrievances,
        resolutionRate: totalGrievances > 0 ? (resolvedGrievances / totalGrievances * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
