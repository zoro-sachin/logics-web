const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DATA_PATH = path.join(__dirname, '../data/questions_v2.json');

/**
 * AI Batch Generator
 * Uses Groq API to generate Reasoning, Puzzles, Aptitude, etc.
 */

const PROMPTS = {
    ADAPTIVE: (category, difficulty) => `
Act as a logical reasoning trainer.
Generate 5 new practice questions for Category: ${category}, Difficulty: ${difficulty}.
Category Description: Logical reasoning puzzles or word problems.
Difficulty Level: ${difficulty} (Keep numbers simple and patterns clear for easy, complex for hard).

Output MUST be a valid JSON array of objects with exactly these keys:
"questionText", "options", "correctAnswer", "explanation"
Options must be an array of 4 strings.
`,
    FAST: (category, difficulty) => `
Create 10 single logical thinking questions instantly.
Category: ${category}
Difficulty: ${difficulty}
Output format: A JSON array of objects with "questionText", "options", "correctAnswer", "explanation".
Keep it concise.
`,
    GAMIFIED: (category, difficulty) => `
Generate 5 fun, beginner-friendly logical puzzles.
Category: ${category}.
Difficulty: ${difficulty}.
Make it feel like a brain game, not an exam question.
Output format: A JSON array of objects with "questionText", "options", "correctAnswer", "explanation".
`
};

async function generateBatch(mode, category, difficulty) {
    console.log(`Generating ${category} (${difficulty}) using ${mode} mode...`);

    try {
        const prompt = PROMPTS[mode](category, difficulty);
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-70b-8192',
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        // Expecting { "questions": [...] } or just [...]
        const questions = content.questions || content;

        if (!Array.isArray(questions)) {
            console.error('Invalid AI response format');
            return [];
        }

        return questions.map(q => ({
            ...q,
            category,
            difficulty: difficulty.toLowerCase()
        }));
    } catch (error) {
        console.error(`AI Generation failed: ${error.message}`);
        return [];
    }
}

async function run(targetCount = 200) {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const categories = ['puzzles', 'aptitude', 'reasoning', 'boolean-logic', 'algorithmic-logic'];
    const difficulties = ['easy', 'medium', 'hard'];

    for (const diff of difficulties) {
        for (const cat of categories) {
            let currentCount = data[diff][cat].length;
            console.log(`--- Processing ${cat} (${diff}) | Current: ${currentCount} ---`);

            while (currentCount < targetCount) {
                const batch = await generateBatch('ADAPTIVE', cat, diff);
                if (batch.length === 0) break;

                // Simple deduplication within the session
                batch.forEach(q => {
                    const isDup = data[diff][cat].some(existing => existing.questionText === q.questionText);
                    if (!isDup) {
                        data[diff][cat].push(q);
                    }
                });

                currentCount = data[diff][cat].length;
                console.log(`Progress: ${currentCount}/${targetCount}`);

                // Save progress frequently
                fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

                // Rate limiting pause
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
    console.log('All categories reached target count.');
}

if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY not found in .env file.');
    console.log('Please add your API key to proceed with AI generation.');
} else {
    run();
}
