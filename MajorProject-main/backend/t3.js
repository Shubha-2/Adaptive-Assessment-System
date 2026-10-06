
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello");
        const text = result.response.text();
        fs.writeFileSync('result3.txt', `Success: ${text}`);
    } catch (e) {
        fs.writeFileSync('result3.txt', `Error: ${e.message}`);
    }
}

test();
