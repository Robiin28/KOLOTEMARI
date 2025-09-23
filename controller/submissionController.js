const Submission = require('../models/SubmisionModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');

exports.getAllSubmissions = asyncErrorHandler(async (req, res, next) => {
    const submissions = await Submission.find();
    res.status(200).json({
        status: 'success',
        results: submissions.length,
        data: {
            submissions
        }
    });
});

exports.getSubmission = asyncErrorHandler(async (req, res, next) => {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
        return next(new CustomErr('No submission found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            submission
        }
    });
});

exports.createSubmission = asyncErrorHandler(async (req, res, next) => {
    const submission = await Submission.create({
        ...req.body,
        userId: req.user._id
    });
    res.status(201).json({
        status: 'success',
        data: {
            submission
        }
    });
});

exports.deleteSubmission = asyncErrorHandler(async (req, res, next) => {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
        return next(new CustomErr('No submission found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
