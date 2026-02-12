import React from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';
import profileImg from '../assets/images/anime_avatar.png';

const Home = () => {
  const [loading, setLoading] = React.useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div className={`home-container light-theme ${loading ? 'hidden' : 'visible'}`}>
        {/* Massive Hero Section */}
        <section className="hero-section">
          <div className="hero-content-main">
            <div className="hero-text-large">
              <h1 className="fade-in-up">  AI integrated Fullstack <br /> Developer</h1>
              <p className="subtitle fade-in-up delay-1">Creating amazing web applications with code & passion.</p>
              <div className="hero-cta fade-in-up delay-2">
                <Link to="/projects" className="pill-btn primary">View Projects</Link>
                <Link to="/contact" className="pill-btn outline">Contact Me</Link>
              </div>
            </div>
            <div className="profile-display fade-in-up delay-2">
              <img src={profileImg} alt="Profile" className="hero-profile-img" />
            </div>
          </div>
        </section>

        {/* Bento Grid Layout - Clean Light Theme */}
        <section className="bento-section">
          <div className="bento-grid">

            <div className="bento-card about-card">
              <div className="card-header">
                <span className="card-icon">👋</span>
                <span className="card-label">About Me</span>
              </div>
              <h2>I'm Sachin.s</h2>
              <p>B.Tech IT student at PTLEE CNCET. I truly love building web applications and exploring new technologies. I'm also an NSE certified Data Analyst.</p>
              <div className="tech-stack-mini">
                <span>React</span>
                <span>Node.js</span>
                <span>Python</span>
              </div>
            </div>

            <div className="bento-card projects-card">
              <div className="card-header">
                <span className="card-icon">🚀</span>
                <span className="card-label">Featured Work</span>
              </div>
              <div className="project-list-clean">
                <div className="project-item">
                  <div className="project-info">
                    <h3>TODO App</h3>
                    <span className="tech-tag">React</span>
                  </div>
                  <Link to="/projects" className="arrow-link">→</Link>
                </div>
                <div className="project-item">
                  <div className="project-info">
                    <h3>Portfolio</h3>
                    <span className="tech-tag">React</span>
                  </div>
                  <Link to="/projects" className="arrow-link">→</Link>
                </div>
              </div>
            </div>

            <div className="bento-card contact-card">
              <div className="card-header">
                <span className="card-icon">📬</span>
                <span className="card-label">Get in Touch</span>
              </div>
              <h3>Let's work together</h3>
              <Link to="/contact" className="pill-btn primary small">Contact</Link>
            </div>

          </div>
        </section>
      </div>
    </>
  );
};

export default Home;