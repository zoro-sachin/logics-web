import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaRocket, FaTrophy, FaChartLine } from 'react-icons/fa';
import Footer from '../components/Footer';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="hero-bg-glow"></div>
                <div className="container">
                    <div className="hero-content fade-in">
                        <div className="badge badge-primary mb-md">V2.0 is Live</div>
                        <h1 className="hero-title">
                            Evolve Your <span className="text-gradient">Logical Intelligence</span>
                        </h1>
                        <p className="hero-subtitle">
                            Master the art of problem solving through expert-curated challenges and
                            real-time cognitive analytics. No more AI genericism. Just pure logic.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started Free <FaRocket />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Resume Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section section-padding">
                <div className="container">
                    <div className="text-center mb-xl">
                        <h2 className="section-title h1 mb-sm">Engineered for Excellence</h2>
                        <p className="text-secondary max-w-md mx-auto">
                            A scientific approach to cognitive development, focusing on structured
                            progression and deep learning.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        <div className="glass-card feature-card">
                            <div className="feature-icon-wrapper">
                                <FaBrain />
                            </div>
                            <h3>Adaptive Paths</h3>
                            <p>Our algorithms track your precision and speed to calibrate the perfect difficulty curve.</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon-wrapper">
                                <FaChartLine />
                            </div>
                            <h3>Cognitive Analytics</h3>
                            <p>Visualise your growth with heatmaps and radar charts tracking 5 core logic domains.</p>
                        </div>

                        <div className="glass-card feature-card">
                            <div className="feature-icon-wrapper">
                                <FaTrophy />
                            </div>
                            <h3>Global Rankings</h3>
                            <p>Compete with a global community of thinkers and earn prestige through consistent mastery.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="glass stats-grid">
                        <div className="stat-item">
                            <h2 className="stat-number">500+</h2>
                            <p className="stat-label">Curated Questions</p>
                        </div>
                        <div className="stat-item border-x">
                            <h2 className="stat-number">10k+</h2>
                            <p className="stat-label">Analytical Sprints</p>
                        </div>
                        <div className="stat-item">
                            <h2 className="stat-number">99.9%</h2>
                            <p className="stat-label">Uptime Stability</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
