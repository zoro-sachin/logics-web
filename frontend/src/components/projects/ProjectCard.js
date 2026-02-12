import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete, isAdmin = false }) => {
  return (
    <div className="project-card glass fade-in-up">
      <div className="project-image">
        {project.image && (
          <img src={project.image} alt={project.title} />
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tech">
          {project.technologies?.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="project-links">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="pill-btn primary small">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="pill-btn outline small">
              GitHub
            </a>
          )}
        </div>

        {isAdmin && (
          <div className="project-actions">
            <button onClick={() => onEdit(project)} className="pill-btn outline small">
              Edit
            </button>
            <button onClick={() => onDelete(project._id)} className="pill-btn primary small" style={{ background: '#dc3545', borderColor: '#dc3545' }}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;