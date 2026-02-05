import api from './api';

/**
 * Question service
 */

export const getPracticeQuestion = async (category, difficulty) => {
    const params = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;

    const response = await api.get('/questions/practice', { params });
    return response.data;
};

export const submitAnswer = async (questionId, answer) => {
    const response = await api.post('/questions/submit', { questionId, answer });
    return response.data;
};
