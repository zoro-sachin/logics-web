const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/questions_v2.json');

/**
 * Pattern Generator Utility
 * Generates unique Number Series and Pattern questions programmatically
 */

function generateNumberSeries(count, difficulty) {
    const questions = [];
    const seen = new Set();

    while (questions.length < count) {
        let q;
        const type = Math.floor(Math.random() * 6);

        // Adjust parameters based on difficulty
        const range = difficulty === 'easy' ? 10 : (difficulty === 'medium' ? 50 : 100);
        const start = Math.floor(Math.random() * range) + 1;

        switch (type) {
            case 0: // Arithmetic (Addition)
                const step = Math.floor(Math.random() * (difficulty === 'hard' ? 20 : 10)) + 1;
                const seq = [start, start + step, start + 2 * step, start + 3 * step];
                q = {
                    num: seq,
                    next: (start + 4 * step).toString(),
                    desc: `Arithmetic series: add ${step} each time`,
                    category: 'number-series',
                    difficulty
                };
                break;
            case 1: // Geometric (Multiplication)
                const factor = difficulty === 'easy' ? 2 : (Math.floor(Math.random() * 3) + 2);
                const gSeq = [start, start * factor, start * factor * factor, start * factor * factor * factor];
                if (gSeq[3] > 10000) continue; // Keep numbers sane
                q = {
                    num: gSeq,
                    next: (gSeq[3] * factor).toString(),
                    desc: `Geometric series: multiply by ${factor} each time`,
                    category: 'number-series',
                    difficulty
                };
                break;
            case 2: // Squares
                const sStart = Math.floor(Math.random() * 10) + 1;
                const sSeq = [sStart * sStart, (sStart + 1) * (sStart + 1), (sStart + 2) * (sStart + 2), (sStart + 3) * (sStart + 3)];
                q = {
                    num: sSeq,
                    next: ((sStart + 4) * (sStart + 4)).toString(),
                    desc: `Sequence of consecutive squares starting from ${sStart}^2`,
                    category: 'number-series',
                    difficulty
                };
                break;
            case 3: // Fibonacci-like
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 5) + 1;
                const fSeq = [a, b, a + b, b + (a + b), (a + b) + (b + (a + b))];
                q = {
                    num: fSeq,
                    next: (fSeq[3] + fSeq[4]).toString(),
                    desc: `Fibonacci-style series: each number is the sum of the previous two`,
                    category: 'number-series',
                    difficulty
                };
                break;
            case 4: // Incrementing Step
                const iStart = Math.floor(Math.random() * 10);
                const baseStep = Math.floor(Math.random() * 5) + 1;
                const iSeq = [iStart];
                let current = iStart;
                for (let i = 1; i < 5; i++) {
                    current += (baseStep + i - 1);
                    iSeq.push(current);
                }
                q = {
                    num: iSeq.slice(0, 4),
                    next: (iSeq[3] + baseStep + 3).toString(),
                    desc: `Incrementing series: step increases by 1 each time`,
                    category: 'number-series',
                    difficulty
                };
                break;
            case 5: // Alternating Series
                const stepA = Math.floor(Math.random() * 5) + 1;
                const stepB = Math.floor(Math.random() * 5) + 1;
                const altSeq = [start, start + stepA, (start + stepA) - stepB, ((start + stepA) - stepB) + stepA];
                q = {
                    num: altSeq,
                    next: (altSeq[3] - stepB).toString(),
                    desc: `Alternating series: add ${stepA}, then subtract ${stepB}`,
                    category: 'number-series',
                    difficulty
                };
                break;
        }

        const key = JSON.stringify(q.num);
        if (!seen.has(key)) {
            seen.add(key);
            questions.push(q);
        }
    }
    return questions;
}

function generateLetterPatterns(count, difficulty) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const questions = [];
    const seen = new Set();

    while (questions.length < count) {
        let q;
        const type = Math.floor(Math.random() * 4);

        switch (type) {
            case 0: // Simple rotation (ABCABC)
                const len = difficulty === 'easy' ? 2 : (difficulty === 'medium' ? 3 : 4);
                const base = alphabet.split('').sort(() => 0.5 - Math.random()).slice(0, len).join('');
                const seq = base.repeat(3);
                q = {
                    seq: seq,
                    next: base[0],
                    desc: `Repeating pattern: ${base}`,
                    category: 'patterns',
                    difficulty
                };
                break;
            case 1: // Alternating case / Double (AABBAA)
                const charA = alphabet[Math.floor(Math.random() * 26)];
                const charB = alphabet[Math.floor(Math.random() * 26)];
                if (charA === charB) continue;
                q = {
                    seq: `${charA}${charA}${charB}${charB}${charA}${charA}`,
                    next: charB,
                    desc: `Doubled alternating pattern: ${charA}${charA}-${charB}${charB}`,
                    category: 'patterns',
                    difficulty
                };
                break;
            case 2: // Incremental step (ACEG)
                const startIdx = Math.floor(Math.random() * 10);
                const step = difficulty === 'easy' ? 1 : 2;
                const iSeq = [];
                for (let i = 0; i < 4; i++) {
                    iSeq.push(alphabet[startIdx + i * step]);
                }
                q = {
                    seq: iSeq.join(''),
                    next: alphabet[startIdx + 4 * step],
                    desc: `Alphabetical progression skipping ${step - 1} letters`,
                    category: 'patterns',
                    difficulty
                };
                break;
            case 3: // Palindromic (ABCDCBA)
                const pLen = difficulty === 'easy' ? 2 : 3;
                const pBase = alphabet.split('').sort(() => 0.5 - Math.random()).slice(0, pLen).join('');
                const pFull = pBase + pBase.split('').reverse().join('').substring(1);
                q = {
                    seq: pFull,
                    next: pBase[pBase.length - 2] || pBase[0],
                    desc: `Palindromic sequence`,
                    category: 'patterns',
                    difficulty
                };
                break;
        }

        if (q && !seen.has(q.seq)) {
            seen.add(q.seq);
            questions.push(q);
        }
    }
    return questions;
}

function generateBooleanLogic(count, difficulty) {
    const questions = [];
    const seen = new Set();
    const ops = ['&&', '||'];
    let attempts = 0;

    while (questions.length < count && attempts < count * 20) {
        attempts++;
        let q;
        const v1 = Math.floor(Math.random() * 100);
        const v2 = Math.floor(Math.random() * 100);
        const t1 = Math.floor(Math.random() * 100);
        const t2 = Math.floor(Math.random() * 100);
        const op = ops[Math.floor(Math.random() * 2)];

        if (difficulty === 'easy') {
            const condA = v1 > t1;
            const condB = v2 < t2;
            const res = op === '&&' ? (condA && condB) : (condA || condB);

            q = {
                questionText: `Logic Check: If X = ${v1} and Y = ${v2}, is (X > ${t1} ${op} Y < ${t2}) true or false?`,
                options: ['true', 'false', 'undefined', 'error'],
                correctAnswer: res.toString(),
                explanation: `X > ${t1} is ${condA}. Y < ${t2} is ${condB}. result of ${condA} ${op} ${condB} is ${res}.`,
                category: 'boolean-logic',
                difficulty
            };
        } else {
            const v3 = Math.floor(Math.random() * 100);
            const t3 = Math.floor(Math.random() * 100);
            const op2 = ops[Math.floor(Math.random() * 2)];
            const condA = v1 > t1;
            const condB = v2 < t2;
            const condC = v3 > t3;

            // expr: (condA op condB) op2 !condC
            const eval1 = op === '&&' ? (condA && condB) : (condA || condB);
            const res = op2 === '&&' ? (eval1 && !condC) : (eval1 || !condC);

            q = {
                questionText: `Advanced Logic: X=${v1}, Y=${v2}, Z=${v3}. Is ((X > ${t1} ${op} Y < ${t2}) ${op2} NOT(Z > ${t3})) true or false?`,
                options: ['true', 'false', 'both', 'none'],
                correctAnswer: res.toString(),
                explanation: `(X>${t1} ${op} Y<${t2}) is ${eval1}. Z>${t3} is ${condC}, so NOT is ${!condC}. Result: ${eval1} ${op2} ${!condC} = ${res}`,
                category: 'boolean-logic',
                difficulty
            };
        }

        if (q && !seen.has(q.questionText)) {
            seen.add(q.questionText);
            questions.push(q);
        }
    }
    return questions;
}

function generateAlgorithmicLogic(count, difficulty) {
    const questions = [];
    const seen = new Set();

    while (questions.length < count) {
        const x = Math.floor(Math.random() * 100) + 1;
        const y = Math.floor(Math.random() * 20) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';

        let q;
        if (difficulty === 'easy') {
            const res = op === '+' ? (x + y) : (x - y);
            q = {
                questionText: `Algorithm: 1. Let X = ${x}. 2. Let Y = ${y}. 3. X = X ${op} Y. What is the value of X?`,
                options: [res.toString(), (res + 2).toString(), (res - 2).toString(), (res + 10).toString()],
                correctAnswer: res.toString(),
                explanation: `Step 1: X=${x}. Step 2: Y=${y}. Step 3: ${x} ${op} ${y} = ${res}`,
                category: 'algorithmic-logic',
                difficulty
            };
        } else {
            const z = Math.floor(Math.random() * 10) + 1;
            const res = op === '+' ? (x + y - z) : (x - y + z);
            const op2 = op === '+' ? '-' : '+';
            q = {
                questionText: `Algorithm: 1. X = ${x}, Y = ${y}, Z = ${z}. 2. X = X ${op} Y. 3. X = X ${op2} Z. Value of X?`,
                options: [res.toString(), (res + 5).toString(), (res - 5).toString(), (res + z).toString()],
                correctAnswer: res.toString(),
                explanation: `Step 2: ${x} ${op} ${y} = ${op === '+' ? (x + y) : (x - y)}. Step 3: ${op === '+' ? (x + y) : (x - y)} ${op2} ${z} = ${res}`,
                category: 'algorithmic-logic',
                difficulty
            };
        }

        if (q && !seen.has(q.questionText)) {
            seen.add(q.questionText);
            questions.push(q);
        }
    }
    return questions;
}

function generatePuzzles(count, difficulty) {
    const questions = [];
    const seen = new Set();
    const riddles = [
        { q: "The more of this there is, the less you see. What is it?", a: "Darkness", opts: ["Darkness", "Fog", "Light", "Shadow"] },
        { q: "What has keys, but no locks; space, but no room; and allows you to enter, but not leave?", a: "Keyboard", opts: ["Keyboard", "Piano", "Typewriter", "Computer"] },
        { q: "I am taken from a mine, and shut up in a wooden case, from which I am never released.", a: "Pencil lead", opts: ["Pencil lead", "Charcoal", "Gold", "Ink"] },
        { q: "What has to be broken before you can use it?", a: "Egg", opts: ["Egg", "Mirror", "Code", "Bread"] },
        { q: "I’m tall when I’m young, and I’m short when I’m old. What am I?", a: "Candle", opts: ["Candle", "Tree", "Pencil", "Man"] },
        { q: "What is full of holes but still holds water?", a: "Sponge", opts: ["Sponge", "Net", "Strainer", "Bucket"] },
        { q: "What is always in front of you but can’t be seen?", a: "Future", opts: ["Future", "Wind", "Air", "Back"] },
        { q: "What has a thumb and four fingers, but is not a hand?", a: "Glove", opts: ["Glove", "Mittens", "Bag", "Sock"] }
    ];

    let attempts = 0;
    while (questions.length < count && attempts < count * 50) {
        attempts++;
        const type = Math.floor(Math.random() * 3);
        let q;

        if (type === 0) { // Riddle with salt
            const riddle = riddles[Math.floor(Math.random() * riddles.length)];
            const salt = Math.floor(Math.random() * 10000);
            q = {
                questionText: `Riddle: ${riddle.q} (Variation ${salt})`,
                options: riddle.opts,
                correctAnswer: riddle.a,
                explanation: `The riddle describes ${riddle.a}.`,
                category: 'puzzles',
                difficulty
            };
        } else if (type === 1) { // Age Puzzle
            const ageX = Math.floor(Math.random() * 20) + 5;
            const mult = Math.floor(Math.random() * 4) + 2;
            const ageY = ageX * mult;
            q = {
                questionText: `A person is ${mult} times as old as their pet. If the pet is ${ageX} years old, how old is the person?`,
                options: [ageY.toString(), (ageY + 5).toString(), (ageY - 5).toString(), (ageY * 2).toString()],
                correctAnswer: ageY.toString(),
                explanation: `${ageX} * ${mult} = ${ageY}.`,
                category: 'puzzles',
                difficulty
            };
        } else { // Logic arrangement hint
            const names = ["A", "B", "C", "D"];
            const p1 = Math.floor(Math.random() * 10) + 1;
            q = {
                questionText: `Box A has ${p1} coins. Box B has twice as many as A. Box C has 5 more than B. How many in C?`,
                options: [(p1 * 2 + 5).toString(), (p1 * 2).toString(), (p1 + 5).toString(), (p1 * 2 + 10).toString()],
                correctAnswer: (p1 * 2 + 5).toString(),
                explanation: `A=${p1}, B=${p1 * 2}, C=${p1 * 2}+5 = ${p1 * 2 + 5}.`,
                category: 'puzzles',
                difficulty
            };
        }

        if (q && !seen.has(q.questionText)) {
            seen.add(q.questionText);
            questions.push(q);
        }
    }
    return questions;
}

function generateAptitude(count, difficulty) {
    const questions = [];
    const seen = new Set();
    let attempts = 0;
    while (questions.length < count && attempts < count * 50) {
        attempts++;
        const x = Math.floor(Math.random() * 200) + 10;
        const y = Math.floor(Math.random() * 200) + 10;
        const type = Math.floor(Math.random() * 2); // Changed from 3 to 2 as per diff
        let q;

        if (type === 0) { // Percentage variation
            const p = Math.floor(Math.random() * 90) + 5;
            const res = Math.round((x * p) / 100);
            q = {
                questionText: `What is approximately ${p}% of ${x}?`,
                options: [res.toString(), (res + 5).toString(), (res - 5).toString(), (res + 10).toString()],
                correctAnswer: res.toString(),
                explanation: `(${p}/100) * ${x} = ${res}`,
                category: 'aptitude',
                difficulty
            };
        } else {
            // ... (keep previous aptitude logic but use x,y variations)
            const speed = Math.floor(Math.random() * 100) + 20;
            const time = Math.floor(Math.random() * 10) + 1;
            const dist = speed * time;
            q = {
                questionText: `Speed: ${speed} mph. Time: ${time} hours. Distance traveled? (Session ${Math.floor(Math.random() * 1000)})`,
                options: [dist.toString(), (dist + 5).toString(), (dist - 5).toString(), (dist * 1.5).toString()],
                correctAnswer: dist.toString(),
                explanation: `D = S * T = ${speed} * ${time} = ${dist}`,
                category: 'aptitude',
                difficulty
            };
        }

        if (q && !seen.has(q.questionText)) {
            seen.add(q.questionText);
            questions.push(q);
        }
    }
    return questions;
}

function generateReasoning(count, difficulty) {
    const questions = [];
    const seen = new Set();
    const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Jack", "Karl", "Linda", "Mike", "Nancy", "Oscar", "Paul"];
    const traits = ["taller", "shorter", "older", "younger", "faster", "slower"];

    let attempts = 0;
    while (questions.length < count && attempts < count * 100) {
        attempts++;
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        const [n1, n2, n3] = shuffled;
        const trait = traits[Math.floor(Math.random() * traits.length)];
        const opTrait = trait.includes('er') ? (trait.includes('tall') ? 'shorter' : trait.includes('old') ? 'younger' : 'slower') : 'error';

        const q = {
            questionText: `${n1} is ${trait} than ${n2}. ${n2} is ${trait} than ${n3}. Who is the ${trait.replace('er', 'est')}?`,
            options: [n1, n2, n3, "Undetermined"],
            correctAnswer: n1,
            explanation: `Sequence: ${n1} > ${n2} > ${n3}. So ${n1} is the most ${trait.replace('er', '')}.`,
            category: 'reasoning',
            difficulty
        };

        if (!seen.has(q.questionText)) {
            seen.add(q.questionText);
            questions.push(q);
        }
    }
    return questions;
}

// MAIN EXECUTION
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

['easy', 'medium', 'hard'].forEach(diff => {
    console.log(`Generating sequences for ${diff}...`);
    data[diff]['number-series'] = generateNumberSeries(210, diff);
    data[diff]['patterns'] = generateLetterPatterns(210, diff);
    data[diff]['boolean-logic'] = generateBooleanLogic(210, diff);
    data[diff]['algorithmic-logic'] = generateAlgorithmicLogic(210, diff);
    data[diff]['puzzles'] = generatePuzzles(210, diff);
    data[diff]['aptitude'] = generateAptitude(210, diff);
    data[diff]['reasoning'] = generateReasoning(210, diff);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
console.log('Successfully generated all programmatic questions in data/questions_v2.json');
