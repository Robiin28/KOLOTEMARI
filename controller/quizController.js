const Quiz = require('../models/QuizModel');
const asyncErrorHandler = require('../utils/ErrorHandler');
const CustomErr = require('../utils/CustomErr');

// Get all quizzes
// Get all quizzes for a specific lesson
exports.getAllQuizzes = asyncErrorHandler(async (req, res, next) => {
    const lessonId = req.params.lessonId; // Get lesson ID from request parameters

    // Fetch quizzes that belong to the specified lesson
    const quizzes = await Quiz.find({ lesson: lessonId });

    res.status(200).json({
        status: 'success',
        results: quizzes.length,
        data: {
            quizzes
        }
    });
});


// Get a specific quiz by ID
exports.getQuiz = asyncErrorHandler(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(new CustomErr('No quiz found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            quiz
        }
    });
});

// Create a new quiz
exports.createQuiz = asyncErrorHandler(async (req, res, next) => {
    const { title, lesson, questions, durationMinutes } = req.body;

    // Validate required fields
    if (!title || !lesson || !questions) {
        return next(new CustomErr('Please provide title, lesson, and questions', 400));
    }

    const quiz = await Quiz.create({
        title,
        lesson,
        questions,
        durationMinutes
    });

    res.status(201).json({
        status: 'success',
        data: {
            quiz
        }
    });
});

// Update an existing quiz
exports.updateQuiz = asyncErrorHandler(async (req, res, next) => {
    const { title, lesson, questions, durationMinutes } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        {
            title,
            lesson,
            questions,
            durationMinutes,
            updatedAt: Date.now() // Update the timestamp manually
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!quiz) {
        return next(new CustomErr('No quiz found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            quiz
        }
    });
});

// Delete a quiz by ID
exports.deleteQuiz = asyncErrorHandler(async (req, res, next) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
        return next(new CustomErr('No quiz found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
