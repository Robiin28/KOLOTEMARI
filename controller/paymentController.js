const express = require("express");
const axios = require("axios").default;
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const Payment = require('../models/PaymentModel');
const Enrollment = require('../models/EnrollModel');
const Cart = require('../models/CartModel');

// Chapa API credentials
const CHAPA_SECRET_KEY = process.env.PAYMENT_KEY;

const config = {
    headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
    },
};

// Get all payments
exports.getAllPayments = asyncErrorHandler(async (req, res, next) => {
    const payments = await Payment.find();
    res.status(200).json({
        status: 'success',
        results: payments.length,
        data: {
            payments
        }
    });
});

// Initialize payment
exports.pay = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("Received payment request body:", req.body);

        const { amount, currency, studentId, courses, first_name, last_name } = req.body;

        // Validate the received data
        if (!studentId || !Array.isArray(courses) || courses.length === 0 || !amount || !currency) {
            return res.status(400).json({
                success: false,
                message: 'Student ID, courses, amount, and currency are required',
            });
        }

        let tx_ref = `tx-myecommerce12345.${Date.now()}`;
        let existingPayment = await Payment.findOne({ tx_ref });
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment already initialized for this transaction.',
            });
        }

        const result = await axios.post(
            "https://api.chapa.co/v1/transaction/initialize",
            {
                amount,
                currency,
                email: req.body.email || "aman@gmail.com",
                first_name: first_name || "Abebe",
                last_name: last_name || "Bikila",
                tx_ref,
                callback_url: `http://localhost:6000/api/payments/success?tx_ref=${tx_ref}`,
                "customization[title]": req.body.title || "I love",
                "customization[description]": req.body.description || "It is time to pay",
            },
            config
        );

        // Save the initial payment attempt to the database
        await Payment.create({
            student: studentId,
            courses,
            amount,
            currency,
            tx_ref,
            status: 'pending',
            first_name: first_name || "Abebe",
            last_name: last_name || "Bikila",
            created_at: new Date(),
        });

        if (result.data.data && result.data.data.checkout_url) {
            res.status(200).json({
                success: true,
                message: 'Payment initialized successfully',
                tx_ref,
                checkout_url: result.data.data.checkout_url,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to retrieve checkout URL from Chapa API.',
            });
        }
    } catch (error) {
        console.error("Error initializing payment:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while initializing the payment',
            error: error.response?.data || error.message,
        });
    }
});

// Verify payment
exports.verifyPayment = asyncErrorHandler(async (req, res, next) => {
    try {
        const tx_ref = req.body.tx_ref;

        if (!tx_ref) {
            return res.status(400).json({
                success: false,
                message: 'No transaction reference provided',
            });
        }

        const result = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            },
        });

        if (result.data.status === 'success') {
            // Update the existing payment status to 'success'
            const payment = await Payment.findOneAndUpdate(
                { tx_ref },
                {
                    status: 'success',
                    updated_at: new Date(),
                },
                { new: true }
            );

            if (!payment) {
                return next(new CustomErr('Payment not found for this transaction reference', 404));
            }

            // Register the student in the Enrollment database for each course
            const enrollmentPromises = payment.courses.map(async (courseId) => {
                // Check if the enrollment already exists
                const existingEnrollment = await Enrollment.findOne({ student: payment.student, course: courseId });
                if (!existingEnrollment) {
                    return Enrollment.create({
                        student: payment.student,
                        course: courseId,
                        status: 'active',
                    });
                }
                return null; // No new enrollment created
            });

            await Promise.all(enrollmentPromises); // Wait for all enrollments to be created

            // Clear the user's cart after successful payment
            await Cart.findOneAndUpdate({ userId: payment.student }, { items: [] }); // Adjust as necessary

            return res.json({
                success: true,
                message: 'Payment verified and student enrolled successfully, cart cleared',
                data: {
                    payment,
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                error: result.data,
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while verifying the payment',
            error: error.response?.data || error.message,
        });
    }
});

// Get a specific payment by ID
exports.getPayment = asyncErrorHandler(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        return next(new CustomErr('No payment found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            payment
        }
    });
});

// Delete a payment
exports.deletePayment = asyncErrorHandler(async (req, res, next) => {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
        return next(new CustomErr('No payment found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
