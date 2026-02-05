import React, { useState } from 'react';
import JourneySidebar from './JourneySidebar';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Journey.css';

/**
 * Journey Layout
 * Split-screen layout: Sidebar (left) + Content (right)
 */
const JourneyLayout = ({ children, modules, courseId }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="journey-layout">
            {/* Mobile Toggle */}
            <button
                className="sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <aside className={`journey-aside ${isSidebarOpen ? 'open' : 'closed'}`}>
                <JourneySidebar modules={modules} courseId={courseId} />
            </aside>

            {/* Main Content */}
            <main className="journey-main">
                {children}
            </main>
        </div>
    );
};

export default JourneyLayout;
