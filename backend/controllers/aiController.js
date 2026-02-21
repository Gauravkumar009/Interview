const asyncHandler = require('express-async-handler');
const QUESTION_BANK = require('../utils/aiQuestionBank');
const AISession = require('../models/AISession');



let activeSessions = {};


const getUnaskedQuestion = async (userId, type, ignoreList = [], domain = "") => {

    // Try to find questions by domain first, then type, then default to Technical
    let allQuestions = [];

    // Case-insensitive lookup for domain in QUESTION_BANK
    const normalizedDomain = domain ? domain.toLowerCase().trim() : "";

    // Manual mapping for common aliases to match QUESTION_BANK keys
    let lookupKey = normalizedDomain;
    if (normalizedDomain.includes("full stack") || normalizedDomain.includes("fullstack") || normalizedDomain.includes("mern") || normalizedDomain.includes("mean")) {
        lookupKey = "full stack developer";
    } else if (normalizedDomain.includes("frontend") || normalizedDomain.includes("front end") || normalizedDomain.includes("front-end")) {
        lookupKey = "frontend developer";
    } else if (normalizedDomain.includes("backend") || normalizedDomain.includes("back end") || normalizedDomain.includes("back-end")) {
        lookupKey = "backend developer";
    }

    const bankKey = Object.keys(QUESTION_BANK).find(k => k.toLowerCase() === lookupKey);

    if (bankKey) {
        allQuestions = QUESTION_BANK[bankKey];
    } else {
        // Dynamic Fallback for unknown domains
        if (domain && domain.toLowerCase() !== 'general') {
            allQuestions = [
                { question: `Could you explain a detailed concept in ${domain} that you have experience with?`, idealAnswer: `Expect a valid explanation related to ${domain}.`, keywords: ["concept", "experience"] },
                { question: `What are the most common challenges developers face when working with ${domain}?`, idealAnswer: "Discussion of pitfalls", keywords: ["challenges", "pitfalls"] },
                { question: `Describe a recent project where you utilized ${domain}.`, idealAnswer: "Project description", keywords: ["project", "utilization"] },
                { question: `How do you stay updated with the latest trends in ${domain}?`, idealAnswer: "Blogs, conferences, etc.", keywords: ["trends", "learning"] },
                { question: `What are the key security considerations in ${domain}?`, idealAnswer: "Security best practices", keywords: ["security", "risk"] },
                { question: `Explain the lifecycle or workflow typically used in ${domain}.`, idealAnswer: "Workflow description", keywords: ["workflow", "lifecycle"] },
                { question: `What tools and libraries are essential for ${domain}?`, idealAnswer: "Tooling ecosystem", keywords: ["tools", "libraries"] },
                { question: `How would you explain ${domain} to a non-technical stakeholder?`, idealAnswer: "Simplified explanation", keywords: ["explanation", "stakeholder"] },
                { question: `What is a common misconception about ${domain}?`, idealAnswer: "Misconception correction", keywords: ["misconception", "truth"] },
                { question: `Describe a difficult bug or issue you solved in ${domain}.`, idealAnswer: "Problem solving", keywords: ["bug", "issue", "solution"] },
                { question: `How does ${domain} integrate with other parts of a tech stack?`, idealAnswer: "Integration details", keywords: ["integration", "stack"] },
                { question: `What are the performance bottlenecks often found in ${domain}?`, idealAnswer: "Performance analysis", keywords: ["performance", "optimization"] },
                { question: `Discuss the difference between junior and senior ${domain} roles.`, idealAnswer: "Role expectation", keywords: ["career", "growth"] },
                { question: `What is the future of ${domain} in your opinion?`, idealAnswer: "Future speculation", keywords: ["future", "trends"] },
                { question: `Compare ${domain} with a similar or competing technology.`, idealAnswer: "Comparison", keywords: ["comparison", "alternatives"] }
            ];
            console.log(`Domain '${domain}' not found in static bank. Using expanded dynamic fallback (${allQuestions.length} questions).`);
        } else {
            allQuestions = QUESTION_BANK[type] || QUESTION_BANK['Technical'];
        }
    }


    const pastSessions = await AISession.find({ user: userId });


    const askedQuestions = new Set(ignoreList.map(q => q.toLowerCase().trim()));
    pastSessions.forEach(session => {
        if (session.questions) {
            session.questions.forEach(q => {
                askedQuestions.add(q.question.toLowerCase().trim());
            });
        }
    });


    const unaskedQuestions = allQuestions.filter(q => !askedQuestions.has(q.question.toLowerCase().trim()));


    if (unaskedQuestions.length > 0) {
        const picked = unaskedQuestions[Math.floor(Math.random() * unaskedQuestions.length)];
        return picked;
    }



    if (ignoreList.length > 0 && allQuestions.length > 1) {
        const lastAsked = ignoreList[ignoreList.length - 1].toLowerCase().trim();
        const fallbackPool = allQuestions.filter(q => q.question.toLowerCase().trim() !== lastAsked);
        return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
    }

    return allQuestions[Math.floor(Math.random() * allQuestions.length)];
};




const startSession = asyncHandler(async (req, res) => {
    const { type, mode, domain } = req.body;


    const randomQ = await getDynamicQuestion(req.user.id, type, [], domain);


    const newSession = await AISession.create({
        user: req.user.id,
        interviewType: type,
        mode: mode || 'text',
        domain: req.body.domain || 'General',
        questions: [],
        overallRating: 0
    });


    activeSessions[newSession._id] = {
        type,
        mode,
        domain: req.body.domain || 'General',
        currentQuestion: randomQ,
        dbId: newSession._id
    };

    res.status(200).json({
        sessionId: newSession._id,
        message: `Hello! I am your AI Interviewer. Let's start with a ${type} question.`,
        question: randomQ.question
    });
});




const submitAnswer = asyncHandler(async (req, res) => {
    const { sessionId, answer } = req.body;

    const sessionData = activeSessions[sessionId];
    if (!sessionData) {


        res.status(404);
        throw new Error('Session not found or expired');
    }

    const currentQ = sessionData.currentQuestion;


    const keywords = currentQ.keywords || [];
    const lowerAnswer = answer.toLowerCase();
    const missingKeywords = keywords.filter(k => !lowerAnswer.includes(k.toLowerCase()));
    const matchedCount = keywords.length - missingKeywords.length;

    let feedback = "";
    let rating = 0;
    let improvement = "";

    if (matchedCount >= 3) {
        feedback = "Excellent answer! You covered the key concepts well.";
        rating = 5;
    } else if (matchedCount >= 1) {
        feedback = "Good attempt, but you missed some key points. Try to elaborate more on the core concepts.";
        rating = 3;
        improvement = `Try to mention: ${missingKeywords.slice(0, 3).join(', ')}`;
    } else {
        feedback = "Your answer seems a bit off. Consider reviewing the topic.";
        rating = 1;
        improvement = `Focus on explaining: ${keywords.slice(0, 3).join(', ')}`;
    }


    const dbSession = await AISession.findById(sessionId);
    if (dbSession) {
        dbSession.questions.push({
            question: currentQ.question,
            answer,
            feedback,
            rating,
            improvement
        });

        const totalRating = dbSession.questions.reduce((acc, q) => acc + q.rating, 0);
        dbSession.overallRating = (totalRating / dbSession.questions.length).toFixed(1);
        await dbSession.save();
    }




    const currentSessionQuestions = dbSession ? dbSession.questions.map(q => q.question) : [];

    let nextQ = await getDynamicQuestion(req.user.id, sessionData.type, currentSessionQuestions, sessionData.domain);

    sessionData.currentQuestion = nextQ;

    res.status(200).json({
        feedback,
        rating,
        improvement,
        nextQuestion: nextQ.question,
        idealAnswer: currentQ.idealAnswer
    });
});




const getHistory = asyncHandler(async (req, res) => {
    const sessions = await AISession.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
});




const deleteSession = asyncHandler(async (req, res) => {
    const session = await AISession.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }


    if (session.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }


    if (session.videoUrl) {
        const fs = require('fs');
        const path = require('path');
        const videoPath = path.join(__dirname, '..', session.videoUrl);
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }
    }

    await AISession.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id });
});




const updateSession = asyncHandler(async (req, res) => {
    const session = await AISession.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    if (session.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    session.title = req.body.title || session.title;
    if (req.body.userNotes !== undefined) {
        session.userNotes = req.body.userNotes;
    }
    const updatedSession = await session.save();

    res.status(200).json(updatedSession);
});



const { generateProblem, evaluateCode, generateInterviewQuestion, simulateCodeExecution } = require('../services/geminiService');


const getDynamicQuestion = async (userId, type, ignoreList = [], domain = "") => {

    const pastSessions = await AISession.find({ user: userId });
    const ignoreSet = new Set(ignoreList);
    pastSessions.forEach(session => {
        if (session.questions) {
            session.questions.forEach(q => {
                ignoreSet.add(q.question);
            });
        }
    });
    const fullIgnoreList = Array.from(ignoreSet);


    if (process.env.GEMINI_API_KEY) {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            const aiQuestion = await generateInterviewQuestion(type, fullIgnoreList, domain);

            if (aiQuestion && aiQuestion.question) {
                console.log(`AI Generated Question for domain '${domain}':`, aiQuestion.question);

                // strict check against ignore list to prevent repetition
                const isDuplicate = fullIgnoreList.some(
                    ignored => ignored.toLowerCase().trim() === aiQuestion.question.toLowerCase().trim()
                );

                if (!isDuplicate) {
                    return aiQuestion;
                }
                console.log(`Duplicate question generated (Attempt ${attempts + 1}): ${aiQuestion.question}`);
            } else {
                console.log(`AI Generation returned null or invalid format (Attempt ${attempts + 1})`);
            }
            attempts++;
        }
    }


    return getUnaskedQuestion(userId, type, ignoreList, domain);
};




const getCompanyProblem = asyncHandler(async (req, res) => {
    const { company, topic, difficulty, language } = req.body;
    try {
        const problem = await generateProblem(company, topic, difficulty, language);
        res.status(200).json(problem);
    } catch (error) {
        res.status(500);
        throw new Error('AI Generation Failed');
    }
});




const evaluateUserCode = asyncHandler(async (req, res) => {
    const { problem, code, language } = req.body;
    try {
        const evaluation = await evaluateCode(problem, code, language);
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500);
        throw new Error('AI Evaluation Failed');
    }
});

const simulateUserCode = asyncHandler(async (req, res) => {
    const { code, language, customInput } = req.body;
    try {
        const result = await simulateCodeExecution(code, language, customInput);
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
        throw new Error('AI Code Simulation Failed');
    }
});

module.exports = {
    startSession,
    submitAnswer,
    getHistory,
    deleteSession,
    updateSession,
    getCompanyProblem,
    evaluateUserCode,
    simulateUserCode
};
