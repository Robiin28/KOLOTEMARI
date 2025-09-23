const Section = require('../models/SectionModel'); 
const Course = require('../models/CourseModel'); 
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');
const APIFeatures = require('../utils/ApiFeatuers');
const mongoose = require('mongoose');

// Get all sections for a specific course with optional filtering, sorting, and pagination
exports.getAllSections = asyncErrorHandler(async (req, res, next) => {
    // Extract courseId from route parameters
    const { courseId } = req.params;

    const features = new APIFeatures(Section.find({ courseId }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const sections = await features.query;

    res.status(200).json({
        status: 'success',
        results: sections.length,
        data: {
            sections
        }
    });
});

exports.getSection = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const section = await Section.findById(id).populate('courseId');

    if (!section) {
        return next(new CustomErr('No section found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            section
        }
    });
});

// Create a new section for a specific course
exports.createSection = asyncErrorHandler(async (req, res, next) => {
    const { title, order } = req.body;
    const { courseId } = req.params;

    // Ensure courseId is valid
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new CustomErr('Invalid course ID format.', 400));
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new CustomErr('Course not found.', 404));
    }

    try {
        // Create the section
        const section = await Section.create({
            title,
            order,
            courseId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                section
            }
        });
    } catch (error) {
        console.error('Error creating section:', error);
        return next(new CustomErr('Failed to create section.', 500));
    }
});

// Update a section by ID
exports.updateSection = asyncErrorHandler(async (req, res, next) => {
    const { title, order, courseId } = req.body;
    const { id } = req.params;

    // Validate courseId if provided
    if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new CustomErr('Invalid course ID format.', 400));
    }

    // Check if the course exists if courseId is provided
    if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new CustomErr('Course not found.', 404));
        }
    }

    const updatedSection = await Section.findByIdAndUpdate(id, {
        title,
        order,
        courseId
    }, {
        new: true,
        runValidators: true
    });

    if (!updatedSection) {
        return next(new CustomErr('No section found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            section: updatedSection
        }
    });
});

// Delete a section by ID
exports.deleteSection = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const section = await Section.findByIdAndDelete(id);

    if (!section) {
        return next(new CustomErr('No section found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
