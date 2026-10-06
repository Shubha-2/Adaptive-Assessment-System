
require('dotenv').config();
const { generateMCQs } = require('./utils/aiGenerator');

async function verify() {
    try {
        console.log("Starting verification...");
        const mcqs = await generateMCQs("Javascript", "Easy", 3);
        console.log("Verification Success! Generated MCQs:", JSON.stringify(mcqs, null, 2));
    } catch (error) {
        console.error("Verification Failed:", error);
    }
}

verify();
