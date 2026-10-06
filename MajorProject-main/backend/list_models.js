
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function list() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Accessing the model manager is a bit tricky in the high-level SDK, 
        // usually it's genAI.getGenerativeModel...
        // But the error message says "Call ListModels".
        // Let's try to use the unexpected low-level access if possible or just try a different model.
        // Actually, the SDK doesn't expose listModels directly on the main class easily in all versions.
        // Let's try to fetch a known working model like 'gemini-pro' (which failed)
        // 'gemini-1.5-flash-latest' ?

        // I'll try to use a REST call to list models if the SDK doesn't help.
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        fs.writeFileSync('models.txt', JSON.stringify(data, null, 2));
    } catch (e) {
        fs.writeFileSync('models.txt', `Error: ${e.message}`);
    }
}

list();
