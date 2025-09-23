const Review = require('../models/ReviewModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const APIFeatures = require('../utils/ApiFeatuers');

exports.getAllReviews = asyncErrorHandler(async (req, res, next) => {
    // Create a query object for the Review model
    const query = Review.find();

    // Apply API features (filter, sort, limit fields, paginate)
    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query
    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.getReview = asyncErrorHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new CustomErr('No review found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.createReview = asyncErrorHandler(async (req, res, next) => {
    const review = await Review.create({
        ...req.body,
        userId: req.user._id
    });
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.updateReview = asyncErrorHandler(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new CustomErr('No review found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new CustomErr('No review found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
