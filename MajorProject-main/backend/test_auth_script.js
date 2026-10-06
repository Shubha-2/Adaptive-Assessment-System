const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    try {
        // 1. Register
        const uniqueUser = `testuser_${Date.now()}`;
        console.log(`Attempting to register user: ${uniqueUser}`);

        try {
            await axios.post(`${API_URL}/register`, {
                name: uniqueUser,
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            console.log('✅ Registration Successful');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.msg === 'User already exists') {
                console.log('⚠️ User already exists, proceeding to login');
            } else {
                throw error;
            }
        }

        // 2. Login
        console.log(`Attempting to login user: ${uniqueUser}`);
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: `${uniqueUser}@example.com`,
            password: 'password123'
        });

        if (loginRes.data.token) {
            console.log('✅ Login Successful');
            console.log('Token received');
            return loginRes.data.token;
        } else {
            console.error('❌ Login failed: No token received');
        }

    } catch (error) {
        console.error('❌ Auth Test Failed:', error.response ? JSON.stringify(error.response.data, null, 2) : error);
    }
}

testAuth();
