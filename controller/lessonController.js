const mongoose = require('mongoose');
const Lesson = require('../models/LessonModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const APIFeatures = require('../utils/ApiFeatuers');
const Course = require('../models/CourseModel');
const Section = require('../models/SectionModel');

// Get all lessons for a specific course and section
exports.getAllLessons = asyncErrorHandler(async (req, res, next) => {
    const { courseId, sectionId } = req.params;

    // Validate Object IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(sectionId)) {
        return next(new CustomErr('Invalid course ID or section ID format.', 400));
    }

    const features = new APIFeatures(
        Lesson.find({sectionId }), // Filter by courseId and sectionId
        req.query
    )
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const lessons = await features.query;

    res.status(200).json({
        status: 'success',
        results: lessons.length,
        data: {
            lessons
        }
    });
});

// Create a new lesson for a specific course and section
exports.createLesson = asyncErrorHandler(async (req, res, next) => {
    const { courseId, sectionId } = req.params;
    const { title, content, videoUrls, resources, pic, description } = req.body;

    // Validate Object IDs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new CustomErr('Invalid course ID format.', 400));
    }
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return next(new CustomErr('Invalid section ID format.', 400));
    }

    // Check if Course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new CustomErr('Course not found.', 404));
    }

    // Check if Section exists
    const section = await Section.findById(sectionId);
    if (!section) {
        return next(new CustomErr('Section not found.', 404));
    }

    // Create the Lesson
    const lesson = await Lesson.create({
        courseId,
        sectionId,
        title,
        content,
        videoUrls,
        resources,
        pic,
        description
    });

    // Add Lesson ID to the Section's lessons array
    section.lessons.push(lesson._id);
    await section.save();

    res.status(201).json({
        status: 'success',
        data: {
            lesson
        }
    });
});

// Get a single lesson by ID
exports.getLesson = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Lesson ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomErr('Invalid lesson ID format.', 400));
    }

    const lesson = await Lesson.findById(id);

    if (!lesson) {
        return next(new CustomErr('Lesson not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            lesson
        }
    });
});

// Update a lesson by ID
exports.updateLesson = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, videoUrls, resources, pic, description } = req.body;

    // Validate Lesson ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomErr('Invalid lesson ID format.', 400));
    }

    const lesson = await Lesson.findByIdAndUpdate(
        id,
        { title, content, videoUrls, resources, pic, description },
        { new: true, runValidators: true }
    );

    if (!lesson) {
        return next(new CustomErr('Lesson not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            lesson
        }
    });
});

// Delete a lesson by ID
exports.deleteLesson = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Lesson ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomErr('Invalid lesson ID format.', 400));
    }

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
        return next(new CustomErr('Lesson not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
