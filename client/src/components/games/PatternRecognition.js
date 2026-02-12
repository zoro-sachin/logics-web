import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, submitGame } from '../../services/gameService';
import './games.css';

const PatternRecognition = ({ difficulty = 'medium' }) => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('loading');
    const [config, setConfig] = useState(null);
    const [pattern, setPattern] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [totalRounds] = useState(5);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        initializeGame();
    }, [difficulty]);

    const initializeGame = async () => {
        try {
            const response = await startGame('pattern-recognition', difficulty);
            setConfig(response.config);
            setStartTime(Date.now());
            generatePattern(response.config);
        } catch (error) {
            console.error('Failed to initialize game:', error);
            alert('Failed to start game. Please try again.');
        }
    };

    const generatePattern = (gameConfig) => {
        const patternTypes = ['number', 'shape', 'color'];
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

        let newPattern = [];
        let answer = null;

        if (patternType === 'number') {
            // Generate number sequence
            const start = Math.floor(Math.random() * 10) + 1;
            const step = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < gameConfig.patternLength; i++) {
                newPattern.push(start + (i * step));
            }
            answer = start + (gameConfig.patternLength * step);
        } else if (patternType === 'shape') {
            // Generate shape sequence
            const shapes = ['●', '■', '▲', '◆', '★'];
            const sequenceLength = Math.min(3, gameConfig.patternLength);
            const sequence = [];
            for (let i = 0; i < sequenceLength; i++) {
                sequence.push(shapes[i % shapes.length]);
            }
            for (let i = 0; i < gameConfig.patternLength; i++) {
                newPattern.push(sequence[i % sequenceLength]);
            }
            answer = sequence[gameConfig.patternLength % sequenceLength];
        } else {
            // Generate color sequence
            const colors = ['🔴', '🔵', '🟢', '🟡', '🟣'];
            const sequenceLength = Math.min(3, gameConfig.patternLength);
            const sequence = [];
            for (let i = 0; i < sequenceLength; i++) {
                sequence.push(colors[i % colors.length]);
            }
            for (let i = 0; i < gameConfig.patternLength; i++) {
                newPattern.push(sequence[i % sequenceLength]);
            }
            answer = sequence[gameConfig.patternLength % sequenceLength];
        }

        setPattern(newPattern);
        setCorrectAnswer(answer);

        // Generate options
        const wrongOptions = generateWrongOptions(answer, patternType, gameConfig.options - 1);
        const allOptions = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
        setOptions(allOptions);

        setGameState('playing');
    };

    const generateWrongOptions = (correct, type, count) => {
        const options = [];
        if (type === 'number') {
            while (options.length < count) {
                const offset = Math.floor(Math.random() * 20) - 10;
                const wrong = correct + offset;
                if (wrong !== correct && !options.includes(wrong) && wrong > 0) {
                    options.push(wrong);
                }
            }
        } else if (type === 'shape') {
            const shapes = ['●', '■', '▲', '◆', '★'].filter(s => s !== correct);
            while (options.length < count && shapes.length > 0) {
                const randomIndex = Math.floor(Math.random() * shapes.length);
                options.push(shapes.splice(randomIndex, 1)[0]);
            }
        } else {
            const colors = ['🔴', '🔵', '🟢', '🟡', '🟣'].filter(c => c !== correct);
            while (options.length < count && colors.length > 0) {
                const randomIndex = Math.floor(Math.random() * colors.length);
                options.push(colors.splice(randomIndex, 1)[0]);
            }
        }
        return options;
    };

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        const isCorrect = String(answer).trim() === String(correctAnswer).trim();

        const newScore = isCorrect ? score + 20 : score;
        console.log(`Answer: ${answer}, Correct: ${correctAnswer}, Match: ${isCorrect}`);

        if (isCorrect) setScore(newScore);

        setTimeout(() => {
            if (round < totalRounds) {
                setRound(round + 1);
                setSelectedAnswer(null);
                generatePattern(config);
            } else {
                finishGame(newScore); // Pass accumulated score
            }
        }, 1500);
    };

    const finishGame = async (finalScore) => {
        const maxScore = totalRounds * 20;
        const accuracy = (finalScore / maxScore) * 100;
        const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

        setScore(finalScore);
        setGameState('result');

        console.log('Submitting game with:', { finalScore, maxScore, accuracy });

        try {
            await submitGame({
                gameType: 'pattern-recognition',
                difficulty,
                score: finalScore,
                maxScore,
                timeSpent,
                gameData: {
                    rounds: totalRounds,
                    accuracy
                }
            });
        } catch (error) {
            console.error('Failed to submit game:', error);
        }
    };

    if (gameState === 'loading') {
        return <div className="game-loading">Loading game...</div>;
    }

    return (
        <div className="pattern-recognition-game">
            <div className="game-header">
                <h2>Pattern Recognition</h2>
                <div className={`difficulty-badge badge-${difficulty}`}>{difficulty}</div>
            </div>

            {gameState === 'playing' && (
                <>
                    <div className="game-progress">
                        <span>Round {round} / {totalRounds}</span>
                        <span className="score">Score: {score}</span>
                    </div>

                    <div className="pattern-display">
                        <p className="instruction">What comes next in the pattern?</p>
                        <div className="pattern-sequence">
                            {pattern.map((item, index) => (
                                <div key={index} className="pattern-item">
                                    {item}
                                </div>
                            ))}
                            <div className="pattern-item next">?</div>
                        </div>
                    </div>

                    <div className="pattern-options">
                        {options.map((option, index) => {
                            let className = 'pattern-option';
                            if (selectedAnswer === option) {
                                className += String(option).trim() === String(correctAnswer).trim() ? ' correct' : ' wrong';
                            }

                            return (
                                <button
                                    key={index}
                                    className={className}
                                    onClick={() => handleAnswer(option)}
                                    disabled={selectedAnswer !== null}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </>
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
                            <span className="stat-value">{Math.round((score / (totalRounds * 20)) * 100)}%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{Math.floor(score / 20)}/{totalRounds}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                    </div>
                    <div className="game-actions">
                        <button className="btn btn-primary" onClick={initializeGame}>
                            Play Again
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/games')}>
                            Back to Games
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatternRecognition;
