const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestionById,
    setQuestion,
    updateQuestion,
    deleteQuestion,
    getStats
} = require('../controllers/dsaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getQuestions).post(protect, setQuestion);
router.route('/stats').get(protect, getStats);
router.route('/:id').get(protect, getQuestionById).put(protect, updateQuestion).delete(protect, deleteQuestion);

module.exports = router;
