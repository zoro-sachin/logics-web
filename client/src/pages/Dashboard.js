import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrophy, FaCertificate, FaBrain, FaChartLine } from 'react-icons/fa';
import { getCategoryName } from '../utils/formatters';
import './Dashboard.css';

/**
 * User Dashboard Page
 */
const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your dashboard..." />;
    }

    const skillLevelClass = user?.skillLevel?.toLowerCase() || 'beginner';

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <div>
                        <h1>Welcome back, {user?.username}! 👋</h1>
                        <p className="dashboard-subtitle">Ready to challenge your mind today?</p>
                    </div>
                    <span className={`badge badge-${skillLevelClass}`}>
                        {user?.skillLevel}
                    </span>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                            <FaBrain />
                        </div>
                        <div className="stat-content">
                            <h3>{user?.totalScore || 0}</h3>
                            <p>Total Points</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                            <FaTrophy />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.totalQuizzes || 0}</h3>
                            <p>Quizzes Taken</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                            <FaChartLine />
                        </div>
                        <div className="stat-content">
                            <h3>{stats?.stats?.averageScore || 0}%</h3>
                            <p>Average Score</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
                            <FaCertificate />
                        </div>
                        <div className="stat-content">
                            <h3>{user?.badges?.length || 0}</h3>
                            <p>Badges Earned</p>
                        </div>
                    </div>
                </div>

                {/* Progress by Category */}
                <div className="progress-section card">
                    <h2>Progress by Category</h2>
                    <div className="category-progress">
                        {user?.progress && Object.entries(user.progress).map(([category, points]) => (
                            <div key={category} className="category-item">
                                <div className="category-header">
                                    <span className="category-name">{getCategoryName(category)}</span>
                                    <span className="category-points">{points} points</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${Math.min((points / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>What would you like to do?</h2>
                    <div className="action-buttons">
                        <Link to="/practice" className="btn btn-primary">
                            <FaBrain /> Start Practice
                        </Link>
                        <Link to="/quizzes" className="btn btn-secondary">
                            <FaTrophy /> Take a Quiz
                        </Link>
                        <Link to="/leaderboard" className="btn btn-outline">
                            <FaChartLine /> View Leaderboard
                        </Link>
                    </div>
                </div>

                {/* Recent Scores */}
                {stats?.stats?.recentScores && stats.stats.recentScores.length > 0 && (
                    <div className="recent-scores card">
                        <h2>Recent Activity</h2>
                        <div className="scores-list">
                            {stats.stats.recentScores.map((score, index) => (
                                <div key={index} className="score-item">
                                    <div className="score-info">
                                        <h4>{score.quiz?.title}</h4>
                                        <p className="score-category">{getCategoryName(score.quiz?.category)}</p>
                                    </div>
                                    <div className="score-result">
                                        <span className={`score-badge ${score.passed ? 'passed' : 'failed'}`}>
                                            {score.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
