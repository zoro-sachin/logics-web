import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaBolt, FaTrophy, FaFire, FaChartPie, FaArrowRight, FaGamepad, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/userService';
import { getOverview, getStrengths, getRecentActivity } from '../services/analyticsService';
import { getGameStats } from '../services/gameService';
import LoadingSpinner from '../components/LoadingSpinner';
import XPProgressBar from '../components/gamification/XPProgressBar';
import StreakIndicator from '../components/gamification/StreakIndicator';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import StrengthsRadar from '../components/analytics/StrengthsRadar';
import '../components/analytics/Analytics.css';
import '../components/gamification/Gamification.css';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [gameStats, setGameStats] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [strengthsData, setStrengthsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, analyticsRes, gamesRes, activityRes, strengthsRes] = await Promise.all([
                    getStats(),
                    getOverview(),
                    getGameStats(),
                    getRecentActivity(5),
                    getStrengths()
                ]);

                setStats(statsRes.data);
                setAnalytics(analyticsRes.data);
                setGameStats(gamesRes.data || []);
                setRecentActivity(activityRes.data || []);
                setStrengthsData(strengthsRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading || !user) return <LoadingSpinner />;

    const formatActivityTime = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffMs = now - activityDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="dashboard-page fade-in">
            <div className="container">
                <header className="dashboard-header mb-lg">
                    <div className="header-left">
                        <h1 className="mb-sm">Welcome back, <span className="text-gradient">@{user.username}</span></h1>
                        <p className="text-secondary">Your cognitive journey is progressing steadily.</p>
                    </div>
                    <div className="header-right glass p-sm">
                        <StreakIndicator streak={user.streak || 0} />
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Main Stats */}
                    <div className="main-stats-section">
                        <div className="glass-card level-card mb-md">
                            <div className="level-info">
                                <span className="badge badge-primary">Level {user.currentLevel || 1}</span>
                                <h3 className="mt-sm">{analytics?.level || 'Logical Adventurer'}</h3>
                            </div>
                            <XPProgressBar
                                currentXp={user.xp || 0}
                                level={user.currentLevel || 1}
                            />
                        </div>

                        <div className="grid grid-3 mb-md">
                            <div className="glass-card stat-tile">
                                <FaBolt className="tile-icon pulse" />
                                <div>
                                    <h4 className="text-secondary">Total Points</h4>
                                    <h2 className="stat-value">{analytics?.totalPoints || 0}</h2>
                                </div>
                            </div>
                            <div className="glass-card stat-tile">
                                <FaGamepad className="tile-icon" style={{ color: '#8b5cf6' }} />
                                <div>
                                    <h4 className="text-secondary">Games Played</h4>
                                    <h2 className="stat-value">{analytics?.totalGames || 0}</h2>
                                </div>
                            </div>
                            <div className="glass-card stat-tile">
                                <FaTrophy className="tile-icon gold" />
                                <div>
                                    <h4 className="text-secondary">Accuracy</h4>
                                    <h2 className="stat-value">{analytics?.accuracy || 0}%</h2>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions mb-md">
                            <Link to="/practice" className="action-card glass-card">
                                <div className="action-icon purple"><FaBrain /></div>
                                <div className="action-meta">
                                    <h3>Daily Training</h3>
                                    <p>Guided logic exercises</p>
                                </div>
                                <FaArrowRight className="arrow" />
                            </Link>

                            <Link to="/games" className="action-card glass-card">
                                <div className="action-icon blue"><FaGamepad /></div>
                                <div className="action-meta">
                                    <h3>Logic Games</h3>
                                    <p>Interactive challenges</p>
                                </div>
                                <FaArrowRight className="arrow" />
                            </Link>

                            <Link to="/quizzes" className="action-card glass-card">
                                <div className="action-icon orange"><FaFire /></div>
                                <div className="action-meta">
                                    <h3>Knowledge Sprint</h3>
                                    <p>Timed performance test</p>
                                </div>
                                <FaArrowRight className="arrow" />
                            </Link>

                            <Link to="/knowledge" className="action-card glass-card">
                                <div className="action-icon green"><FaBook /></div>
                                <div className="action-meta">
                                    <h3>Knowledge Vault</h3>
                                    <p>Learn strategies</p>
                                </div>
                                <FaArrowRight className="arrow" />
                            </Link>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-card">
                            <h3 className="mb-md">Recent Activity</h3>
                            {recentActivity.length > 0 ? (
                                <div className="activity-list">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-icon">
                                                {activity.type === 'game' ? <FaGamepad /> : <FaBrain />}
                                            </div>
                                            <div className="activity-details">
                                                {activity.type === 'game' ? (
                                                    <>
                                                        <p className="activity-title">
                                                            Played {activity.gameType.replace('-', ' ')}
                                                        </p>
                                                        <p className="activity-meta">
                                                            Score: {activity.score} • {activity.difficulty}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="activity-title">
                                                            Completed {activity.category} quiz
                                                        </p>
                                                        <p className="activity-meta">
                                                            Accuracy: {activity.percentage}% • {activity.difficulty}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <span className="activity-time">
                                                {formatActivityTime(activity.createdAt)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary">No recent activity. Start practicing!</p>
                            )}
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="analytics-section">
                        <div className="glass-card mb-md">
                            <h3 className="mb-lg flex align-center gap-sm">
                                <FaChartPie className="text-primary" /> Skill Distribution
                            </h3>
                            {strengthsData?.radarData ? (
                                <StrengthsRadar data={strengthsData.radarData} />
                            ) : (
                                <StrengthsRadar data={user.progress} />
                            )}
                        </div>

                        {gameStats.length > 0 && (
                            <div className="glass-card mb-md">
                                <h3 className="mb-md">Game Performance</h3>
                                <div className="game-stats-list">
                                    {gameStats.map((stat, index) => (
                                        <div key={index} className="game-stat-item">
                                            <div className="game-stat-name">
                                                {stat._id.replace('-', ' ')}
                                            </div>
                                            <div className="game-stat-values">
                                                <span className="best-score">Best: {stat.bestScore}</span>
                                                <span className="avg-accuracy">{Math.round(stat.avgAccuracy)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="glass-card">
                            <h3 className="mb-lg">Activity Pulse</h3>
                            <ActivityHeatmap data={stats?.recentActivity || []} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
