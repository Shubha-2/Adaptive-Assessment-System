
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello");
        const text = result.response.text();
        fs.writeFileSync('result2.txt', `Success: ${text}`);
    } catch (e) {
        fs.writeFileSync('result2.txt', `Error: ${e.message}`);
    }
}

test();
