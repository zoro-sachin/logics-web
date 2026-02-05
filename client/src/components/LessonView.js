import React, { useState, useEffect } from 'react';
import { generateQuestion, getExplanation } from '../services/aiService';
import { FaPlay, FaCheck, FaTimes, FaLightbulb } from 'react-icons/fa';

const LessonView = ({ courseId, sectionId }) => {
    const [mode, setMode] = useState('learn'); // 'learn' or 'practice'
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState(1); // Default level

    // Mock Content based on sectionId
    const lessonContent = {
        title: sectionId === 'intro' ? 'Introduction to Logic' : 'Advanced Patterns',
        text: sectionId === 'intro' ?
            "Logic is the foundation of problem-solving. In this lesson, we will explore the basic building blocks of logical reasoning, including sequences, patterns, and deductions." :
            "Complex patterns require looking at multiple variables changing simultaneously. Let's dive deep into multi-step sequences."
    };

    const handleStartPractice = async () => {
        setMode('practice');
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);

        try {
            // Map course/section to category (Mock mapping)
            const category = 'number-series'; // Defaulting for demo

            const res = await generateQuestion(category, null, level);
            if (res.success) {
                setQuestion(res.data);
            }
        } catch (error) {
            console.error("Failed to generate question", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption || !question) return;

        const isCorrect = selectedOption === question.correctAnswer;

        if (isCorrect) {
            setFeedback({ type: 'success', message: 'Correct! Great job.' });
            // Ideally increase level here
        } else {
            setFeedback({ type: 'error', message: 'Incorrect. Try again or see explanation.' });
            try {
                const res = await getExplanation(question._id, selectedOption);
                if (res.success) {
                    setFeedback(prev => ({ ...prev, explanation: res.data.explanation }));
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="lesson-view">
            <header className="lesson-header">
                <h1>{lessonContent.title}</h1>
                <div className="lesson-controls">
                    <button
                        className={`btn-tab ${mode === 'learn' ? 'active' : ''}`}
                        onClick={() => setMode('learn')}
                    >
                        Learn
                    </button>
                    <button
                        className={`btn-tab ${mode === 'practice' ? 'active' : ''}`}
                        onClick={handleStartPractice}
                    >
                        Practice
                    </button>
                </div>
            </header>

            <div className="lesson-body">
                {mode === 'learn' ? (
                    <div className="lesson-text">
                        <p>{lessonContent.text}</p>
                        <div className="start-practice-cta">
                            <p>Ready to test your knowledge?</p>
                            <button className="btn-primary" onClick={handleStartPractice}>
                                <FaPlay /> Start Practice (Level {level})
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="practice-area">
                        {loading ? (
                            <div className="loader">Generating Question with Llama 3 AI...</div>
                        ) : question ? (
                            <div className="question-card">
                                <div className="question-header">
                                    <span className="badge level-badge">Level {level}</span>
                                    <span className="badge difficulty-badge">{question.difficulty}</span>
                                </div>
                                <h3 className="question-text">{question.questionText}</h3>
                                <div className="options-grid">
                                    {question.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className={`option-btn ${selectedOption === opt ? 'selected' : ''} ${feedback && opt === question.correctAnswer ? 'correct' : ''
                                                } ${feedback && selectedOption === opt && opt !== question.correctAnswer ? 'wrong' : ''
                                                }`}
                                            onClick={() => !feedback && setSelectedOption(opt)}
                                            disabled={!!feedback}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {feedback && (
                                    <div className={`feedback-section ${feedback.type}`}>
                                        <p>
                                            {feedback.type === 'success' ? <FaCheck /> : <FaTimes />}
                                            {feedback.message}
                                        </p>
                                        {feedback.explanation && (
                                            <div className="explanation">
                                                <FaLightbulb /> <strong>Explanation:</strong> {feedback.explanation}
                                            </div>
                                        )}
                                        {feedback.type === 'success' && (
                                            <button className="btn-next" onClick={() => {
                                                setLevel(prev => prev + 1); // Auto level up
                                                handleStartPractice();
                                            }}>
                                                Next Question (Level Up) &rarr;
                                            </button>
                                        )}
                                    </div>
                                )}

                                {!feedback && (
                                    <button
                                        className="btn-submit"
                                        onClick={handleSubmit}
                                        disabled={!selectedOption}
                                    >
                                        Submit Answer
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="error-state">Failed to load question.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonView;
