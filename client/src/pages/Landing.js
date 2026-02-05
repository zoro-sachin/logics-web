import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaChartLine, FaTrophy, FaCertificate, FaLightbulb } from 'react-icons/fa';
import Footer from '../components/Footer';
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
                            Master the Art of <span className="text-gradient">Logical Thinking</span>
                        </h1>
                        <p className="hero-subtitle">
                            Challenge your mind with expert-curated puzzles, daily streaks, and personalized learning paths designed for the modern logical thinker.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary btn-large">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-outline-white btn-large">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Elevate Your IQ</h2>
                        <p className="section-subtitle">Everything you need to sharpen your cognitive abilities in one place.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaLightbulb />
                            </div>
                            <h3>Dynamic Challenges</h3>
                            <p>Our curriculum scales in complexity as you improve, ensuring you're always in the 'flow' state.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaBrain />
                            </div>
                            <h3>Adaptive Learning</h3>
                            <p>Question selection that adjusts to your skill level, providing the perfect balance of challenge and growth.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaChartLine />
                            </div>
                            <h3>Deep Analytics</h3>
                            <p>Visualize your cognitive growth with detailed radar charts and activity heatmaps updated in real-time.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaTrophy />
                            </div>
                            <h3>Competitive Edge</h3>
                            <p>Climb the global leaderboard and see how your logical deduction skills rank against the best minds.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaCertificate />
                            </div>
                            <h3>Proof of Mastery</h3>
                            <p>Earn verifiable certificates as you complete modules and reach expert levels in various logic domains.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaBrain />
                            </div>
                            <h3>Modular Learning</h3>
                            <p>From number sequences to complex puzzles—explore specialized courses tailored to your goals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container text-center">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join a community of thousands improving their problem-solving skills every day.</p>
                        <Link to="/register" className="btn btn-primary btn-large">
                            Start Practicing Now
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
