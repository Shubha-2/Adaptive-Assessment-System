
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Try a newer model
        console.log("Testing gemini-1.5-flash availability...");
        const result = await model.generateContent("Test");
        console.log("gemini-1.5-flash working:", result.response.text());
        return;
    } catch (e) {
        console.log("gemini-1.5-flash failed:", e.message);
    }

    // Fallback to listing if possible (though SDK might not expose list directly easily without admin access sometimes, but let's try just testing known models)
    const modelsToTest = ["gemini-1.5-pro", "gemini-1.0-pro"];
    for (const m of modelsToTest) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Test");
            console.log(`${m} working:`, result.response.text());
            return;
        } catch (e) {
            console.log(`${m} failed:`, e.message);
        }
    }
}

listModels();
