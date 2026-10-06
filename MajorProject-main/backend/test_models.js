require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const listModels = async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Not all SDK versions support listModels directly on genAI instance, 
        // but let's try or check how to list models.
        // Actually the error message said "Call ListModels to see the list".
        // In the node SDK, it might be via a model manager or similar.
        // Let's try to find it or just try a known working model like 'gemini-1.5-flash' again but maybe I had a typo?
        // I'll try to use the model manager if available.

        // If SDK doesn't expose listModels easily, I will just try a few common ones.
        console.log("Listing models...");
        // There isn't a direct listModels on the client in some versions.
        // Let's try a different model name in the script: gemini-1.5-flash
    } catch (error) {
        console.error("Error:", error);
    }
};

// Start with a known working model test
const testModel = async (modelName) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
        console.log(`Testing model: ${modelName}`);
        const result = await model.generateContent("Hello");
        console.log(`Success with ${modelName}`);
    } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message);
    }
}

const run = async () => {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-1.0-pro");
};

run();
