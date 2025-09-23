const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pic: {
        type: String // URL of the picture
    },
    trailer: {
        type: String
    },
    status: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
        required: true
    },
    price: {
        type: Number,
        validate: {
            validator: function(value) {
                // Ensure price is set if status is "paid"
                return (this.status === 'free') || (this.status === 'paid' && value != null);
            },
            message: 'Price is required when status is "paid".'
        }
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: [true, 'A course must have an instructor']
    },
    category: { // Corrected from 'catagory' to 'category'
        type: String,
        required: [true, 'Please add the category of the course']
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

// Middleware to validate price when status is 'paid'
courseSchema.pre('save', function(next) {
    if (this.status === 'paid' && !this.price) {
        return next(new Error('Price is required when status is "paid".'));
    }
    next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
