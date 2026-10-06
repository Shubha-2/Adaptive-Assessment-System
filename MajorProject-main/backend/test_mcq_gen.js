const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

async function testMCQ() {
    try {
        // 1. Auth to get token
        const uniqueUser = `testuser_${Date.now()}`;
        console.log(`[Auth] Registering user: ${uniqueUser}`);

        // Register or login
        let token;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: uniqueUser,
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = regRes.data.token;
        } catch (e) {
            // Login if exists
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = loginRes.data.token;
        }
        console.log('[Auth] Token received');

        // 2. Generate MCQ (Text)
        console.log('[MCQ] Testing Text Generation...');
        const textPayload = {
            sourceText: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the aid of chlorophyll.",
            count: 2,
            difficulty: "Easy",
            topic: "Biology"
        };

        // Note: The route uses multer, so we use FormData.

        try {
            // If JSON fails, it might be because of multer expecting multipart
            const form = new FormData();
            form.append('sourceText', textPayload.sourceText);
            form.append('count', textPayload.count);
            form.append('difficulty', textPayload.difficulty);
            form.append('topic', textPayload.topic);

            const res = await axios.post(`${API_URL}/mcq/generate`, form, {
                headers: {
                    'x-auth-token': token,
                    ...form.getHeaders()
                }
            });
            console.log('✅ FormData Text Generation Successful!');
            console.log('Response:', JSON.stringify(res.data, null, 2));

        } catch (error) {
            console.log('⚠️ Generation failed');
            console.error('❌ MCQ Test Failed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }

    } catch (error) {
        console.error('❌ MCQ Test Failed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testMCQ();
