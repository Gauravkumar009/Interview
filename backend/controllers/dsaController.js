const asyncHandler = require('express-async-handler');
const Question = require('../models/Question');

const getQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find({ user: req.user.id });
    res.status(200).json(questions);
});


const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        res.status(404);
        throw new Error('Question not found');
    }

    if (question.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(question);
});

const setQuestion = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.topic) {
        res.status(400);
        throw new Error('Please add title and topic');
    }

    const question = await Question.create({
        user: req.user.id,
        title: req.body.title,
        topic: req.body.topic,
        difficulty: req.body.difficulty || 'Easy',
        status: req.body.status || 'Pending',
        link: req.body.link,
        description: req.body.description,
        examples: req.body.examples,
        constraints: req.body.constraints,
        starterCode: req.body.starterCode
    });

    res.status(200).json(question);
});

const updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        res.status(400);
        throw new Error('Question not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (question.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedQuestion);
});




const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        res.status(400);
        throw new Error('Question not found');
    }

    
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
    if (question.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await question.deleteOne();

    res.status(200).json({ id: req.params.id });
});




const getStats = asyncHandler(async (req, res) => {
    const questions = await Question.find({ user: req.user.id });

    const solvedCount = questions.filter(q => q.status === 'Solved').length;
    const totalCount = questions.length;

    
    const topicStats = {};
    questions.forEach(q => {
        if (!topicStats[q.topic]) {
            topicStats[q.topic] = { total: 0, solved: 0 };
        }
        topicStats[q.topic].total++;
        if (q.status === 'Solved') topicStats[q.topic].solved++;
    });

    const weakTopics = Object.keys(topicStats).map(topic => ({
        topic,
        strength: Math.round((topicStats[topic].solved / topicStats[topic].total) * 100) || 0
    }));

    res.status(200).json({
        solvedCount,
        totalCount,
        weakTopics
    });
});

module.exports = {
    getQuestions,
    getQuestionById,
    setQuestion,
    updateQuestion,
    deleteQuestion,
    getStats
};
