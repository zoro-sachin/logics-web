import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';
import './QuizSession.css';

const QuizSession = ({ questions, onComplete, timeLimit = 300 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);

    useEffect(() => {
        if (timeLeft > 0 && currentIndex < questions.length) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, currentIndex]);

    const handleTimeUp = () => {
        // Auto-submit quiz when time runs out
        const results = calculateResults();
        onComplete(results);
    };

    const handleAnswer = (answer) => {
        const question = questions[currentIndex];
        const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

        setCurrentAnswer(answer);
        setShowFeedback(true);

        // Store answer
        setSelectedAnswers(prev => ({
            ...prev,
            [currentIndex]: {
                selected: answer,
                correct: isCorrect,
                question: question
            }
        }));

        // Move to next question after delay
        setTimeout(() => {
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(prev => prev + 1);
                setShowFeedback(false);
                setCurrentAnswer(null);
            } else {
                // Quiz complete
                const results = calculateResults();
                onComplete(results);
            }
        }, 2000);
    };

    const calculateResults = () => {
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(selectedAnswers).length;
        const correctAnswers = Object.values(selectedAnswers).filter(a => a.correct).length;
        const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
        const timeSpent = timeLimit - timeLeft;

        return {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            accuracy: Math.round(accuracy),
            timeSpent,
            answers: selectedAnswers,
            questions
        };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0) {
        return <div className="quiz-session">No questions available</div>;
    }

    const question = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="quiz-session">
            {/* Header */}
            <div className="quiz-session-header glass-card">
                <div className="quiz-progress">
                    <span className="progress-text">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className={`quiz-timer ${timeLeft < 60 ? 'warning' : ''}`}>
                    <FaClock />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="question-container glass-card">
                <div className="question-meta">
                    <span className={`difficulty-badge ${question.difficulty}`}>
                        {question.difficulty}
                    </span>
                    <span className="category-badge">
                        {question.category}
                    </span>
                </div>

                <h2 className="question-text">{question.questionText}</h2>

                {question.hint && !showFeedback && (
                    <div className="hint-box">
                        <FaLightbulb />
                        <span>{question.hint}</span>
                    </div>
                )}

                <div className="options-container">
                    {(!question.options || question.options.length === 0) ? (
                        <div className="error-text">No options available for this question.</div>
                    ) : question.options.map((option, index) => {
                        const isSelected = currentAnswer === option;
                        const isCorrect = String(option).trim() === String(question.correctAnswer).trim();

                        let optionClass = 'option-button';
                        if (showFeedback) {
                            if (isSelected && isCorrect) {
                                optionClass += ' correct';
                            } else if (isSelected && !isCorrect) {
                                optionClass += ' wrong';
                            } else if (isCorrect) {
                                optionClass += ' correct-answer';
                            }
                        }

                        return (
                            <button
                                key={index}
                                className={optionClass}
                                onClick={() => !showFeedback && handleAnswer(option)}
                                disabled={showFeedback}
                            >
                                <span className="option-letter">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="option-text">{option}</span>
                                {showFeedback && isCorrect && (
                                    <FaCheckCircle className="option-icon correct-icon" />
                                )}
                                {showFeedback && isSelected && !isCorrect && (
                                    <FaTimesCircle className="option-icon wrong-icon" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {showFeedback && question.explanation && (
                    <div className={`feedback-box ${String(currentAnswer).trim() === String(question.correctAnswer).trim() ? 'correct' : 'wrong'}`}>
                        <div className="feedback-header">
                            {String(currentAnswer).trim() === String(question.correctAnswer).trim() ? (
                                <>
                                    <FaCheckCircle /> Correct!
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle /> Incorrect
                                </>
                            )}
                        </div>
                        <p className="feedback-explanation">{question.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizSession;
