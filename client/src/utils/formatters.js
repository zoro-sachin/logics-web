/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format time in seconds to MM:SS
 */
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (earned, total) => {
    if (total === 0) return 0;
    return Math.round((earned / total) * 100);
};

/**
 * Get category display name
 */
export const getCategoryName = (category) => {
    const names = {
        'number-series': 'Number Series',
        'patterns': 'Patterns',
        'puzzles': 'Puzzles',
        'aptitude': 'Aptitude',
        'reasoning': 'Reasoning',
        'mixed': 'Mixed'
    };
    return names[category] || category;
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty) => {
    const colors = {
        easy: '#34a853',
        medium: '#fbbc04',
        hard: '#ea4335'
    };
    return colors[difficulty] || '#5f6368';
};

/**
 * Shuffle array
 */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
