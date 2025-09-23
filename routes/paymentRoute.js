const express = require('express');
const paymentController = require('../controller/paymentController');
const authController = require('../controller/authController');
const router = express.Router();

// Protect all routes after this middleware (optional: uncomment if authentication is required)
router.use(authController.protect);  // Ensure user is authenticated before accessing any route

// Route to get all payments or initialize payment
router.route('/')
    .get(
        // authController.restrictTo('admin'),  // Only admin can get all payment records
        paymentController.getAllPayments
    )
    .post(
        // authController.restrictTo('student', 'instructor'),  // Only students or instructors can initialize payments
        paymentController.pay                                // Initialize payment
    );

// Route to get a specific payment by ID or delete it
router.route('/:id')
    .get(
        authController.restrictTo('admin', 'student', 'instructor'),  // Admin, student, or instructor can view a payment by ID
        paymentController.getPayment
    )
    .delete(
        authController.restrictTo('admin'),  // Only admin can delete payments
        paymentController.deletePayment
    );

// Route to verify payment after successful Chapa checkout
router.route('/success')
    .post(paymentController.verifyPayment);  // Verifies the payment by tx_ref after Chapa redirects

module.exports = router;
