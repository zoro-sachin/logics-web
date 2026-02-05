import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBookOpen } from 'react-icons/fa';
import './Journey.css';

/**
 * Journey Sidebar
 * Displays the course modules and chapters similar to Coddy.
 */
const JourneySidebar = ({ modules, courseId }) => {
    const navigate = useNavigate();
    const { sectionId } = useParams();

    return (
        <div className="journey-sidebar-v2">
            <div className="sidebar-header-v2">
                <div className="course-badge">Course</div>
                <h2>Logic Fundamentals</h2>
                <div className="journey-progress-mini">
                    <div className="progress-info">
                        <span>Progress</span>
                        <span>15%</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: '15%' }}></div>
                    </div>
                </div>
            </div>

            <div className="sidebar-content">
                {modules.map((module, mIndex) => (
                    <div key={mIndex} className="module-group">
                        <div className="module-header-v2">
                            <span className="module-count">0{mIndex + 1}</span>
                            <span className="module-label">Module</span>
                        </div>
                        <h4 className="module-title-v2">{module.title}</h4>
                        <div className="chapter-stack">
                            {module.chapters.map((chapter, cIndex) => {
                                const isActive = chapter.id === sectionId;
                                const isLocked = chapter.isLocked;

                                return (
                                    <div
                                        key={chapter.id}
                                        className={`chapter-node ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${chapter.completed ? 'done' : ''}`}
                                        onClick={() => !isLocked && navigate(`/journey/${courseId}/${chapter.id}`)}
                                    >
                                        <div className="chapter-status">
                                            {chapter.completed ? <FaCheckCircle /> : isLocked ? <FaLock /> : <div className="dot" />}
                                        </div>
                                        <div className="chapter-info-v2">
                                            <span className="chapter-name">{chapter.title}</span>
                                            {isActive && <span className="active-marker">Now Studying</span>}
                                        </div>
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
