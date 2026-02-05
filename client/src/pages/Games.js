import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaClock, FaPuzzlePiece, FaTrophy } from 'react-icons/fa';
import { getGameHistory, getGameStats } from '../services/gameService';
import MemoryMatrix from '../components/games/MemoryMatrix';
import PatternRecognition from '../components/games/PatternRecognition';
import TimeAttackLogic from '../components/games/TimeAttackLogic';
import './Games.css';

const Games = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');
    const [bestScores, setBestScores] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBestScores();
    }, []);

    const fetchBestScores = async () => {
        try {
            const response = await getGameStats();
            const scores = {};
            response.data.forEach(stat => {
                scores[stat._id] = stat.bestScore;
            });
            setBestScores(scores);
        } catch (error) {
            console.error('Failed to fetch best scores:', error);
        } finally {
            setLoading(false);
        }
    };

    const games = [
        {
            id: 'memory-matrix',
            name: 'Memory Matrix',
            description: 'Test your visual memory by recreating patterns on a grid',
            icon: FaBrain,
            color: '#6366f1',
            component: MemoryMatrix
        },
        {
            id: 'pattern-recognition',
            name: 'Pattern Recognition',
            description: 'Identify the next element in visual and numerical sequences',
            icon: FaPuzzlePiece,
            color: '#8b5cf6',
            component: PatternRecognition
        },
        {
            id: 'time-attack',
            name: 'Time-Attack Logic',
            description: 'Solve rapid-fire logic questions before time runs out',
            icon: FaClock,
            color: '#ec4899',
            component: TimeAttackLogic
        }
    ];

    if (selectedGame) {
        const GameComponent = games.find(g => g.id === selectedGame).component;
        return (
            <div className="games-page">
                <div className="game-container">
                    <button
                        className="back-button"
                        onClick={() => setSelectedGame(null)}
                    >
                        ← Back to Games
                    </button>
                    <GameComponent difficulty={difficulty} />
                </div>
            </div>
        );
    }

    return (
        <div className="games-page">
            <div className="games-header">
                <div className="header-content">
                    <h1>Logic Games</h1>
                    <p className="subtitle">
                        Challenge your mind with interactive games designed to sharpen your logical thinking
                    </p>
                </div>
                <div className="difficulty-selector">
                    <span className="selector-label">Difficulty:</span>
                    <div className="difficulty-buttons">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                                onClick={() => setDifficulty(level)}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="games-grid">
                {games.map(game => {
                    const Icon = game.icon;
                    const bestScore = bestScores[game.id] || 0;

                    return (
                        <div
                            key={game.id}
                            className="game-card glass-card"
                            onClick={() => setSelectedGame(game.id)}
                        >
                            <div className="game-card-header">
                                <div
                                    className="game-icon"
                                    style={{ backgroundColor: game.color }}
                                >
                                    <Icon />
                                </div>
                                {bestScore > 0 && (
                                    <div className="best-score">
                                        <FaTrophy className="trophy-icon" />
                                        <span>{bestScore}</span>
                                    </div>
                                )}
                            </div>
                            <h3>{game.name}</h3>
                            <p>{game.description}</p>
                            <button className="play-button">
                                Play Now →
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="games-info">
                <div className="info-card glass-card">
                    <h3>How It Works</h3>
                    <ul>
                        <li>Select your preferred difficulty level</li>
                        <li>Choose a game to play</li>
                        <li>Complete challenges to earn points</li>
                        <li>Track your progress and compete on leaderboards</li>
                    </ul>
                </div>
                <div className="info-card glass-card">
                    <h3>Scoring System</h3>
                    <ul>
                        <li><strong>Easy:</strong> 10-15 points per correct answer</li>
                        <li><strong>Medium:</strong> 20-25 points per correct answer</li>
                        <li><strong>Hard:</strong> 30-40 points per correct answer</li>
                        <li><strong>Streak Bonus:</strong> Multiply your score with consecutive correct answers</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Games;
