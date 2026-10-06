const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

async function testLogin() {
    try {
        console.log("Attempting to register...");
        const email = `test_${Date.now()}@example.com`;
        const regResponse = await api.post('/auth/register', {
            name: 'Axios Test',
            email: email,
            password: 'password123',
            role: 'student'
        });
        console.log("Registration successful:", regResponse.data);

        console.log("Attempting to login...");
        const loginResponse = await api.post('/auth/login', {
            email: email,
            password: 'password123'
        });
        console.log("Login successful:", loginResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
}

testLogin();
