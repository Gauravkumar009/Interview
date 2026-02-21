const mongoose = require('mongoose');

const aiSessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    interviewType: {
        type: String,
        required: true,
        enum: ['Technical', 'HR', 'Behavioral']
    },
    domain: {
        type: String,
        required: false,
        default: "General"
    },
    mode: {
        type: String,
        required: true,
        enum: ['text', 'video'],
        default: 'text'
    },
    date: {
        type: Date,
        default: Date.now
    },
    questions: [{
        question: String,
        answer: String,
        feedback: String,
        rating: Number,
        improvement: String
    }],
    overallRating: {
        type: Number,
        default: 0
    },
    videoUrl: {
        type: String,
        required: false
    },
    userNotes: {
        type: String,
        required: false,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AISession', aiSessionSchema);
