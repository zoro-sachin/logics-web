import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBookOpen } from 'react-icons/fa';

/**
 * Journey Sidebar
 * Displays the course modules and chapters similar to Coddy.
 */
const JourneySidebar = ({ modules, courseId }) => {
    const navigate = useNavigate();
    const { sectionId } = useParams();

    return (
        <div className="journey-sidebar">
            <div className="sidebar-header">
                <h3>JavaScript Logic</h3>
                <p className="progress-text">15% Completed</p>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '15%' }}></div>
                </div>
            </div>

            <div className="sidebar-content">
                {modules.map((module, mIndex) => (
                    <div key={mIndex} className="module-section">
                        <h4 className="module-title">{module.title}</h4>
                        <div className="chapter-list">
                            {module.chapters.map((chapter, cIndex) => {
                                const isActive = chapter.id === sectionId;
                                const isLocked = chapter.isLocked;

                                return (
                                    <div
                                        key={chapter.id}
                                        className={`chapter-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                        onClick={() => !isLocked && navigate(`/journey/${courseId}/${chapter.id}`)}
                                    >
                                        <div className="chapter-icon">
                                            {chapter.completed ? <FaCheckCircle className="icon-completed" /> :
                                                isLocked ? <FaLock className="icon-locked" /> :
                                                    <FaBookOpen className="icon-current" />}
                                        </div>
                                        <span className="chapter-title">{chapter.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JourneySidebar;
