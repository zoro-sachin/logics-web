import React, { useState } from 'react';
import { generateQuestion } from '../services/questionService';
import { submitDynamicQuiz } from '../services/quizService';
import QuizSession from '../components/quiz/QuizSession';
import QuizResults from '../components/quiz/QuizResults';
import { FaPlay, FaBrain, FaListAlt, FaPuzzlePiece, FaCalculator } from 'react-icons/fa';
import './Quizzes.css';

const Quizzes = () => {
    const [quizState, setQuizState] = useState('selection'); // 'selection', 'session', 'results'
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const quizTopics = [
        {
            id: 'mixed',
            title: 'Mixed Logic Challenge',
            description: 'A comprehensive test covering all logic categories.',
            icon: <FaBrain />,
            color: '#8b5cf6',
            questionCount: 10,
            timeLimit: 600 // 10 minutes
        },
        {
            id: 'number-series',
            title: 'Number Series Mastery',
            description: 'Master arithmetic, geometric, and complex number patterns.',
            icon: <FaListAlt />,
            color: '#3b82f6',
            questionCount: 8,
            timeLimit: 480
        },
        {
            id: 'patterns',
            title: 'Visual Patterns',
            description: 'Identify patterns in shapes, colours, and sequences.',
            icon: <FaPuzzlePiece />,
            color: '#10b981',
            questionCount: 8,
            timeLimit: 480
        },
        {
            id: 'reasoning',
            title: 'Logical Reasoning',
            description: 'Test your analytical and deductive reasoning skills.',
            icon: <FaCalculator />,
            color: '#f59e0b',
            questionCount: 10,
            timeLimit: 600
        },
    ];

    const startQuiz = async (topic) => {
        setLoading(true);
        setSelectedTopic(topic);

        try {
            const questions = [];
            const difficulties = ['easy', 'medium', 'hard'];

            for (let i = 0; i < topic.questionCount; i++) {
                // Gradually increase difficulty
                const difficultyIndex = Math.floor(i / (topic.questionCount / 3));
                const difficulty = difficulties[Math.min(difficultyIndex, 2)];

                // If mixed, rotate through all categories
                const categories = ['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning'];
                const category = topic.id === 'mixed'
                    ? categories[i % categories.length]
                    : topic.id;

                const response = await generateQuestion(category, null, difficulty);
                if (response.success) {
                    questions.push(response.data);
                }
            }

            setQuestions(questions);
            setQuizState('session');
        } catch (error) {
            console.error("Failed to start quiz:", error);
            alert("Failed to load quiz questions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuizComplete = async (quizResults) => {
        try {
            // Submit quiz results to backend using the new dynamic endpoint
            await submitDynamicQuiz({
                category: selectedTopic.id,
                difficulty: 'mixed',
                score: quizResults.correctAnswers,
                totalQuestions: quizResults.totalQuestions,
                percentage: quizResults.accuracy / 100,
                timeSpent: quizResults.timeSpent,
                answers: quizResults.answers // Optional, if needed for history
            });
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }

        setResults(quizResults);
        setQuizState('results');
    };

    const handleRestart = () => {
        setQuizState('selection');
        setQuestions([]);
        setResults(null);
        setSelectedTopic(null);
    };

    if (loading) {
        return (
            <div className="quizzes-page centered">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="text-gradient">Preparing your quiz...</p>
                </div>
            </div>
        );
    }

    if (quizState === 'session' && questions.length > 0) {
        return (
            <QuizSession
                questions={questions}
                onComplete={handleQuizComplete}
                timeLimit={selectedTopic.timeLimit}
            />
        );
    }

    if (quizState === 'results' && results) {
        return <QuizResults results={results} onRestart={handleRestart} />;
    }

    return (
        <div className="quizzes-page fade-in">
            <div className="container">
                <div className="page-header text-center mb-lg">
                    <h1 className="text-gradient mb-sm">Knowledge Sprints</h1>
                    <p className="text-secondary">
                        Timed quizzes to test your logical thinking under pressure.
                    </p>
                </div>

                <div className="quiz-topics-grid">
                    {quizTopics.map(topic => (
                        <div key={topic.id} className="quiz-topic-card glass-card">
                            <div
                                className="topic-icon-large"
                                style={{ background: `${topic.color}20`, color: topic.color }}
                            >
                                {topic.icon}
                            </div>
                            <h3>{topic.title}</h3>
                            <p className="topic-description">{topic.description}</p>

                            <div className="topic-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Questions</span>
                                    <span className="meta-value">{topic.questionCount}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Time</span>
                                    <span className="meta-value">{topic.timeLimit / 60}m</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary full-width mt-md"
                                onClick={() => startQuiz(topic)}
                                style={{ background: `linear-gradient(135deg, ${topic.color}, ${topic.color}dd)` }}
                            >
                                <FaPlay /> Start Quiz
                            </button>
                        </div>
                    ))}
                </div>

                <div className="quiz-info glass-card mt-lg">
                    <h3>How It Works</h3>
                    <ul>
                        <li>Each quiz has a time limit - answer as many questions as you can</li>
                        <li>Questions increase in difficulty as you progress</li>
                        <li>Get instant feedback with detailed explanations</li>
                        <li>Your results are saved and contribute to your overall stats</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Quizzes;

