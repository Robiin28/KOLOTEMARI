// middleware/validateSectionId.js

const mongoose = require('mongoose');
const Section = require('../models/SectionModel');
const CustomErr = require('../utils/CustomErr');

module.exports = async (req, res, next) => {
    const { sectionId } = req.params;

    // Validate Section ID
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return next(new CustomErr('Invalid section ID format.', 400));
    }

    // Check if Section exists
    const section = await Section.findById(sectionId);
    if (!section) {
        return next(new CustomErr('Section not found.', 404));
    }

    next();
};
