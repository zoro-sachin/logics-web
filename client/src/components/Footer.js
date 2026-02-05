import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaBrain } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="navbar-logo mb-md d-inline-block">
                        <span className="logo-icon"><FaBrain /></span>
                        <span className="logo-text text-white">ZORO<span className="text-gradient">.TECH</span></span>
                    </Link>
                    <p className="text-secondary">Pioneering the next generation of cognitive development through curated logical puzzles and timed sprints.</p>
                    <div className="social-links">
                        <a href="#" className="glass-icon"><FaGithub /></a>
                        <a href="#" className="glass-icon"><FaTwitter /></a>
                        <a href="#" className="glass-icon"><FaLinkedin /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Platform</h3>
                    <ul>
                        <li><Link to="/practice">Practice</Link></li>
                        <li><Link to="/quizzes">Quizzes</Link></li>
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Zoro.tech. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
