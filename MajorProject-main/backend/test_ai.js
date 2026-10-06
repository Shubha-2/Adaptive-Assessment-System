require('dotenv').config();
const { generateMCQs } = require('./utils/aiGenerator');
const fs = require('fs');

const testGen = async () => {
    try {
        console.log("Testing AI Generation...");
        const result = await generateMCQs("Javascript Event Loop", "Medium", 3);
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (error) {
        fs.writeFileSync('error.log', error.toString() + "\n" + (error.stack || ""));
        console.error("Test Failed. Check error.log");
    }
};

testGen();
