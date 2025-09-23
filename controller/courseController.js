const Course = require('../models/CourseModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const APIFeatures = require('../utils/ApiFeatuers');
const mongoose = require('mongoose');

exports.getAllCourses = asyncErrorHandler(async (req, res, next) => {
    const features = new APIFeatures(Course.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const courses = await features.query;

    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: {
            courses
        }
    });
});

exports.getCourse = asyncErrorHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new CustomErr('No course found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            course
        }
    });
});

exports.createCourse = asyncErrorHandler(async (req, res, next) => {
    const { title, description, pic, trailer, status, price, instructor, category } = req.body;

    // Ensure price is included if status is paid
    if (status === 'paid' && !price) {
        return next(new CustomErr('Price is required when status is "paid".', 400));
    }

    if (!mongoose.Types.ObjectId.isValid(instructor)) {
        return next(new CustomErr('Invalid instructor ID format.', 400));
    }

    try {
        // Create the course
        const course = await Course.create({
            title,
            description,
            pic,
            trailer,
            status,
            price,
            instructor, // Directly use the instructor ID
            category    // Include category in course creation
        });

        res.status(201).json({
            status: 'success',
            data: {
                course
            }
        });
    } catch (error) {
        console.error('Error creating course:', error);
        return next(new CustomErr('Failed to create course.', 500));
    }
});

exports.updateCourse = asyncErrorHandler(async (req, res, next) => {
    // Ensure price is included if status is paid
    if (req.body.status === 'paid' && !req.body.price) {
        return next(new CustomErr('Price is required when status is "paid".', 400));
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!course) {
        return next(new CustomErr('No course found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            course
        }
    });
});

exports.deleteCourse = asyncErrorHandler(async (req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
        return next(new CustomErr('No course found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.getRelatedCourses = asyncErrorHandler(async (req, res, next) => {
    const courseId = req.params.courseId; // Use courseId to match the route

    // Find the course to get its category
    const course = await Course.findById(courseId);

    if (!course) {
        return next(new CustomErr('No course found with that ID', 404));
    }

    // Fetch related courses based on the category of the found course
    const relatedCourses = await Course.find({ category: course.category, _id: { $ne: courseId } });

    if (!relatedCourses.length) {
        return next(new CustomErr('No related courses found for this category', 202));
    }

    res.status(200).json({
        status: 'success',
        results: relatedCourses.length,
        data: {
            courses: relatedCourses
        }
    });
});
exports.getCoursesByInstructor = asyncErrorHandler(async (req, res, next) => {
    const instructorId = req.params.instructorId;

    // Validate instructor ID
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        return next(new CustomErr('Invalid instructor ID format.', 400));
    }

    // Fetch courses taught by the instructor
    const courses = await Course.find({ instructor: instructorId });

    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: {
            courses
        }
    });
});

