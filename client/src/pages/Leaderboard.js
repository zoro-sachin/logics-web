import React, { useState } from 'react';
import './Leaderboard.css'; // We'll reuse Quizzes styling or create new if needed
import { FaTrophy, FaMedal, FaUserCircle } from 'react-icons/fa';

const Leaderboard = () => {
    // Mock Data
    const [leaders] = useState([
        { rank: 1, name: "Alice Skywalker", score: 2450, badge: "Logic Master" },
        { rank: 2, name: "Bob The Builder", score: 2300, badge: "Pattern Pro" },
        { rank: 3, name: "Charlie Chaplin", score: 2150, badge: "Puzzle Solver" },
        { rank: 4, name: "David Bowie", score: 1900, badge: "Rookie" },
        { rank: 5, name: "Eve Polastri", score: 1850, badge: "Rookie" },
    ]);

    return (
        <div className="leaderboard-page fade-in">
            <div className="container">
                <div className="page-header text-center mb-xl">
                    <h1 className="text-gradient h1"><FaTrophy className="trophy-icon" /> Global Hall of Fame</h1>
                    <p className="text-secondary">The world's most disciplined logical minds.</p>
                </div>

                <div className="leaderboard-container glass-card">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Master</th>
                                <th>Specialization</th>
                                <th>Cognitive XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((user) => (
                                <tr key={user.rank} className={`leader-row ${user.rank <= 3 ? 'top-tier' : ''}`}>
                                    <td className="rank-cell">
                                        <div className="rank-badge">
                                            {user.rank === 1 && <FaMedal color="#fbbf24" size={24} />}
                                            {user.rank === 2 && <FaMedal color="#94a3b8" size={20} />}
                                            {user.rank === 3 && <FaMedal color="#d97706" size={18} />}
                                            <span className="rank-num">#{user.rank}</span>
                                        </div>
                                    </td>
                                    <td className="user-cell">
                                        <div className="user-info">
                                            <FaUserCircle className="user-avatar" />
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge ${user.rank === 1 ? 'badge-primary' : 'badge-primary'}`}>{user.badge}</span></td>
                                    <td className="score-cell">{user.score.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
