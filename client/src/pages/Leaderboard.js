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
                <div className="page-header">
                    <h1><FaTrophy className="trophy-icon" /> Global Leaderboard</h1>
                    <p>Top performers in Logic & Reasoning</p>
                </div>

                <div className="leaderboard-card card">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Badge</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((user) => (
                                <tr key={user.rank} className={user.rank <= 3 ? 'top-rank' : ''}>
                                    <td className="rank-cell">
                                        {user.rank === 1 && <FaMedal color="#FFD700" />}
                                        {user.rank === 2 && <FaMedal color="#C0C0C0" />}
                                        {user.rank === 3 && <FaMedal color="#CD7F32" />}
                                        <span className="rank-number">#{user.rank}</span>
                                    </td>
                                    <td className="user-cell">
                                        <FaUserCircle className="user-avatar" />
                                        {user.name}
                                    </td>
                                    <td><span className={`badge badge-${user.badge.toLowerCase().includes('master') ? 'expert' : 'intermediate'}`}>{user.badge}</span></td>
                                    <td className="score-cell">{user.score}</td>
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
