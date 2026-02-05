import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaBrain, FaSignOutAlt, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon"><FaBrain /></span>
                    <span className="logo-text">ZORO<span className="text-gradient">.TECH</span></span>
                </Link>

                <div className="navbar-links">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                    <Link to="/practice" className={`nav-link ${isActive('/practice') ? 'active' : ''}`}>Practice</Link>
                    <Link to="/games" className={`nav-link ${isActive('/games') ? 'active' : ''}`}>Games</Link>
                    <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}>Quizzes</Link>
                    <Link to="/knowledge" className={`nav-link ${isActive('/knowledge') ? 'active' : ''}`}>Knowledge</Link>
                    <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>Ranks</Link>
                </div>

                <div className="user-menu">
                    <button onClick={toggleTheme} className="btn-icon theme-toggle" title="Toggle Theme">
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                    {user ? (
                        <>
                            <div className="user-badge glass">
                                <FaUserCircle />
                                <span>{user.username}</span>
                            </div>
                            <button onClick={logout} className="btn-icon" title="Sign Out">
                                <FaSignOutAlt />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
