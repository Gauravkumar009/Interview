const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        interviewType: {
            type: String,
            required: [true, 'Please add interview type (e.g., HR, Technical)'],
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating (1-10)'],
            min: 1,
            max: 10,
        },
        feedback: {
            type: String,
            required: [true, 'Please add feedback'],
        },
        areasOfImprovement: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
