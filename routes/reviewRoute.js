const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');
const router = express.Router();

router.use(authController.protect);
router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('student'), reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('student', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('student', 'admin'), reviewController.deleteReview);

module.exports = router;
