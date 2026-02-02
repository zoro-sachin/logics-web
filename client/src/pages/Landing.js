import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaChartLine, FaTrophy, FaCertificate, FaLightbulb } from 'react-icons/fa';
import './Landing.css';

/**
 * Landing Page
 */
const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Master Logical Thinking
                        </h1>
                        <p className="hero-subtitle">
                            Improve your reasoning and problem-solving skills with AI-powered practice and personalized learning
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary btn-large">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-large">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why Choose LogicMaster?</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaLightbulb />
                            </div>
                            <h3>AI-Powered Hints</h3>
                            <p>Get instant, intelligent hints that guide you toward the solution without giving away the answer</p>
                        </div>

                        <div className="feature-card">
                            <FaBrain />
                            <h3>Dynamic Questions</h3>
                            <p>Fresh AI-generated questions every time you practice across multiple categories</p>
                        </div>

                        <div className="feature-card">
                            <FaChartLine />
                            <h3>Track Progress</h3>
                            <p>Monitor your improvement across different categories and skill levels</p>
                        </div>

                        <div className="feature-card">
                            <FaTrophy />
                            <h3>Compete & Learn</h3>
                            <p>See how you rank against others on the leaderboard</p>
                        </div>

                        <div className="feature-card">
                            <FaCertificate />
                            <h3>Earn Certificates</h3>
                            <p>Get recognized for your achievements with downloadable certificates</p>
                        </div>

                        <div className="feature-card">
                            <FaBrain />
                            <h3>Multiple Categories</h3>
                            <p>Number series, patterns, puzzles, aptitude, and reasoning questions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container text-center">
                    <h2>Ready to Boost Your Logical Thinking?</h2>
                    <p>Join thousands of learners improving their problem-solving skills</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Start Learning Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
