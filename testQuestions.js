const questionService = require('./server/services/questionService');

async function test() {
    console.log("--- Testing Boolean Logic ---");
    const booleanQ = await questionService.generateQuestion('boolean-logic', 'easy');
    console.log(JSON.stringify(booleanQ, null, 2));

    console.log("\n--- Testing Algorithmic Logic ---");
    const algoQ = await questionService.generateQuestion('algorithmic-logic', 'medium');
    console.log(JSON.stringify(algoQ, null, 2));

    console.log("\n--- Testing Deceptive Puzzles ---");
    const puzzleQ = await questionService.generateQuestion('puzzles', 'medium');
    console.log(JSON.stringify(puzzleQ, null, 2));
}

test().catch(console.error);
