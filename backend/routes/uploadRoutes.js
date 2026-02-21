const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const AISession = require('../models/AISession');


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});


function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /webm|mp4|ogg|x-matroska|octet-stream/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Allow any video mime type OR specific ones encountered
    const mimetype = file.mimetype.startsWith('video/') || filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        const fs = require('fs');
        const path = require('path');
        const logData = `[${new Date().toISOString()}] REJECTED: File: ${file.originalname}, Mime: ${file.mimetype}\n`;
        fs.appendFile(path.join(__dirname, '../upload_debug.log'), logData, () => { });
        cb('Error: Videos Only! (Got ' + file.mimetype + ')');
    }
}


const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, (req, res, next) => {
    console.log(`[Upload] POST request received. Headers: ${JSON.stringify(req.headers['content-type'])}`);
    upload.single('video')(req, res, (err) => {
        const fs = require('fs');
        const path = require('path');
        if (err) {
            const errorMessage = err.message || err; // Handle string errors
            const logData = `[${new Date().toISOString()}] Multer Error: ${errorMessage}\n`;
            fs.appendFile(path.join(__dirname, '../upload_debug.log'), logData, () => { });
            console.error("Multer Error:", err);
            return res.status(400).send({ message: "Upload failed", error: errorMessage });
        }
        next();
    });
}, async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    try {
        console.log("Upload request received in handler");

        if (!req.file) {
            const logData = `[${new Date().toISOString()}] Error: No file uploaded (req.file is undefined). Body keys: ${Object.keys(req.body)}\n`;
            fs.appendFile(path.join(__dirname, '../upload_debug.log'), logData, () => { });
            console.error("No file uploaded");
            return res.status(400).send('No file uploaded.');
        }

        const videoUrl = `/uploads/${req.file.filename}`;
        console.log("File saved to:", videoUrl);


        if (req.body.sessionId) {
            console.log("Updating session:", req.body.sessionId);
            const session = await AISession.findById(req.body.sessionId);
            if (session) {
                session.videoUrl = videoUrl;
                await session.save();
                console.log("Session updated with video URL");
            } else {
                console.warn("Session not found for ID:", req.body.sessionId);
            }
        } else {
            console.warn("No sessionId provided in upload request");
        }

        res.send({
            videoUrl,
            message: 'File uploaded successfully',
        });
    } catch (error) {
        console.error("Server Error in Upload:", error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
