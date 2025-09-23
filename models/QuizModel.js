const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the quiz
const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'lesson',
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            optionText: {
                type: String,
                required: true
            }
        }],
        correctOptionIndex: {
            type: Number,
            required: true
        },
        fileUrl: {
            type: String // URL or path to the attached file, if any
        }
    }],
    durationMinutes: {
        type: Number, // Duration in minutes
        default: 60
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Quiz model
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
