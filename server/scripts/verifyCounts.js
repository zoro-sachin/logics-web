const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Question.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        const difficulties = await Question.aggregate([
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
        ]);

        console.log('--- Categories ---');
        categories.forEach(c => console.log(`${c._id}: ${c.count}`));

        console.log('\n--- Difficulties ---');
        difficulties.forEach(d => console.log(`${d._id}: ${d.count}`));

        console.log('\nTotal Questions:', await Question.countDocuments());
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
verify();
