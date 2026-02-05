import api from './api';

/**
 * AI service for question generation, hints, and explanations
 */

export const generateQuestion = async (category, difficulty, excludedQuestionIds = []) => {
    const response = await api.post('/ai/generate-question', { 
        category, 
        difficulty,
        excludedQuestionIds 
    });
    return response.data;
};

export const getHint = async (questionId) => {
    const response = await api.post('/ai/hint', { questionId });
    return response.data;
};

export const getExplanation = async (questionId, userAnswer) => {
    const response = await api.post('/ai/explain', { questionId, userAnswer });
    return response.data;
};
