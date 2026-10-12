const express = require('express');
const router = express.Router();
const {
  getActiveSurveys,
  submitResponse,
  getDashboardData
} = require('../controllers/surveyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/active', protect, getActiveSurveys);
router.post('/respond', protect, submitResponse);
router.get('/dashboard/:surveyId', getDashboardData);

module.exports = router;
