import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, submitGame } from '../../services/gameService';
import './games.css';

const MemoryMatrix = ({ difficulty = 'medium' }) => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('loading'); // loading, memorize, play, result
    const [config, setConfig] = useState(null);
    const [grid, setGrid] = useState([]);
    const [targetTiles, setTargetTiles] = useState([]);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        initializeGame();
    }, [difficulty]);

    const initializeGame = async () => {
        try {
            const response = await startGame('memory-matrix', difficulty);
            const gameConfig = response.config;
            setConfig(gameConfig);

            // Create grid
            const gridSize = gameConfig.gridSize;
            const totalCells = gridSize * gridSize;
            const newGrid = Array(totalCells).fill(false);

            // Select random tiles to highlight
            const targets = [];
            while (targets.length < gameConfig.tiles) {
                const randomIndex = Math.floor(Math.random() * totalCells);
                if (!targets.includes(randomIndex)) {
                    targets.push(randomIndex);
                }
            }

            setTargetTiles(targets);
            setGrid(newGrid);
            setGameState('memorize');
            setStartTime(Date.now());

            // Show pattern for flashTime, then hide
            setTimeout(() => {
                setGameState('play');
            }, gameConfig.flashTime);

        } catch (error) {
            console.error('Failed to initialize game:', error);
            alert('Failed to start game. Please try again.');
        }
    };

    const handleTileClick = (index) => {
        if (gameState !== 'play') return;

        if (selectedTiles.includes(index)) {
            setSelectedTiles(selectedTiles.filter(i => i !== index));
        } else {
            setSelectedTiles([...selectedTiles, index]);
        }
    };

    const handleSubmit = async () => {
        if (gameState !== 'play') return;

        // Calculate score
        const correct = selectedTiles.filter(tile => targetTiles.includes(tile)).length;
        const incorrect = selectedTiles.filter(tile => !targetTiles.includes(tile)).length;
        const missed = targetTiles.filter(tile => !selectedTiles.includes(tile)).length;

        const maxScore = targetTiles.length * 10;
        const finalScore = Math.max(0, (correct * 10) - (incorrect * 5));
        const accuracy = targetTiles.length > 0 ? (correct / targetTiles.length) * 100 : 0;
        const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

        setScore(finalScore);
        setGameState('result');

        // Submit to backend
        try {
            await submitGame({
                gameType: 'memory-matrix',
                difficulty,
                score: finalScore,
                maxScore,
                timeSpent,
                gameData: {
                    correct,
                    incorrect,
                    missed,
                    gridSize: config.gridSize
                }
            });
        } catch (error) {
            console.error('Failed to submit game:', error);
        }
    };

    const renderGrid = () => {
        if (!config) return null;

        const gridSize = config.gridSize;
        const gridStyle = {
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
        };

        return (
            <div className="memory-grid" style={gridStyle}>
                {grid.map((_, index) => {
                    const isTarget = targetTiles.includes(index);
                    const isSelected = selectedTiles.includes(index);
                    const showTarget = gameState === 'memorize' || gameState === 'result';

                    let tileClass = 'memory-tile';
                    if (gameState === 'memorize' && isTarget) {
                        tileClass += ' highlight';
                    } else if (gameState === 'play' && isSelected) {
                        tileClass += ' selected';
                    } else if (gameState === 'result') {
                        if (isTarget && isSelected) {
                            tileClass += ' correct';
                        } else if (isTarget && !isSelected) {
                            tileClass += ' missed';
                        } else if (!isTarget && isSelected) {
                            tileClass += ' wrong';
                        }
                    }

                    return (
                        <div
                            key={index}
                            className={tileClass}
                            onClick={() => handleTileClick(index)}
                        />
                    );
                })}
            </div>
        );
    };

    if (gameState === 'loading') {
        return <div className="game-loading">Loading game...</div>;
    }

    return (
        <div className="memory-matrix-game">
            <div className="game-header">
                <h2>Memory Matrix</h2>
                <div className={`difficulty-badge badge-${difficulty}`}>{difficulty}</div>
            </div>

            {gameState === 'memorize' && (
                <div className="game-instruction">
                    <p className="pulse">Memorise the pattern...</p>
                </div>
            )}

            {gameState === 'play' && (
                <div className="game-instruction">
                    <p>Click the tiles that were highlighted!</p>
                    <p className="text-secondary">Selected: {selectedTiles.length} / {targetTiles.length}</p>
                </div>
            )}

            {gameState === 'result' && (
                <div className="game-result">
                    <h3>Game Complete!</h3>
                    <div className="score-display">
                        <div className="score-number">{score}</div>
                        <div className="score-label">points</div>
                    </div>
                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value correct">{selectedTiles.filter(t => targetTiles.includes(t)).length}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value wrong">{selectedTiles.filter(t => !targetTiles.includes(t)).length}</span>
                            <span className="stat-label">Wrong</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value missed">{targetTiles.filter(t => !selectedTiles.includes(t)).length}</span>
                            <span className="stat-label">Missed</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="game-board">
                {renderGrid()}
            </div>

            <div className="game-actions">
                {gameState === 'play' && (
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit Answer
                    </button>
                )}
                {gameState === 'result' && (
                    <>
                        <button className="btn btn-primary" onClick={initializeGame}>
                            Play Again
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/games')}>
                            Back to Games
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MemoryMatrix;
