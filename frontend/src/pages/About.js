import React, { useState, useEffect } from 'react';
import '../styles/About.css';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { aboutAPI } from '../services/api';
import profileImg from '../assets/images/anime_avatar.png';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await aboutAPI.get();
      setAbout(response.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="about-page">
      <section className="section">
        <div className="container">
          <div className="about-content">

            {/* LEFT CONTENT */}
            <div className="about-text">
              <h1 className="section-title">About Me</h1>

              <div className="about-description">
                {about?.content || (
                  <>
                    <p>
                      I'm a passionate full-stack developer with expertise in
                      modern web technologies.
                    </p>
                    <p>
                      I love building clean, scalable, and user-friendly
                      applications with AI integration.
                    </p>
                  </>
                )}
              </div>

              <div className="skills-section">
                <h3>Technologies & Skills</h3>

                <div className="skills-grid">
                  <div className="skill-category">
                    <h4>Frontend</h4>
                    <div className="skills-list">
                      <span className="pill-btn">React.js</span>
                      <span className="pill-btn">JavaScript</span>
                      <span className="pill-btn">HTML / CSS</span>
                      <span className="pill-btn">Tailwind</span>
                    </div>
                  </div>

                  <div className="skill-category">
                    <h4>Backend</h4>
                    <div className="skills-list">
                      <span className="pill-btn">Node.js</span>
                      <span className="pill-btn">Express</span>
                      <span className="pill-btn">MongoDB</span>
                    </div>
                  </div>

                  <div className="skill-category">
                    <h4>Tools</h4>
                    <div className="skills-list">
                      <span className="pill-btn">Git</span>
                      <span className="pill-btn">VS Code</span>
                      <span className="pill-btn">ChatGPT</span>
                      <span className="pill-btn">Canva</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="about-image">
              <div className="avatar-wrapper">
                <img src={profileImg} alt="Profile Avatar" />
                <span className="code-icon">&lt;/&gt;</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
