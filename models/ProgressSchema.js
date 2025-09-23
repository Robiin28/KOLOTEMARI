const progressSchema = new mongoose.Schema({
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date
    }
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
