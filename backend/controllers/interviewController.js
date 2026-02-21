const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');




const getFeedbacks = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ user: req.user.id });
    res.status(200).json(feedbacks);
});




const addFeedback = asyncHandler(async (req, res) => {
    const { interviewType, rating, feedback, areasOfImprovement } = req.body;

    if (!interviewType || !rating || !feedback) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const newFeedback = await Feedback.create({
        user: req.user.id,
        interviewType,
        rating,
        feedback,
        areasOfImprovement
    });

    res.status(201).json(newFeedback);
});




const updateFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found');
    }

    
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
    if (feedback.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedFeedback);
});




const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found');
    }

    
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    
    if (feedback.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await feedback.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback
};
