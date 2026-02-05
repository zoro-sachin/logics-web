import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

// Get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get analytics overview
export const getOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/overview`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch overview' };
    }
};

// Get strengths and weaknesses
export const getStrengths = async () => {
    try {
        const response = await axios.get(`${API_URL}/strengths`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch strengths' };
    }
};

// Get activity heatmap data
export const getActivity = async () => {
    try {
        const response = await axios.get(`${API_URL}/activity`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch activity' };
    }
};

// Get performance trends
export const getTrends = async (period = '30') => {
    try {
        const response = await axios.get(`${API_URL}/trends`, {
            headers: getAuthHeader(),
            params: { period }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch trends' };
    }
};

// Get recent activity
export const getRecentActivity = async (limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/recent`, {
            headers: getAuthHeader(),
            params: { limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch recent activity' };
    }
};

export default {
    getOverview,
    getStrengths,
    getActivity,
    getTrends,
    getRecentActivity
};
