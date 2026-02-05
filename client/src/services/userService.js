import api from './api';

/**
 * User service
 */

export const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/users/stats');
    return response.data;
};

export const updateProgress = async (category, points) => {
    const response = await api.put('/users/progress', { category, points });
    return response.data;
};
