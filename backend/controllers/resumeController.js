const asyncHandler = require('express-async-handler');




const pdfParse = require('pdf-parse');

const analyzeResume = asyncHandler(async (req, res) => {
    let { resumeText, jobDescription } = req.body;

    
    if (req.file) {
        try {
            console.log('Processing file:', req.file.originalname, 'Size:', req.file.size, 'Mime:', req.file.mimetype);
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text + (resumeText ? `\n${resumeText}` : '');
        } catch (error) {
            console.error('PDF parsing error:', error);
            res.status(400);
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    }

    if (!resumeText || !jobDescription) {
        res.status(400);
        throw new Error('Please provide resume text/file and job description');
    }

    
    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const matchedKeywords = jdKeywords.filter(keyword =>
        resumeKeywords.includes(keyword)
    );

    const missingKeywords = jdKeywords.filter(keyword =>
        !resumeKeywords.includes(keyword)
    );

    const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100) || 0;

    res.status(200).json({
        score,
        matchedKeywords,
        missingKeywords,
        totalKeywords: jdKeywords.length
    });
});


const extractKeywords = (text) => {
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'excited', 'about', 'looking', 'forward'];

    
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word));

    
    return [...new Set(words)];
};

module.exports = {
    analyzeResume
};
