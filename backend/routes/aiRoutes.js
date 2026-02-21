const express = require('express');
const router = express.Router();
const {
    startSession,
    submitAnswer,
    getHistory,
    deleteSession,
    updateSession,
    getCompanyProblem,
    evaluateUserCode,
    simulateUserCode
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startSession);
router.post('/answer', protect, submitAnswer);
router.get('/history', protect, getHistory);
router.delete('/session/:id', protect, deleteSession);
router.put('/session/:id', protect, updateSession);
router.post('/company-problem', protect, getCompanyProblem);
router.post('/evaluate-code', protect, evaluateUserCode);
router.post('/simulate-code', protect, simulateUserCode);

module.exports = router;
