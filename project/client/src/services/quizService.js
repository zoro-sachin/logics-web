import api from './api';

/**
 * Quiz service
 */

export const getQuizzes = async (category, difficulty) => {
    const params = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;

    const response = await api.get('/quizzes', { params });
    return response.data;
};

export const getQuizById = async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
};

export const submitQuiz = async (quizId, answers, timeSpent) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers, timeSpent });
    return response.data;
};

export const getQuizResults = async (scoreId) => {
    const response = await api.get(`/quizzes/results/${scoreId}`);
    return response.data;
};
