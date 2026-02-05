import api from './api';

/**
 * Leaderboard service
 */

export const getLeaderboard = async (category, limit = 10) => {
    const params = { limit };
    if (category && category !== 'all') params.category = category;

    const response = await api.get('/leaderboard', { params });
    return response.data;
};

export const getLeaderboardByCategory = async (category, limit = 10) => {
    const response = await api.get(`/leaderboard/category/${category}`, { params: { limit } });
    return response.data;
};
