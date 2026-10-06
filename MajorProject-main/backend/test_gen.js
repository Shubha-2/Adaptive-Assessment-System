const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testGen = async () => {
    try {
        console.log("Testing AI MCQ Generation...");
        // Mock a login to get a token (needed if route is protected, which it IS)
        // actually, I need a token. 
        // Let's register a temp user to get a token.
        const uniqueEmail = `debug_${Date.now()}@example.com`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: "Debug User",
            email: uniqueEmail,
            password: "password",
            role: "teacher"
        });
        const token = regRes.data.token;

        console.log("Got Token. Sending Generate Request...");

        const genRes = await axios.post(`${API_URL}/mcq/generate`, {
            topic: "History of Rome",
            difficulty: "Easy",
            count: 3
        }, {
            headers: { 'x-auth-token': token }
        });

        console.log("Success! Data:", JSON.stringify(genRes.data, null, 2));

    } catch (error) {
        console.error("FAILED:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testGen();
