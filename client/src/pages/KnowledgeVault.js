import React, { useState } from 'react';
import { knowledgeContent } from '../data/knowledgeContent';
import './KnowledgeVault.css';

const KnowledgeVault = () => {
    const [activeCategory, setActiveCategory] = useState('number-logic');
    const [expandedTopics, setExpandedTopics] = useState(new Set());

    const categories = Object.keys(knowledgeContent);
    const currentCategory = knowledgeContent[activeCategory];

    const toggleTopic = (topicId) => {
        const newExpanded = new Set(expandedTopics);
        if (newExpanded.has(topicId)) {
            newExpanded.delete(topicId);
        } else {
            newExpanded.add(topicId);
        }
        setExpandedTopics(newExpanded);
    };

    const formatContent = (content) => {
        // Simple markdown-like formatting
        return content
            .split('\n')
            .map((line, index) => {
                line = line.trim();
                if (!line) return null;

                // Bold text
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={index}>{line.slice(2, -2)}</h4>;
                }

                // List items
                if (line.startsWith('-')) {
                    return <li key={index}>{line.slice(1).trim()}</li>;
                }

                // Regular paragraph
                return <p key={index}>{line}</p>;
            })
            .filter(Boolean);
    };

    return (
        <div className="knowledge-vault-page">
            <div className="vault-header">
                <h1>Knowledge Vault</h1>
                <p className="subtitle">
                    Master logical thinking with comprehensive guides and strategies
                </p>
            </div>

            <div className="vault-container">
                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map(categoryKey => {
                        const category = knowledgeContent[categoryKey];
                        return (
                            <button
                                key={categoryKey}
                                className={`category-tab ${activeCategory === categoryKey ? 'active' : ''}`}
                                onClick={() => setActiveCategory(categoryKey)}
                            >
                                <span className="tab-icon">{category.icon}</span>
                                <span className="tab-title">{category.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Topics Content */}
                <div className="topics-container">
                    <div className="category-header">
                        <span className="category-icon">{currentCategory.icon}</span>
                        <h2>{currentCategory.title}</h2>
                    </div>

                    <div className="topics-list">
                        {currentCategory.topics.map(topic => {
                            const isExpanded = expandedTopics.has(topic.id);

                            return (
                                <div
                                    key={topic.id}
                                    className={`topic-card glass-card ${isExpanded ? 'expanded' : ''}`}
                                >
                                    <div
                                        className="topic-header"
                                        onClick={() => toggleTopic(topic.id)}
                                    >
                                        <h3>{topic.title}</h3>
                                        <span className="expand-icon">
                                            {isExpanded ? '−' : '+'}
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <div className="topic-content">
                                            <div className="content-text">
                                                {formatContent(topic.content)}
                                            </div>

                                            {topic.examples && topic.examples.length > 0 && (
                                                <div className="examples-section">
                                                    <h4>Examples</h4>
                                                    {topic.examples.map((example, index) => (
                                                        <div key={index} className="example-card">
                                                            {example.sequence && (
                                                                <>
                                                                    <div className="example-sequence">
                                                                        {example.sequence}
                                                                    </div>
                                                                    <div className="example-answer">
                                                                        <strong>Answer:</strong> {example.answer}
                                                                    </div>
                                                                    <div className="example-explanation">
                                                                        {example.explanation}
                                                                    </div>
                                                                </>
                                                            )}
                                                            {example.premise && (
                                                                <>
                                                                    <div className="example-premise">
                                                                        <strong>Premise:</strong> {example.premise}
                                                                    </div>
                                                                    <div className="example-conclusion">
                                                                        <strong>Conclusion:</strong> {example.conclusion}
                                                                    </div>
                                                                    <div className={`validity ${example.valid ? 'valid' : 'invalid'}`}>
                                                                        {example.valid ? '✓ Valid' : '✗ Invalid'}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeVault;
