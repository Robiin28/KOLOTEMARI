// middleware/validateCourseId.js

const mongoose = require('mongoose');
const Course = require('../models/CourseModel');

async function validateCourseId(req, res, next) {
    const courseId = req.params.courseId;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        // Attach the course object to the request for later use in controllers
        req.course = course;
        next();
    } catch (err) {
        console.error('Error validating course ID:', err);
        res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = validateCourseId;
