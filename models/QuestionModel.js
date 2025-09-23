const mongoose=require('mongoose');
const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
