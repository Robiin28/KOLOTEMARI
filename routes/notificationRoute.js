const express = require('express');
const notificationController = require('../controller/notificationController');
const authController = require('../controller/authController');

const router = express.Router();

// Middleware to protect routes
router.use(authController.protect);

// Route to get all notifications for the logged-in user
router.get('/myNotifications', notificationController.getNotifications);

// Route to create a new notification
router.post('/sendNotification', notificationController.createNotification);

// Route to mark a notification as read
router.patch('/markAsRead/:id', notificationController.markAsRead);

// Route to delete a notification
router.delete('/deleteNotification/:id', notificationController.deleteNotification);

module.exports = router;
