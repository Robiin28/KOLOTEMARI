const express = require('express');
const quizController = require('../controller/quizController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/')
    .get(quizController.getAllQuizzes)
    .post(
        // authController.restrictTo('instructor', 'admin'), 
        quizController.createQuiz);

router.route('/:id')
    .get(quizController.getQuiz)
    .patch(
        // authController.restrictTo('instructor', 'admin'),
         quizController.updateQuiz)
    .delete(
        // authController.restrictTo('instructor', 'admin'),
     quizController.deleteQuiz);

module.exports = router;
