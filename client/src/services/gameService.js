import axios from 'axios';

const API_URL = 'http://localhost:5000/api/games';

// Get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Start a new game session
export const startGame = async (gameType, difficulty) => {
    try {
        const response = await axios.post(
            `${API_URL}/start`,
            { gameType, difficulty },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to start game' };
    }
};

// Submit game result
export const submitGame = async (gameData) => {
    try {
        const response = await axios.post(
            `${API_URL}/submit`,
            gameData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit game' };
    }
};

// Get user's game history
export const getGameHistory = async (gameType = null, limit = 20) => {
    try {
        const params = { limit };
        if (gameType) params.gameType = gameType;

        const response = await axios.get(`${API_URL}/history`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch game history' };
    }
};

// Get game leaderboard
export const getLeaderboard = async (gameType, limit = 100) => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard/${gameType}`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    }
};

// Get user's game statistics
export const getGameStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch game stats' };
    }
};

export default {
    startGame,
    submitGame,
    getGameHistory,
    getLeaderboard,
    getGameStats
};
