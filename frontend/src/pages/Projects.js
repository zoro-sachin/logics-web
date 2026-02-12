import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/projects/ProjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { projectsAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p style={{ marginTop: '1rem' }}>Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="error-message text-center">
            <p>{error}</p>
            <button onClick={fetchProjects} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle text-center">
            Here are some of the projects I've worked on. Each project represents
            a unique challenge and learning experience.
          </p>

          {projects.length > 0 ? (
            <div className="grid grid-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>Check back later for updates!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;