
import React, { useState } from 'react';
import { generateQuestion } from '../services/aiService';
import { FaPlay, FaBrain, FaListAlt } from 'react-icons/fa';
import './Quizzes.css';

const Quizzes = () => {
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const quizTopics = [
        { id: 'mixed', title: 'Mixed Logic Challenge', description: 'A bit of everything to test your wits.', icon: <FaBrain /> },
        { id: 'number-series', title: 'Number Series Mastery', description: 'Predict the next number in complex sequences.', icon: <FaListAlt /> },
        { id: 'patterns', title: 'Visual Patterns', description: 'Identify the missing piece in the pattern.', icon: <FaListAlt /> },
    ];

    const startQuiz = async (topicId) => {
        setLoading(true);
        try {
            // Generate 5 questions for the quiz
            // Note: In a real app, we might want a batch generation endpoint, but looping works for now
            const questions = [];
            for (let i = 0; i < 5; i++) {
                // progressive difficulty
                const difficulty = i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard';
                const category = topicId === 'mixed' ? 'puzzles' : topicId; // Simplified mapping

                const q = await generateQuestion(category, difficulty);
                if (q.success) questions.push(q.data);
            }
            setActiveQuiz(questions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResults(false);
        } catch (error) {
            console.error("Failed to start quiz", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQ = activeQuiz[currentQuestionIndex];
        if (selectedOption === currentQ.correctAnswer) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIndex + 1 < activeQuiz.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const restartQuiz = () => {
        setActiveQuiz(null);
        setShowResults(false);
    };

    if (loading) {
        return (
            <div className="quizzes-page centered">
                <div className="loading-spinner"></div>
                <p>Generating your AI Quiz...</p>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="quizzes-page centered fade-in">
                <div className="card result-card">
                    <h2>Quiz Completed!</h2>
                    <div className="score-display">
                        <span className="score-number">{score}</span>
                        <span className="score-total">/ {activeQuiz.length}</span>
                    </div>
                    <p>{score > 3 ? 'Excellent work!' : 'Keep practicing!'}</p>
                    <button className="btn btn-primary" onClick={restartQuiz}>Back to Quizzes</button>
                </div>
            </div>
        );
    }

    if (activeQuiz) {
        const question = activeQuiz[currentQuestionIndex];
        return (
            <div className="quizzes-page fade-in">
                <div className="container">
                    <div className="quiz-header">
                        <span>Question {currentQuestionIndex + 1} / {activeQuiz.length}</span>
                        <span className="badge difficulty-badge">{question.difficulty}</span>
                    </div>
                    <div className="card question-card">
                        <h3>{question.questionText}</h3>
                        <div className="options-grid">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className="option-btn"
                                    onClick={() => handleAnswer(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quizzes-page fade-in">
            <div className="container">
                <div className="page-header">
                    <h1>AI Quizzes</h1>
                    <p>Generated on-the-fly using Llama 3 AI</p>
                </div>

                <div className="grid grid-3">
                    {quizTopics.map(topic => (
                        <div key={topic.id} className="card quiz-topic-card">
                            <div className="topic-icon">{topic.icon}</div>
                            <h3>{topic.title}</h3>
                            <p>{topic.description}</p>
                            <button
                                className="btn btn-primary full-width mt-md"
                                onClick={() => startQuiz(topic.id)}
                            >
                                <FaPlay /> Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quizzes;


