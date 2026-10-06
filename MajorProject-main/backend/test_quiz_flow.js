const axios = require('axios');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

async function testFullFlow() {
    try {
        // 1. Auth (Register/Login)
        const uniqueUser = `flowuser_${Date.now()}`;
        console.log(`[Flow] 1. Auth: Registering user ${uniqueUser}...`);

        let token;
        let userId;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: uniqueUser,
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = regRes.data.token;
            userId = regRes.data.user.id;
        } catch (e) {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: `${uniqueUser}@example.com`,
                password: 'password123'
            });
            token = loginRes.data.token;
            userId = loginRes.data.user.id;
        }
        console.log('✅ Auth Successful. Token obtained.');

        // 2. Generate MCQs
        console.log('[Flow] 2. Generating MCQs...');
        const form = new FormData();
        form.append('sourceText', "Simple test content for quiz generation. The capital of France is Paris. Water boils at 100 degrees Celsius.");
        form.append('count', 2);
        form.append('difficulty', "Easy");
        form.append('topic', "General Knowledge");

        const mcqRes = await axios.post(`${API_URL}/mcq/generate`, form, {
            headers: { 'x-auth-token': token, ...form.getHeaders() }
        });

        const generatedMCQs = mcqRes.data;
        if (!generatedMCQs || generatedMCQs.length === 0) throw new Error("No MCQs generated");
        const mcqIds = generatedMCQs.map(q => q.id);
        console.log(`✅ Generated ${mcqIds.length} MCQs. IDs: ${mcqIds}`);

        // 3. Create Quiz
        console.log('[Flow] 3. Creating Quiz...');
        const quizPayload = {
            title: `Test Quiz ${Date.now()}`,
            type: 'local',
            mcqIds: mcqIds,
            timePerQuestion: 30,
            totalTime: 5
        };

        const quizRes = await axios.post(`${API_URL}/quiz`, quizPayload, {
            headers: { 'x-auth-token': token }
        });
        const quizId = quizRes.data.id;
        console.log(`✅ Quiz Created. ID: ${quizId}`);

        // 4. Submit Attempt
        console.log('[Flow] 4. Submitting Attempt...');

        // Construct answers (mocking correct answers for simplicity, or just random)
        const answers = generatedMCQs.map(q => ({
            questionId: q.id,
            selectedOption: q.correctAnswer // Let's try to get them right!
        }));

        const attemptPayload = {
            quizId: quizId,
            answers: answers,
            timeTaken: 10
        };

        const submitRes = await axios.post(`${API_URL}/analytics/submit`, attemptPayload, {
            headers: { 'x-auth-token': token }
        });

        console.log('✅ Attempt Submitted!');
        console.log('Score:', submitRes.data.attempt.score);
        console.log('User XP:', submitRes.data.userStats.xp);

        if (submitRes.data.attempt.score !== mcqIds.length) {
            console.warn('⚠️ Score mismatch! Check logic.');
        }

    } catch (error) {
        console.error('❌ Flow Test Failed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testFullFlow();
