import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaRedo, FaHome } from 'react-icons/fa';
import './QuizResults.css';

const QuizResults = ({ results, onRestart }) => {
    const {
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        accuracy,
        timeSpent,
        answers,
        questions
    } = results;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getPerformanceMessage = () => {
        if (accuracy >= 90) return { text: 'Outstanding!', emoji: '🏆', color: '#10b981' };
        if (accuracy >= 75) return { text: 'Great Job!', emoji: '🎯', color: '#3b82f6' };
        if (accuracy >= 60) return { text: 'Good Effort!', emoji: '👍', color: '#f59e0b' };
        return { text: 'Keep Practicing!', emoji: '💪', color: '#ef4444' };
    };

    const performance = getPerformanceMessage();

    return (
        <div className="quiz-results">
            {/* Summary Card */}
            <div className="results-summary glass-card">
                <div className="performance-badge" style={{ color: performance.color }}>
                    <span className="performance-emoji">{performance.emoji}</span>
                    <h2>{performance.text}</h2>
                </div>

                <div className="score-circle">
                    <svg viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke={performance.color}
                            strokeWidth="12"
                            strokeDasharray={`${accuracy * 5.65} 565`}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                        />
                    </svg>
                    <div className="score-text">
                        <span className="score-number">{accuracy}%</span>
                        <span className="score-label">Accuracy</span>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-item">
                        <FaCheckCircle className="stat-icon correct" />
                        <div>
                            <div className="stat-value">{correctAnswers}</div>
                            <div className="stat-label">Correct</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <FaTimesCircle className="stat-icon wrong" />
                        <div>
                            <div className="stat-value">{answeredQuestions - correctAnswers}</div>
                            <div className="stat-label">Wrong</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <FaClock className="stat-icon" />
                        <div>
                            <div className="stat-value">{formatTime(timeSpent)}</div>
                            <div className="stat-label">Time</div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={onRestart}>
                        <FaRedo /> Try Again
                    </button>
                    <Link to="/dashboard" className="btn btn-secondary">
                        <FaHome /> Dashboard
                    </Link>
                </div>
            </div>

            {/* Question Review */}
            <div className="results-review">
                <h3 className="review-title">Question Review</h3>

                {questions.map((question, index) => {
                    const answer = answers[index];
                    const wasAnswered = answer !== undefined;
                    const wasCorrect = answer?.correct || false;

                    return (
                        <div
                            key={index}
                            className={`review-item glass-card ${wasCorrect ? 'correct' : 'wrong'}`}
                        >
                            <div className="review-header">
                                <div className="review-number">
                                    {wasCorrect ? (
                                        <FaCheckCircle className="correct-icon" />
                                    ) : (
                                        <FaTimesCircle className="wrong-icon" />
                                    )}
                                    <span>Question {index + 1}</span>
                                </div>
                                <span className={`difficulty-badge ${question.difficulty}`}>
                                    {question.difficulty}
                                </span>
                            </div>

                            <p className="review-question">{question.questionText}</p>

                            <div className="review-answers">
                                {wasAnswered && (
                                    <div className="answer-row">
                                        <span className="answer-label">Your Answer:</span>
                                        <span className={`answer-value ${wasCorrect ? 'correct' : 'wrong'}`}>
                                            {answer.selected}
                                        </span>
                                    </div>
                                )}
                                {!wasCorrect && (
                                    <div className="answer-row">
                                        <span className="answer-label">Correct Answer:</span>
                                        <span className="answer-value correct">
                                            {question.correctAnswer}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {question.explanation && (
                                <div className="review-explanation">
                                    <strong>Explanation:</strong>
                                    <p>{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizResults;
