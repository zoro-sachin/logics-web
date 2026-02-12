// Knowledge Vault Content Data
export const knowledgeContent = {
    'number-logic': {
        title: 'Number Logic & Series',
        icon: '🔢',
        topics: [
            {
                id: 'arithmetic-series',
                title: 'Arithmetic Series',
                content: `
                    An arithmetic series is a sequence where each term increases by a constant difference.
                    
                    **Formula**: a, a+d, a+2d, a+3d, ...
                    
                    **Example**: 2, 5, 8, 11, 14 (difference = 3)
                    
                    **Key Strategy**: Always find the common difference first.
                `,
                examples: [
                    { sequence: '3, 7, 11, 15, ?', answer: '19', explanation: 'Add 4 each time' },
                    { sequence: '20, 17, 14, 11, ?', answer: '8', explanation: 'Subtract 3 each time' }
                ]
            },
            {
                id: 'geometric-series',
                title: 'Geometric Series',
                content: `
                    A geometric series multiplies each term by a constant ratio.
                    
                    **Formula**: a, ar, ar², ar³, ...
                    
                    **Example**: 2, 6, 18, 54 (ratio = 3)
                    
                    **Key Strategy**: Divide consecutive terms to find the ratio.
                `,
                examples: [
                    { sequence: '3, 9, 27, 81, ?', answer: '243', explanation: 'Multiply by 3 each time' },
                    { sequence: '64, 32, 16, 8, ?', answer: '4', explanation: 'Divide by 2 each time' }
                ]
            },
            {
                id: 'fibonacci',
                title: 'Fibonacci Sequence',
                content: `
                    Each number is the sum of the two preceding numbers.
                    
                    **Formula**: F(n) = F(n-1) + F(n-2)
                    
                    **Sequence**: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
                    
                    **Applications**: Nature, architecture, art, and algorithms.
                `,
                examples: [
                    { sequence: '1, 1, 2, 3, 5, 8, ?', answer: '13', explanation: '5 + 8 = 13' },
                    { sequence: '2, 2, 4, 6, 10, ?', answer: '16', explanation: 'Fibonacci starting with 2' }
                ]
            },
            {
                id: 'prime-numbers',
                title: 'Prime Numbers',
                content: `
                    Numbers divisible only by 1 and themselves.
                    
                    **First 10 primes**: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
                    
                    **Quick Check**: Test divisibility by primes up to √n
                    
                    **Interview Tip**: Memorise primes up to 100.
                `,
                examples: [
                    { sequence: '2, 3, 5, 7, 11, ?', answer: '13', explanation: 'Next prime number' }
                ]
            },
            {
                id: 'square-cube',
                title: 'Squares & Cubes',
                content: `
                    Perfect squares: n²
                    Perfect cubes: n³
                    
                    **Squares**: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100...
                    **Cubes**: 1, 8, 27, 64, 125, 216, 343, 512...
                    
                    **Tip**: Memorise squares up to 20² and cubes up to 10³
                `,
                examples: [
                    { sequence: '1, 4, 9, 16, ?', answer: '25', explanation: '5² = 25' },
                    { sequence: '1, 8, 27, 64, ?', answer: '125', explanation: '5³ = 125' }
                ]
            }
        ]
    },
    'pattern-logic': {
        title: 'Pattern Recognition',
        icon: '🔄',
        topics: [
            {
                id: 'alternating-patterns',
                title: 'Alternating Patterns',
                content: `
                    Patterns that switch between two or more sequences.
                    
                    **Example**: 1, 5, 2, 6, 3, 7, 4, ?
                    Two sequences: 1,2,3,4 and 5,6,7,?
                    
                    **Strategy**: Separate odd and even positions.
                `,
                examples: [
                    { sequence: 'A, 1, B, 2, C, 3, ?', answer: 'D', explanation: 'Letters and numbers alternate' }
                ]
            },
            {
                id: 'visual-patterns',
                title: 'Visual Patterns',
                content: `
                    Patterns involving shapes, colors, or positions.
                    
                    **Types**:
                    - Rotation patterns
                    - Reflection patterns
                    - Colour sequences
                    - Size progressions
                    
                    **Strategy**: Look for transformations (rotate, flip, scale).
                `
            },
            {
                id: 'letter-patterns',
                title: 'Letter Patterns',
                content: `
                    Alphabetical sequences and transformations.
                    
                    **Common Types**:
                    - Skip patterns: A, C, E, G (skip 1)
                    - Reverse: Z, Y, X, W
                    - Position-based: 1st, 2nd, 3rd letters
                    
                    **Tip**: Assign numbers to letters (A=1, B=2...)
                `,
                examples: [
                    { sequence: 'A, C, E, G, ?', answer: 'I', explanation: 'Skip one letter each time' },
                    { sequence: 'Z, X, V, T, ?', answer: 'R', explanation: 'Go back 2 letters' }
                ]
            }
        ]
    },
    'analytical-reasoning': {
        title: 'Analytical Reasoning',
        icon: '🧠',
        topics: [
            {
                id: 'syllogisms',
                title: 'Syllogisms',
                content: `
                    Logical arguments with two premises and a conclusion.
                    
                    **Structure**:
                    - Major premise: All A are B
                    - Minor premise: C is A
                    - Conclusion: Therefore, C is B
                    
                    **Common Mistakes**: Assuming "some" means "all"
                `,
                examples: [
                    {
                        premise: 'All cats are animals. Tom is a cat.',
                        conclusion: 'Tom is an animal',
                        valid: true
                    }
                ]
            },
            {
                id: 'venn-diagrams',
                title: 'Venn Diagrams',
                content: `
                    Visual representation of logical relationships.
                    
                    **Uses**:
                    - Set theory problems
                    - Categorical logic
                    - Probability
                    
                    **Strategy**: Draw circles to represent groups and their overlaps.
                `
            },
            {
                id: 'cause-effect',
                title: 'Cause & Effect',
                content: `
                    Identifying relationships between events.
                    
                    **Types**:
                    - Direct causation: A causes B
                    - Correlation: A and B occur together
                    - Common cause: C causes both A and B
                    
                    **Warning**: Correlation ≠ Causation
                `
            },
            {
                id: 'analogies',
                title: 'Analogies',
                content: `
                    Relationships between pairs of concepts.
                    
                    **Format**: A is to B as C is to D
                    
                    **Common Types**:
                    - Synonyms/Antonyms
                    - Part to Whole
                    - Function/Purpose
                    - Degree/Intensity
                    
                    **Example**: Hot is to Cold as Day is to Night
                `
            }
        ]
    },
    'common-traps': {
        title: 'Common Logical Traps',
        icon: '⚠️',
        topics: [
            {
                id: 'assumption-traps',
                title: 'Hidden Assumptions',
                content: `
                    Don't assume information not explicitly stated.
                    
                    **Example Trap**:
                    "Some flowers are roses. All roses are red."
                    ❌ Wrong: All flowers are red
                    ✅ Correct: Some flowers are red
                    
                    **Strategy**: Only use given information.
                `
            },
            {
                id: 'distractor-answers',
                title: 'Distractor Answers',
                content: `
                    Answers designed to look correct but aren't.
                    
                    **Common Distractors**:
                    - Partially correct answers
                    - Answers using question keywords
                    - Extreme answers (always/never)
                    
                    **Defense**: Eliminate obviously wrong answers first.
                `
            },
            {
                id: 'time-pressure',
                title: 'Time Pressure Mistakes',
                content: `
                    Rushing leads to careless errors.
                    
                    **Common Mistakes**:
                    - Misreading questions
                    - Calculation errors
                    - Skipping steps
                    
                    **Solution**: Budget time per question, skip and return if stuck.
                `
            },
            {
                id: 'overthinking',
                title: 'Overthinking',
                content: `
                    Sometimes the simple answer is correct.
                    
                    **Signs of Overthinking**:
                    - Creating complex scenarios
                    - Doubting obvious answers
                    - Changing correct answers
                    
                    **Tip**: Trust your first instinct if you're confident.
                `
            }
        ]
    },
    'interview-strategies': {
        title: 'Interview Logic Strategies',
        icon: '💼',
        topics: [
            {
                id: 'problem-solving-framework',
                title: 'Problem-Solving Framework',
                content: `
                    Structured approach to logic problems.
                    
                    **Steps**:
                    1. **Understand**: Read carefully, identify what's asked
                    2. **Plan**: Choose a strategy (diagram, equation, etc.)
                    3. **Execute**: Work through systematically
                    4. **Verify**: Check your answer makes sense
                    
                    **Tip**: Explain your thinking out loud in interviews.
                `
            },
            {
                id: 'estimation-techniques',
                title: 'Quick Estimation',
                content: `
                    Approximate answers quickly.
                    
                    **Techniques**:
                    - Round numbers to nearest 10/100
                    - Use benchmarks (50%, 25%, etc.)
                    - Eliminate impossible answers
                    
                    **Example**: 47 × 23 ≈ 50 × 20 = 1000
                `
            },
            {
                id: 'pattern-recognition-speed',
                title: 'Fast Pattern Recognition',
                content: `
                    Quickly identify pattern types.
                    
                    **Quick Checks**:
                    1. Arithmetic? (constant difference)
                    2. Geometric? (constant ratio)
                    3. Fibonacci? (sum of previous two)
                    4. Squares/Cubes? (perfect powers)
                    5. Primes? (divisibility check)
                    
                    **Practice**: Do 10 patterns daily for speed.
                `
            },
            {
                id: 'mental-math',
                title: 'Mental Maths Tricks',
                content: `
                    Calculate faster without a calculator.
                    
                    **Tricks**:
                    - Multiply by 11: 23 × 11 = 2(2+3)3 = 253
                    - Square numbers ending in 5: 25² = 2×3 | 25 = 625
                    - Percentages: 15% = 10% + 5%
                    
                    **Tip**: Practice daily calculations.
                `
            },
            {
                id: 'communication',
                title: 'Communicating Your Logic',
                content: `
                    Explain your reasoning clearly.
                    
                    **Best Practices**:
                    - Think aloud during problem-solving
                    - State assumptions explicitly
                    - Show your work step-by-step
                    - Admit when you're unsure
                    
                    **Remember**: Process matters as much as the answer.
                `
            }
        ]
    }
};

export default knowledgeContent;
