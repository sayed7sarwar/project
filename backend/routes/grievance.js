const express = require('express');
const router = express.Router();
const {
  submitGrievance,
  getGrievances,
  upvoteGrievance
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitGrievance);
router.get('/', getGrievances);
router.post('/:id/upvote', protect, upvoteGrievance);

module.exports = router;
