const Question = require('../models/Question');

// Sample questions for seeding the database
const sampleQuestions = [
    // Number Series - Easy
    {
        category: 'number-series',
        difficulty: 'easy',
        questionText: 'What comes next in the series: 2, 4, 6, 8, ?',
        options: ['9', '10', '11', '12'],
        correctAnswer: '10',
        explanation: 'This is a simple arithmetic sequence where each number increases by 2.',
        hint: 'Look at the difference between consecutive numbers.',
        points: 10
    },
    {
        category: 'number-series',
        difficulty: 'easy',
        questionText: 'Complete the series: 5, 10, 15, 20, ?',
        options: ['22', '25', '30', '35'],
        correctAnswer: '25',
        explanation: 'Each number is a multiple of 5, increasing by 5 each time.',
        hint: 'These are multiples of a specific number.',
        points: 10
    },
    {
        category: 'number-series',
        difficulty: 'easy',
        questionText: 'Find the next number: 1, 3, 5, 7, ?',
        options: ['8', '9', '10', '11'],
        correctAnswer: '9',
        explanation: 'This series consists of consecutive odd numbers.',
        hint: 'All numbers in this series are odd.',
        points: 10
    },

    // Number Series - Medium
    {
        category: 'number-series',
        difficulty: 'medium',
        questionText: 'What is the next number: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctAnswer: '42',
        explanation: 'The differences between consecutive numbers are 4, 6, 8, 10, 12 (increasing by 2).',
        hint: 'Look at the differences between consecutive numbers.',
        points: 20
    },
    {
        category: 'number-series',
        difficulty: 'medium',
        questionText: 'Complete: 1, 1, 2, 3, 5, 8, ?',
        options: ['11', '12', '13', '14'],
        correctAnswer: '13',
        explanation: 'This is the Fibonacci sequence where each number is the sum of the previous two.',
        hint: 'Each number is related to the two numbers before it.',
        points: 20
    },
    {
        category: 'number-series',
        difficulty: 'medium',
        questionText: 'Find the missing number: 3, 9, 27, 81, ?',
        options: ['162', '243', '324', '405'],
        correctAnswer: '243',
        explanation: 'Each number is multiplied by 3 to get the next number (powers of 3).',
        hint: 'Each number is a power of 3.',
        points: 20
    },

    // Number Series - Hard
    {
        category: 'number-series',
        difficulty: 'hard',
        questionText: 'What comes next: 2, 3, 5, 7, 11, 13, ?',
        options: ['15', '16', '17', '19'],
        correctAnswer: '17',
        explanation: 'These are prime numbers in sequence.',
        hint: 'These numbers are only divisible by 1 and themselves.',
        points: 30
    },
    {
        category: 'number-series',
        difficulty: 'hard',
        questionText: 'Complete the series: 1, 4, 9, 16, 25, ?',
        options: ['30', '32', '36', '40'],
        correctAnswer: '36',
        explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6².',
        hint: 'Think about square numbers.',
        points: 30
    },

    // Patterns - Easy
    {
        category: 'patterns',
        difficulty: 'easy',
        questionText: 'If A=1, B=2, C=3, what is D?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        explanation: 'Each letter corresponds to its position in the alphabet.',
        hint: 'Count the position of the letter in the alphabet.',
        points: 10
    },
    {
        category: 'patterns',
        difficulty: 'easy',
        questionText: 'What comes next: Circle, Square, Triangle, Circle, Square, ?',
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: 'Triangle',
        explanation: 'The pattern repeats every three shapes.',
        hint: 'Look for a repeating cycle.',
        points: 10
    },

    // Patterns - Medium
    {
        category: 'patterns',
        difficulty: 'medium',
        questionText: 'Complete the pattern: AB, CD, EF, GH, ?',
        options: ['IJ', 'HI', 'JK', 'KL'],
        correctAnswer: 'IJ',
        explanation: 'Each pair consists of consecutive letters in the alphabet.',
        hint: 'Look at consecutive letter pairs.',
        points: 20
    },
    {
        category: 'patterns',
        difficulty: 'medium',
        questionText: 'What is next: 1A, 2B, 3C, 4D, ?',
        options: ['5E', '5D', '4E', '6E'],
        correctAnswer: '5E',
        explanation: 'Numbers increase by 1, letters advance by 1 position in the alphabet.',
        hint: 'Both numbers and letters follow a pattern.',
        points: 20
    },

    // Patterns - Hard
    {
        category: 'patterns',
        difficulty: 'hard',
        questionText: 'Find the pattern: 2Z, 4Y, 6X, 8W, ?',
        options: ['9V', '10V', '10W', '12V'],
        correctAnswer: '10V',
        explanation: 'Even numbers increase by 2, letters go backward in the alphabet.',
        hint: 'Numbers go forward, letters go backward.',
        points: 30
    },

    // Puzzles - Easy
    {
        category: 'puzzles',
        difficulty: 'easy',
        questionText: 'If you have 3 apples and you take away 2, how many do you have?',
        options: ['1', '2', '3', '5'],
        correctAnswer: '2',
        explanation: 'You took away 2 apples, so YOU have 2 apples.',
        hint: 'Read the question carefully - how many do YOU have?',
        points: 10
    },
    {
        category: 'puzzles',
        difficulty: 'easy',
        questionText: 'What has hands but cannot clap?',
        options: ['A person', 'A clock', 'A tree', 'A robot'],
        correctAnswer: 'A clock',
        explanation: 'A clock has hands (hour and minute hands) but cannot clap.',
        hint: 'Think about objects with hands that aren\'t alive.',
        points: 10
    },

    // Puzzles - Medium
    {
        category: 'puzzles',
        difficulty: 'medium',
        questionText: 'A farmer has 17 sheep. All but 9 die. How many are left?',
        options: ['8', '9', '0', '17'],
        correctAnswer: '9',
        explanation: '"All but 9" means 9 survived, so 9 are left.',
        hint: 'Pay attention to the phrase "all but 9".',
        points: 20
    },
    {
        category: 'puzzles',
        difficulty: 'medium',
        questionText: 'What can travel around the world while staying in a corner?',
        options: ['A bird', 'A stamp', 'Wind', 'Light'],
        correctAnswer: 'A stamp',
        explanation: 'A stamp stays in the corner of an envelope but travels the world.',
        hint: 'Think about mail and envelopes.',
        points: 20
    },

    // Puzzles - Hard
    {
        category: 'puzzles',
        difficulty: 'hard',
        questionText: 'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
        options: ['Echo', 'Shadow', 'Cloud', 'Spirit'],
        correctAnswer: 'Echo',
        explanation: 'An echo repeats sounds without having physical form and is carried by wind/air.',
        hint: 'Think about sound phenomena.',
        points: 30
    },

    // Aptitude - Easy
    {
        category: 'aptitude',
        difficulty: 'easy',
        questionText: 'If a train travels 60 km in 1 hour, how far will it travel in 3 hours at the same speed?',
        options: ['120 km', '150 km', '180 km', '200 km'],
        correctAnswer: '180 km',
        explanation: '60 km/hour × 3 hours = 180 km',
        hint: 'Multiply the speed by the time.',
        points: 10
    },
    {
        category: 'aptitude',
        difficulty: 'easy',
        questionText: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        correctAnswer: '30',
        explanation: '15% of 200 = (15/100) × 200 = 30',
        hint: 'Convert percentage to decimal and multiply.',
        points: 10
    },

    // Aptitude - Medium
    {
        category: 'aptitude',
        difficulty: 'medium',
        questionText: 'A product costs $80 after a 20% discount. What was the original price?',
        options: ['$96', '$100', '$104', '$110'],
        correctAnswer: '$100',
        explanation: 'If $80 is 80% of the original price, then original = 80 ÷ 0.8 = $100',
        hint: '$80 represents 80% of the original price.',
        points: 20
    },
    {
        category: 'aptitude',
        difficulty: 'medium',
        questionText: 'If 5 workers can complete a task in 12 days, how many days will 3 workers take?',
        options: ['15 days', '18 days', '20 days', '24 days'],
        correctAnswer: '20 days',
        explanation: 'Total work = 5 × 12 = 60 worker-days. For 3 workers: 60 ÷ 3 = 20 days.',
        hint: 'Calculate total worker-days first.',
        points: 20
    },

    // Aptitude - Hard
    {
        category: 'aptitude',
        difficulty: 'hard',
        questionText: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
        options: ['0°', '7.5°', '15°', '22.5°'],
        correctAnswer: '7.5°',
        explanation: 'At 3:15, minute hand is at 90° (pointing at 3), hour hand is at 97.5° (quarter past 3). Difference = 7.5°.',
        hint: 'The hour hand moves as minutes pass.',
        points: 30
    },

    // Reasoning - Easy
    {
        category: 'reasoning',
        difficulty: 'easy',
        questionText: 'All roses are flowers. Some flowers fade quickly. Therefore:',
        options: ['All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Cannot be determined'],
        correctAnswer: 'Cannot be determined',
        explanation: 'We know some flowers fade quickly, but we don\'t know if roses are among them.',
        hint: 'Be careful not to make assumptions beyond what is stated.',
        points: 10
    },
    {
        category: 'reasoning',
        difficulty: 'easy',
        questionText: 'If all cats are animals, and Tom is a cat, then:',
        options: ['Tom is not an animal', 'Tom is an animal', 'Tom might be an animal', 'Cannot say'],
        correctAnswer: 'Tom is an animal',
        explanation: 'This is a simple syllogism: All A are B, X is A, therefore X is B.',
        hint: 'Follow the logical chain.',
        points: 10
    },

    // Reasoning - Medium
    {
        category: 'reasoning',
        difficulty: 'medium',
        questionText: 'If some doctors are teachers, and all teachers are educated, then:',
        options: ['All doctors are educated', 'Some doctors are educated', 'No doctors are educated', 'All educated people are doctors'],
        correctAnswer: 'Some doctors are educated',
        explanation: 'Some doctors are teachers, and all teachers are educated, so at least some doctors are educated.',
        hint: 'Focus on the doctors who are teachers.',
        points: 20
    },

    // Reasoning - Hard
    {
        category: 'reasoning',
        difficulty: 'hard',
        questionText: 'In a family of 6, A is the sister of B. C is the brother of B\'s husband. D is the father of A. E is the mother of C. F is the mother of B. How is E related to D?',
        options: ['Sister', 'Wife', 'Sister-in-law', 'Mother'],
        correctAnswer: 'Wife',
        explanation: 'C is E\'s son and B\'s husband\'s brother. B is A\'s sister and D\'s daughter. So C and B\'s husband are brothers, making E and D (parents of the siblings\' spouses) related through marriage. E is D\'s wife.',
        hint: 'Draw a family tree to visualize the relationships.',
        points: 30
    }
];

async function seedQuestions() {
    try {
        // Connect to MongoDB
        const mongoose = require('mongoose');
        require('dotenv').config();

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing questions (optional - comment out if you want to keep existing)
        // await Question.deleteMany({});
        // console.log('Cleared existing questions');

        // Insert sample questions
        const result = await Question.insertMany(sampleQuestions);
        console.log(`✅ Successfully seeded ${result.length} questions`);

        // Display summary
        const summary = await Question.aggregate([
            {
                $group: {
                    _id: { category: '$category', difficulty: '$difficulty' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.category': 1, '_id.difficulty': 1 } }
        ]);

        console.log('\n📊 Questions Summary:');
        summary.forEach(item => {
            console.log(`  ${item._id.category} (${item._id.difficulty}): ${item.count} questions`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        process.exit(1);
    }
}

// Run the seed function
seedQuestions();
