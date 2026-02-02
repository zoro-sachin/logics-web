import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBrain, FaTrophy, FaCertificate, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand">
                    <FaBrain className="brand-icon" />
                    <span>LogicMaster</span>
                </Link>

                {isAuthenticated && (
                    <div className="navbar-links">
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                        <Link to="/practice" className="nav-link">
                            Practice
                        </Link>
                        <Link to="/quizzes" className="nav-link">
                            Quizzes
                        </Link>
                        <Link to="/leaderboard" className="nav-link">
                            <FaTrophy /> Leaderboard
                        </Link>
                        <Link to="/certificates" className="nav-link">
                            <FaCertificate /> Certificates
                        </Link>

                        <div className="navbar-user">
                            <span className="user-info">
                                <FaUser /> {user?.username}
                            </span>
                            <button onClick={handleLogout} className="btn-logout">
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
