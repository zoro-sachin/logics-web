import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <h2 className="logo">Zoro<span>.tech</span></h2>
                    <p>Empowering minds through AI-driven logical challenges and personalized learning paths.</p>
                    <div className="social-links">
                        <a href="#"><FaGithub /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedin /></a>
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
