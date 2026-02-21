const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        topic: {
            type: String,
            required: [true, 'Please add a topic'],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: [true, 'Please add a difficulty'],
        },
        status: {
            type: String,
            enum: ['Solved', 'Revise', 'Pending'],
            default: 'Pending',
        },
        link: {
            type: String,
        },
        notes: {
            type: String,
        },
        description: {
            type: String,
            default: 'No description available.'
        },
        examples: [{
            input: String,
            output: String,
            explanation: String
        }],
        constraints: [String],
        starterCode: {
            type: String,
            default: '// Write your code here'
        }
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
