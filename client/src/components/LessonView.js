import React, { useState, useEffect } from 'react';
import { generateQuestion, submitAnswer } from '../services/questionService';
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

        setLoading(true);
        try {
            const response = await submitAnswer(question._id, selectedOption);
            if (response.success) {
                if (response.data.isCorrect) {
                    setFeedback({
                        type: 'success',
                        message: 'Correct! Great job.'
                    });
                } else {
                    setFeedback({
                        type: 'error',
                        message: 'Incorrect. Try again or see explanation.',
                        explanation: response.data.explanation
                    });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lesson-view-container">
            <div className="lesson-card-v2">
                {mode === 'learn' ? (
                    <div className="lesson-content-v2 fade-in">
                        <div className="content-eyebrow">Lesson Module</div>
                        <h1>{lessonContent.title}</h1>
                        <div className="lesson-text-v2">
                            <p>{lessonContent.text}</p>
                            <p>Mastering these fundamentals is crucial for tackling advanced puzzle sets.</p>
                        </div>

                        <div className="practice-cta-v2 glass">
                            <div className="cta-left">
                                <h3>Ready to verify?</h3>
                                <p className="text-secondary">Complete the exercise to move forward.</p>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleStartPractice}>
                                <FaPlay /> Solve Challenge
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="practice-arena-v2 fade-in">
                        {loading ? (
                            <div className="py-xl text-center">
                                <div className="loading-spinner mx-auto mb-md"></div>
                                <p className="text-secondary">Generating logic challenge...</p>
                            </div>
                        ) : question ? (
                            <div className="challenge-box">
                                <div className="challenge-header mb-lg">
                                    <div className="flex justify-between align-center">
                                        <span className="badge badge-primary">Level {level}</span>
                                        <button className="btn-icon" onClick={() => setMode('learn')}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <h2 className="mt-md">{question.questionText}</h2>
                                </div>

                                <div className="options-stack">
                                    {question.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className={`challenge-opt ${selectedOption === opt ? 'selected' : ''} ${feedback && opt === question.correctAnswer ? 'correct' : ''
                                                } ${feedback && selectedOption === opt && opt !== question.correctAnswer ? 'wrong' : ''}`}
                                            onClick={() => !feedback && setSelectedOption(opt)}
                                            disabled={!!feedback}
                                        >
                                            <span className="opt-index">{String.fromCharCode(65 + idx)}</span>
                                            <span className="opt-text">{opt}</span>
                                        </button>
                                    ))}
                                </div>

                                {feedback && (
                                    <div className={`feedback-overlay-v2 ${feedback.type} mt-xl`}>
                                        <div className="feedback-body">
                                            <div className="feedback-title">
                                                {feedback.type === 'success' ? <FaCheck /> : <FaTimes />}
                                                {feedback.type === 'success' ? 'Brilliant!' : 'Not quite right'}
                                            </div>
                                            <p>{feedback.message}</p>
                                            {feedback.explanation && (
                                                <div className="explanation-v2">
                                                    <strong>The Logic:</strong> {feedback.explanation}
                                                </div>
                                            )}
                                            {feedback.type === 'success' && (
                                                <button className="btn btn-primary full-width mt-lg" onClick={() => {
                                                    setLevel(prev => prev + 1);
                                                    handleStartPractice();
                                                }}>
                                                    Next Module &rarr;
                                                </button>
                                            )}
                                            {feedback.type === 'error' && (
                                                <button className="btn btn-secondary full-width mt-md" onClick={() => {
                                                    setFeedback(null);
                                                    setSelectedOption(null);
                                                }}>
                                                    Try Again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!feedback && (
                                    <div className="mt-xl">
                                        <button
                                            className="btn btn-primary full-width btn-lg"
                                            onClick={handleSubmit}
                                            disabled={!selectedOption || loading}
                                        >
                                            Verify Implementation
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass-card text-center py-xl">
                                <p className="mb-md">Failed to link with logic engine.</p>
                                <button className="btn btn-primary" onClick={handleStartPractice}>Reconnect</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonView;
