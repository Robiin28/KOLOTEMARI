const express = require('express');
const submissionController = require('../controller/submissionController');
const authController = require('../controller/authController');
const router = express.Router();

router.use(authController.protect);
router.route('/')
    .get(submissionController.getAllSubmissions)
    .post(authController.restrictTo('student'), submissionController.createSubmission);

router.route('/:id')
    .get(submissionController.getSubmission)
    .delete(authController.restrictTo('student', 'admin'), submissionController.deleteSubmission);

module.exports = router;
