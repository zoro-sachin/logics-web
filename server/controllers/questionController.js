const Question = require('../models/Question');
const questionService = require('../services/questionService');

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
        const user = req.user;
        const currentLevel = user.currentLevel || 1;

        const query = { level: currentLevel };
        if (category) query.category = category;

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

        if (questions.length === 0) {
            const targetCategory = category || 'reasoning';
            const generatedQuestions = await questionService.generateQuestionsForLevel(targetCategory, currentLevel, 5);

            if (generatedQuestions.length > 0) {
                // Save to DB and return
                const selectedData = generatedQuestions[0];
                const newQuestion = await Question.create({
                    ...selectedData,
                    generatedBy: 'System'
                });

                return res.json({
                    success: true,
                    data: {
                        _id: newQuestion._id,
                        category: newQuestion.category,
                        difficulty: newQuestion.difficulty,
                        level: newQuestion.level,
                        questionText: newQuestion.questionText,
                        options: newQuestion.options,
                        points: newQuestion.points
                    }
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve questions from bank.'
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
 * Generate a new question from bank
 * @route POST /api/questions/generate
 * @access Private
 */
const generateQuestion = async (req, res) => {
    try {
        const { category, level, difficulty } = req.body;
        const targetLevel = level || 1;
        const targetDifficulty = difficulty || questionService.getDifficultyForLevel(targetLevel);
        const targetCategory = category || 'reasoning';

        const questionData = await questionService.generateQuestion(targetCategory, targetDifficulty, targetLevel);

        if (!questionData) {
            return res.status(404).json({
                success: false,
                message: `No questions available in bank for category: ${targetCategory}`
            });
        }

        const question = await Question.create({
            ...questionData,
            generatedBy: 'System'
        });

        res.json({
            success: true,
            data: {
                _id: question._id,
                category: question.category,
                difficulty: question.difficulty,
                level: question.level,
                questionText: question.questionText,
                options: question.options,
                points: question.points
            }
        });
    } catch (error) {
        console.error('Generate question error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating question from bank',
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

        const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

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
                questionService.generateQuestionsForLevel(question.category, newLevel, 10)
                    .then(generated => {
                        return Promise.all(generated.map(q => Question.create({ ...q, generatedBy: 'System' })));
                    })
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
    generateQuestion,
    submitAnswer
};
