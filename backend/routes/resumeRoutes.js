const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/analyze', protect, upload.single('resume'), analyzeResume);

module.exports = router;
