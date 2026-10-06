const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testJSON() {
    try {
        // 1. Auth
        const uniqueUser = `jsonuser_${Date.now()}`;
        console.log(`[JSON] Registering user: ${uniqueUser}`);

        let token;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: uniqueUser,
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = regRes.data.token;
        } catch (e) {
            console.log('Login fallback');
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = loginRes.data.token;
        }

        // 2. Test JSON
        console.log('[JSON] Sending JSON payload...');
        const payload = {
            topic: "Math",
            difficulty: "Easy",
            count: 2,
            sourceText: ""
        };

        const res = await axios.post(`${API_URL}/mcq/generate`, payload, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ JSON Request Successful!');
    } catch (error) {
        console.error('❌ JSON Request Failed:', error.response ? error.response.data : error.message);
    }
}

testJSON();
