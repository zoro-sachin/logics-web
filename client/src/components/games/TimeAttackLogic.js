import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, submitGame } from '../../services/gameService';
import { generateQuestion } from '../../services/questionService';
import './games.css';

const TimeAttackLogic = ({ difficulty = 'medium' }) => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('loading');
    const [config, setConfig] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        initializeGame();
    }, [difficulty]);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'playing' && timeLeft === 0) {
            finishGame();
        }
    }, [timeLeft, gameState]);

    const initializeGame = async () => {
        try {
            const response = await startGame('time-attack', difficulty);
            const gameConfig = response.config;
            setConfig(gameConfig);
            setTimeLeft(gameConfig.timeLimit);
            setStartTime(Date.now());
            loadNextQuestion(gameConfig);
        } catch (error) {
            console.error('Failed to initialize game:', error);
            alert('Failed to start game. Please try again.');
        }
    };

    const loadNextQuestion = async (gameConfig) => {
        try {
            const category = ['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning'][
                Math.floor(Math.random() * 5)
            ];

            const response = await generateQuestion(category, null, gameConfig.difficulty);
            if (!response.data) throw new Error('No question data received');

            setCurrentQuestion(response.data);
            setSelectedAnswer(null);
            setGameState('playing');
        } catch (error) {
            console.error('Failed to load question:', error);
            // Fallback or retry logic if needed
        }
    };

    const handleAnswer = (answer) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answer);
        const isCorrect = String(answer).trim() === String(currentQuestion.correctAnswer).trim();

        const answerEntry = {
            question: currentQuestion.questionText,
            selected: answer,
            correct: currentQuestion.correctAnswer,
            isCorrect
        };

        setAnswers(prev => [...prev, answerEntry]);

        let newScore = score;
        if (isCorrect) {
            setStreak(prevStreak => {
                const newStreak = prevStreak + 1;
                const streakMultiplier = Math.floor(prevStreak / 3) + 1;
                const points = (currentQuestion.points || 20) * streakMultiplier;
                setScore(prevScore => {
                    newScore = prevScore + points;
                    return newScore;
                });
                return newStreak;
            });
        } else {
            setStreak(0);
        }

        console.log(`Answer: ${answer} (${typeof answer}), Correct: ${currentQuestion.correctAnswer} (${typeof currentQuestion.correctAnswer}), Match: ${isCorrect}`);

        setTimeout(() => {
            if (questionNumber < config.questionsCount) {
                setQuestionNumber(prev => prev + 1);
                loadNextQuestion(config);
            } else {
                // Pass the LATEST answers including the one just added
                finishGame([...answers, answerEntry], isCorrect ? newScore : score);
            }
        }, 1000);
    };

    const finishGame = async (finalAnswers = answers, finalScore = score) => {
        const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        const correctCount = finalAnswers.filter(a => a.isCorrect).length;
        const maxScore = config.questionsCount * 30; // Assuming avg 30 points per question
        const accuracy = finalAnswers.length > 0 ? (correctCount / finalAnswers.length) * 100 : 0;

        setGameState('result');

        try {
            await submitGame({
                gameType: 'time-attack',
                difficulty,
                score: finalScore,
                maxScore,
                timeSpent,
                gameData: {
                    questionsAnswered: finalAnswers.length,
                    correctAnswers: correctCount,
                    maxStreak: Math.max(...finalAnswers.map((_, i) => {
                        let s = 0;
                        for (let j = i; j >= 0 && finalAnswers[j].isCorrect; j--) s++;
                        return s;
                    }), 0)
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
        <div className="time-attack-game">
            <div className="game-header">
                <h2>Time Attack Logic</h2>
                <div className={`difficulty-badge badge-${difficulty}`}>{difficulty}</div>
            </div>

            {gameState === 'playing' && currentQuestion && (
                <>
                    <div className="game-stats">
                        <div className="stat-item">
                            <span className="stat-label">Time</span>
                            <span className={`stat-value ${timeLeft <= 10 ? 'warning' : ''}`}>
                                {timeLeft}s
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Question</span>
                            <span className="stat-value">{questionNumber}/{config.questionsCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Score</span>
                            <span className="stat-value">{score}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Streak</span>
                            <span className="stat-value streak">{streak}🔥</span>
                        </div>
                    </div>

                    <div className="question-card">
                        <div className="question-category">{currentQuestion.category}</div>
                        <h3 className="question-text">{currentQuestion.questionText}</h3>

                        <div className="answer-options">
                            {(!currentQuestion.options || currentQuestion.options.length === 0) ? (
                                <div className="error-text">No options available</div>
                            ) : currentQuestion.options.map((option, index) => {
                                let className = 'answer-option';
                                if (selectedAnswer === option) {
                                    className += String(option).trim() === String(currentQuestion.correctAnswer).trim()
                                        ? ' correct'
                                        : ' wrong';
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
                    </div>
                </>
            )}

            {gameState === 'result' && (
                <div className="game-result">
                    <h3>Time's Up!</h3>
                    <div className="score-display">
                        <div className="score-number">{score}</div>
                        <div className="score-label">points</div>
                    </div>
                    <div className="result-stats">
                        <div className="stat">
                            <span className="stat-value">{answers.filter(a => a.isCorrect).length}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{answers.length}</span>
                            <span className="stat-label">Answered</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">
                                {answers.length > 0 ? Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100) : 0}%
                            </span>
                            <span className="stat-label">Accuracy</span>
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

export default TimeAttackLogic;
