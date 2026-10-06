const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateMCQs = async (topic, difficulty, count, sourceText = '') => {
    // Check if API key is present
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API Key is missing');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let prompt = '';
    if (sourceText) {
        prompt = `Generate ${count} multiple choice questions based on the following text content. The questions should be of ${difficulty} difficulty.
        
        TEXT CONTENT:
        "${sourceText.substring(0, 10000)}" // Limit context to avoid token limits

        Format the output as a JSON array of objects, where each object has the following keys:
        - question: The question text
        - options: An array of 4 distinct options
        - correct_answer: The correct answer (must be one of the options)
        - explanation: A brief explanation of the correct answer
        - topic: "${topic || 'Custom Content'}"
        - difficulty: "${difficulty}"
        
        IMPORTANT: return ONLY the raw JSON array. Do not wrap it in markdown code blocks.`;
    } else {
        prompt = `Generate ${count} multiple choice questions on the topic "${topic}" with ${difficulty} difficulty. 
        Format the output as a JSON array of objects, where each object has the following keys:
        - question: The question text
        - options: An array of 4 distinct options
        - correct_answer: The correct answer (must be one of the options)
        - explanation: A brief explanation of the correct answer
        - topic: "${topic}"
        - difficulty: "${difficulty}"
        
        IMPORTANT: return ONLY the raw JSON array. Do not wrap it in markdown code blocks (like \`\`\`json). Do not add any introductory text.`;
    }

    try {
        console.log(`Sending prompt to Gemini (${model.model})...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log("Gemini response received. Length:", text.length);
        console.log("Raw Response Preview:", text.substring(0, 200)); // Log detailed preview

        // Cleanup: Remove markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Extract JSON Array: Find first '[' and last ']'
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        } else {
            console.error("AI Error: No JSON array found in response.");
            throw new Error("AI response did not contain a valid JSON array.");
        }

        try {
            const parsedData = JSON.parse(text);
            if (!Array.isArray(parsedData)) {
                throw new Error("AI response is not an array.");
            }
            return parsedData;
        } catch (parseError) {
            console.error("JSON Parse Error. Cleaned Text:", text);
            throw new Error("Failed to parse AI response: " + parseError.message);
        }
    } catch (error) {
        console.error('Error in generateMCQs:', error);
        throw new Error('Failed to generate MCQs: ' + error.message);
    }
};

module.exports = { generateMCQs };
