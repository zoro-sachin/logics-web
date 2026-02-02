import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

/**
 * Auth Context Provider
 * Manages user authentication state across the application
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await authService.verifyToken();
                setUser(response.data);
            } catch (err) {
                console.error('Token verification failed:', err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    /**
     * Register new user
     */
    const register = async (userData) => {
        try {
            setError(null);
            const response = await authService.register(userData);

            if (response.success) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data);
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    /**
     * Login user
     */
    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authService.login(credentials);

            if (response.success) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data);
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    /**
     * Update user data
     */
    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

export default AuthContext;
