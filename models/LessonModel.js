const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    sectionId:{
        type:Schema.Types.ObjectId,
        ref:'Section',
        required:true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    videoUrls: [{
        type: String,
        required: true
    }],
    resources: [{
        type: String
    }],
    pic: [{
        type: String // URL of the picture
    }],
    description: {
        type: String
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

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
