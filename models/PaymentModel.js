const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    }],
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'ETB', // Set default currency if needed
    },
    tx_ref:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'], // Allow status tracking
        default: 'pending', // Default status
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
