const Question = require('../models/QuestionModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');

exports.getAllQuestions = asyncErrorHandler(async (req, res, next) => {
    const questions = await Question.find();
    res.status(200).json({
        status: 'success',
        results: questions.length,
        data: {
            questions
        }
    });
});

exports.getQuestion = asyncErrorHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        return next(new CustomErr('No question found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            question
        }
    });
});

exports.createQuestion = asyncErrorHandler(async (req, res, next) => {
    const question = await Question.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            question
        }
    });
});

exports.updateQuestion = asyncErrorHandler(async (req, res, next) => {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!question) {
        return next(new CustomErr('No question found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            question
        }
    });
});

exports.deleteQuestion = asyncErrorHandler(async (req, res, next) => {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
        return next(new CustomErr('No question found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
