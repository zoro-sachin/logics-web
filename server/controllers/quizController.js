const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Score = require('../models/Score');

/**
 * Get all available quizzes
 * @route GET /api/quizzes
 * @access Private
 */
const getQuizzes = async (req, res) => {
    try {
        const { category, difficulty } = req.query;

        const query = { isActive: true };
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const quizzes = await Quiz.find(query)
            .populate('questions', 'category difficulty')
            .select('-questions'); // Don't send full questions in list view

        const quizzesWithStats = await Promise.all(
            quizzes.map(async (quiz) => {
                const questionCount = await Question.countDocuments({
                    _id: { $in: quiz.questions }
                });

                return {
                    _id: quiz._id,
                    title: quiz.title,
                    description: quiz.description,
                    category: quiz.category,
                    difficulty: quiz.difficulty,
                    timeLimit: quiz.timeLimit,
                    passingScore: quiz.passingScore,
                    questionCount
                };
            })
        );

        res.json({
            success: true,
            count: quizzesWithStats.length,
            data: quizzesWithStats
        });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quizzes',
            error: error.message
        });
    }
};

/**
 * Get quiz by ID
 * @route GET /api/quizzes/:id
 * @access Private
 */
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('questions');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Remove correct answers from questions
        const questionsForQuiz = quiz.questions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options,
            category: q.category,
            difficulty: q.difficulty,
            points: q.points
        }));

        res.json({
            success: true,
            data: {
                _id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                category: quiz.category,
                timeLimit: quiz.timeLimit,
                passingScore: quiz.passingScore,
                difficulty: quiz.difficulty,
                questions: questionsForQuiz
            }
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quiz',
            error: error.message
        });
    }
};

/**
 * Submit quiz and calculate score
 * @route POST /api/quizzes/:id/submit
 * @access Private
 */
const submitQuiz = async (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Calculate score
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        const processedAnswers = answers.map(answer => {
            const question = quiz.questions.find(q => q._id.toString() === answer.questionId);

            if (!question) return null;

            totalPoints += question.points;
            const isCorrect = answer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                correctCount++;
                earnedPoints += question.points;
            }

            return {
                question: question._id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                timeSpent: answer.timeSpent || 0
            };
        }).filter(Boolean);

        const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
        const passed = percentage >= quiz.passingScore;

        // Save score
        const score = await Score.create({
            user: req.user._id,
            quiz: quizId,
            score: earnedPoints,
            totalPoints,
            percentage: Math.round(percentage),
            timeSpent,
            answers: processedAnswers,
            passed
        });

        // Update user's total score
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        user.totalScore += earnedPoints;

        // Update category progress
        if (user.progress[quiz.category] !== undefined) {
            user.progress[quiz.category] += earnedPoints;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                scoreId: score._id,
                earnedPoints,
                totalPoints,
                percentage: Math.round(percentage),
                correctCount,
                totalQuestions: quiz.questions.length,
                passed,
                timeSpent
            }
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message
        });
    }
};

/**
 * Get quiz results
 * @route GET /api/quizzes/results/:scoreId
 * @access Private
 */
const getQuizResults = async (req, res) => {
    try {
        const score = await Score.findById(req.params.scoreId)
            .populate('quiz', 'title category passingScore')
            .populate('answers.question');

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Results not found'
            });
        }

        // Check if user owns this score
        if (score.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.json({
            success: true,
            data: score
        });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching results',
            error: error.message
        });
    }
};

/**
 * Submit dynamic quiz (client-side generated)
 * @route POST /api/quizzes/submit-dynamic
 * @access Private
 */
const submitDynamicQuiz = async (req, res) => {
    try {
        const { answers, timeSpent, category, difficulty, score, totalQuestions, percentage } = req.body;

        // Save score as a dynamic record (quiz field may be null or a generic ID)
        const scoreRecord = await Score.create({
            user: req.user._id,
            category,
            difficulty,
            score,
            totalPoints: totalQuestions, // Assuming 1 point per question if points per question not provided
            percentage: Math.round(percentage * 100),
            timeSpent,
            passed: (percentage * 100) >= 60, // Default passing score
            isDynamic: true // Flag to distinguish
        });

        // Update user's total score
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        user.totalScore += score;

        // Update category progress
        const categoryKey = category || 'reasoning';
        if (user.progress[categoryKey] !== undefined) {
            user.progress[categoryKey] += score;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                scoreId: scoreRecord._id,
                earnedPoints: score,
                totalPoints: totalQuestions,
                percentage: Math.round(percentage * 100),
                passed: scoreRecord.passed,
                timeSpent
            }
        });
    } catch (error) {
        console.error('Submit dynamic quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting dynamic quiz',
            error: error.message
        });
    }
};

module.exports = {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    submitDynamicQuiz
};
