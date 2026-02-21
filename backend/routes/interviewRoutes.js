const express = require('express');
const router = express.Router();
const { getFeedbacks, addFeedback, updateFeedback, deleteFeedback } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFeedbacks).post(protect, addFeedback);
router.route('/:id').put(protect, updateFeedback).delete(protect, deleteFeedback);

module.exports = router;
