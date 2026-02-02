const Question = require('../models/Question');

/**
 * Get questions by category
 * @route GET /api/questions/category/:category
 * @access Private
 */
const getQuestionsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { difficulty, limit = 10 } = req.query;

        const query = { category };
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const questions = await Question.find(query)
            .select('-correctAnswer -explanation') // Don't send answer to client initially
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
};

/**
 * Get random practice questions
 * @route GET /api/questions/practice
 * @access Private
 */
/**
 * Get random practice questions
 * @route GET /api/questions/practice
 * @access Private
 */
const getPracticeQuestions = async (req, res) => {
    try {
        const { category } = req.query;
        // User's current level determines the difficulty/level of question
        const user = req.user;
        const currentLevel = user.currentLevel || 1;

        const query = { level: currentLevel };
        if (category) query.category = category;

        // Get random question for current level
        let questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: 1 } },
            {
                $project: {
                    correctAnswer: 0,
                    explanation: 0
                }
            }
        ]);

        // If no questions found for this level, generate them
        if (questions.length === 0) {
            console.log(`No questions found for Level ${currentLevel}. Generating...`);

            // If category is provided, use it. If not, pick a random one or default to 'reasoning'
            const targetCategory = category || 'reasoning';

            // Generate a batch (e.g., 20) so we don't have to generate every time
            const aiQuestionService = require('../services/aiQuestionService');
            const generatedQuestions = await aiQuestionService.generateQuestionsForLevel(targetCategory, currentLevel, 20);

            if (generatedQuestions.length > 0) {
                // Select one to return
                const selected = generatedQuestions[0];
                return res.json({
                    success: true,
                    data: {
                        _id: selected._id,
                        category: selected.category,
                        difficulty: selected.difficulty,
                        level: selected.level,
                        questionText: selected.questionText,
                        options: selected.options,
                        points: selected.points
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate questions.'
                });
            }
        }

        res.json({
            success: true,
            data: questions[0]
        });
    } catch (error) {
        console.error('Get practice question error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching practice question',
            error: error.message
        });
    }
};

/**
 * Submit practice answer and get feedback
 * @route POST /api/questions/submit
 * @access Private
 */
const submitAnswer = async (req, res) => {
    try {
        const { questionId, answer } = req.body;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const isCorrect = answer === question.correctAnswer;

        let levelUp = false;
        let newLevel = null;

        // Update user progress if correct
        if (isCorrect) {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);

            // Update stats
            if (user.progress[question.category] !== undefined) {
                user.progress[question.category] += question.points;
            }
            user.totalScore += question.points;

            // Update Level Progress
            user.levelProgress += 1;

            // Check for Level Up
            if (user.levelProgress >= user.questionsNeededForLevel) {
                user.currentLevel += 1;
                user.levelProgress = 0;
                levelUp = true;
                newLevel = user.currentLevel;

                // Trigger auto-generation for new level in background
                // taking the current category or defaulting to mixed categories ideally
                // For simplicity, we'll generate for the current question's category
                const aiQuestionService = require('../services/aiQuestionService');
                aiQuestionService.generateQuestionsForLevel(question.category, newLevel, 20)
                    .catch(err => console.error('Background generation error:', err));
            }

            await user.save();
        }

        res.json({
            success: true,
            data: {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                pointsEarned: isCorrect ? question.points : 0,
                levelUp,
                newLevel
            }
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting answer',
            error: error.message
        });
    }
};

module.exports = {
    getQuestionsByCategory,
    getPracticeQuestions,
    submitAnswer
};
