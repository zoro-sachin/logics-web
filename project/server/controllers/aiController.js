const Question = require('../models/Question');
const aiQuestionService = require('../services/aiQuestionService');

/**
 * Generate a question using AI (with Groq API fallback to local)
 * @route POST /api/ai/generate-question
 * @access Private
 */
const generateQuestion = async (req, res) => {
    try {
        const { category, difficulty, excludedQuestionIds = [] } = req.body;

        if (!category || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Category and difficulty are required'
            });
        }

        let questionData;
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            questionData = await aiQuestionService.generateQuestion(category, difficulty);

            // 1. Check if this exact question already exists in our database
            const existingQuestion = await Question.findOne({
                questionText: questionData.questionText,
                category,
                difficulty
            });

            if (existingQuestion) {
                // 2. If it exists, check if this SPECIFIC user has seen it (via excludedQuestionIds)
                const isExcluded = excludedQuestionIds.includes(existingQuestion._id.toString());

                if (!isExcluded) {
                    // Found an existing question the user hasn't seen! Return it.
                    console.log(`Reusing existing question: ${existingQuestion._id} (Attempt ${attempts + 1})`);
                    return res.json({
                        success: true,
                        data: {
                            _id: existingQuestion._id,
                            category: existingQuestion.category,
                            difficulty: existingQuestion.difficulty,
                            questionText: existingQuestion.questionText,
                            options: existingQuestion.options,
                            points: existingQuestion.points
                        }
                    });
                }
                // If excluded, loop again to pick another random one from bank
            } else {
                // 3. Doesn't exist in DB at all, so user definitely haven't seen it in this DB context.
                // Create it and return it.
                const question = await Question.create({
                    category,
                    difficulty,
                    questionText: questionData.questionText,
                    options: questionData.options,
                    correctAnswer: questionData.correctAnswer,
                    explanation: questionData.explanation,
                    generatedBy: 'AI'
                });

                console.log(`Created new question document: ${question._id}`);
                return res.json({
                    success: true,
                    data: {
                        _id: question._id,
                        category: question.category,
                        difficulty: question.difficulty,
                        questionText: question.questionText,
                        options: question.options,
                        points: question.points
                    }
                });
            }

            attempts++;
        }

        // If we reach here, we've tried 50 times and only hit questions the user has already seen
        return res.status(400).json({
            success: false,
            message: 'Unable to find a new unique question. You may have viewed all available questions in this category. Try resetting your progress or choosing a different category.'
        });
    } catch (error) {
        console.error('Generate question error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error generating question',
            error: error.message
        });
    }
};

/**
 * Get hint for a question
 * @route POST /api/ai/hint
 * @access Private
 */
const getHint = async (req, res) => {
    try {
        const { questionId } = req.body;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Generate hint using AI service
        const hint = await aiQuestionService.getHint(question.questionText, question.options);

        res.json({
            success: true,
            data: { hint }
        });
    } catch (error) {
        console.error('Get hint error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error generating hint',
            error: error.message
        });
    }
};

/**
 * Get explanation for a question
 * @route POST /api/ai/explain
 * @access Private
 */
const getExplanation = async (req, res) => {
    try {
        const { questionId, userAnswer } = req.body;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Get explanation using AI service
        const explanation = await aiQuestionService.getExplanation(
            question.questionText,
            question.options,
            question.correctAnswer,
            userAnswer
        );

        res.json({
            success: true,
            data: {
                explanation,
                correctAnswer: question.correctAnswer,
                isCorrect: userAnswer === question.correctAnswer
            }
        });
    } catch (error) {
        console.error('Get explanation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error generating explanation',
            error: error.message
        });
    }
};

module.exports = {
    generateQuestion,
    getHint,
    getExplanation
};
