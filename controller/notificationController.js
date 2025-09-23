const Notification = require('../models/NotificationModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const APIFeatures = require('../utils/ApiFeatuers');

// Create a new notification
exports.createNotification = asyncErrorHandler(async (req, res, next) => {
    const { recipient, message } = req.body;

    if (!recipient || !message) {
        return next(new CustomErr('Recipient and message are required fields.', 400));
    }

    const notification = await Notification.create({
        sender: req.user._id,
        recipient,
        message
    });

    res.status(201).json({
        status: 'success',
        data: {
            notification
        }
    });
});

// Get all notifications for the logged-in user
exports.getNotifications = asyncErrorHandler(async (req, res, next) => {
    // Create a query object with filters
    const query = Notification.find({ recipient: req.user._id });

    // Apply API features (filter, sort, limit fields, paginate)
    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query
    const notifications = await features.query;

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: {
            notifications
        }
    });
});

// Mark a notification as read
exports.markAsRead = asyncErrorHandler(async (req, res, next) => {
    const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true, runValidators: true }
    );

    if (!notification) {
        return next(new CustomErr('Notification not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            notification
        }
    });
});

// Delete a notification
exports.deleteNotification = asyncErrorHandler(async (req, res, next) => {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
        return next(new CustomErr('Notification not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
