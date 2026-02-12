import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/projects/ProjectCard';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { projectsAPI } from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    demoUrl: '',
    githubUrl: '',
    image: ''
  });
  const navigate = useNavigate();

  // Wrap fetchProjects in useCallback to avoid infinite re-renders
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    // Remove the unused user state assignment since we don't need it
    fetchProjects();
  }, [navigate, fetchProjects]); // Added fetchProjects to dependencies

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }
      
      setShowProjectModal(false);
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        githubUrl: '',
        image: ''
      });
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      image: project.image || ''
    });
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="section">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="section-title">Dashboard</h1>
            <div className="dashboard-actions">
              <button 
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    title: '',
                    description: '',
                    technologies: '',
                    demoUrl: '',
                    githubUrl: '',
                    image: ''
                  });
                  setShowProjectModal(true);
                }}
                className="btn btn-primary"
              >
                Add Project
              </button>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>

          <div className="projects-section">
            <h2>Projects Management</h2>
            {projects.length === 0 ? (
              <div className="empty-state">
                <h3>No projects found</h3>
                <p>Click "Add Project" to create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    isAdmin={true}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleProjectSubmit} className="project-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Project Title"
              value={projectForm.title}
              onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Project Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              required
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Technologies (comma separated, e.g., React, Node.js, MongoDB)"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="url"
              placeholder="Demo URL"
              value={projectForm.demoUrl}
              onChange={(e) => setProjectForm({...projectForm, demoUrl: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="url"
              placeholder="GitHub URL"
              value={projectForm.githubUrl}
              onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="url"
              placeholder="Image URL"
              value={projectForm.image}
              onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary full-width">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;