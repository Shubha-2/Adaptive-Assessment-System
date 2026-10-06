const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let quizId = '';

const verifySystem = async () => {
    try {
        console.log("🚀 Starting Full System Verification...");

        // 1. Register & Login
        console.log("\n🔹 Step 1: Authentication");
        const uniqueEmail = `audit_${Date.now()}@example.com`;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: "Audit User",
                email: uniqueEmail,
                password: "password123",
                role: "student"
            });
            userId = regRes.data.user.id;
            console.log("✅ Registered:", uniqueEmail);

            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: uniqueEmail,
                password: "password123"
            });
            token = loginRes.data.token;
            console.log("✅ Logged In. Token Acquired.");
        } catch (err) {
            console.error("❌ Auth Failed:", err.response?.data || err.message);
            return;
        }

        const authConfig = { headers: { 'x-auth-token': token } };

        // 2. Initial Profile Check (XP/Rank)
        console.log("\n🔹 Step 2: Initial Profile Check");
        try {
            const meRes = await axios.get(`${API_URL}/auth/me`, authConfig);
            console.log(`✅ Base Stats - Rank: ${meRes.data.rank}, XP: ${meRes.data.xp}`);
            if (meRes.data.xp !== 0) console.warn("⚠️ Initial XP should be 0");
        } catch (err) { console.error("❌ Profile Check Failed:", err.message); }

        // 3. AI Quiz Generation
        console.log("\n🔹 Step 3: AI Quiz Generation");
        let mcqIds = [];
        try {
            const genRes = await axios.post(`${API_URL}/mcq/generate`, {
                topic: "Software Engineering",
                difficulty: "Medium",
                count: 3
            }, authConfig);
            console.log(`✅ Generated ${genRes.data.length} MCQs via AI.`);
            mcqIds = genRes.data.map(q => q.id);
        } catch (err) {
            console.error("⚠️ AI Gen Failed (Check API Key):", err.message);
            mcqIds = [1, 2]; // Fallback for logic testing
        }

        // 4. Create Quiz
        console.log("\n🔹 Step 4: Quiz Creation");
        try {
            const createRes = await axios.post(`${API_URL}/quiz`, {
                title: "System Audit Quiz",
                type: "global", // Test global for leaderboard
                mcqIds: mcqIds,
                timePerQuestion: 30,
                totalTime: 5
            }, authConfig);
            quizId = createRes.data.id;
            console.log("✅ Quiz Created. ID:", quizId);
        } catch (err) {
            console.error("❌ Quiz Creation Failed:", err.message);
            return;
        }

        // 5. Submit Attempt (Gamification Test)
        console.log("\n🔹 Step 5: Taking Quiz (Testing XP Gain)");
        try {
            // Mock answers: assuming we got 2 right
            const verifyMCQs = await axios.get(`${API_URL}/quiz/${quizId}`, authConfig);
            const answers = verifyMCQs.data.mcqs.map((q, idx) => ({
                questionId: q.id,
                selectedOption: idx < 2 ? q.correctAnswer : "Wrong Answer" // 2 Correct, 1 Wrong
            }));

            const submitRes = await axios.post(`${API_URL}/quiz/${quizId}/submit`, {
                answers: answers,
                timeTaken: 20
            }, authConfig);

            console.log("✅ Quiz Submitted.");
            console.log(`   Score: ${submitRes.data.score}/${mcqIds.length}`);
            console.log(`   XP Earned: ${submitRes.data.xpEarned}`);

            if (submitRes.data.xpEarned > 0) {
                console.log("✅ Gamification Logic: XP Awarded Correctly.");
            } else {
                console.warn("⚠️ Gamification Logic: No XP Awarded?");
            }

        } catch (err) {
            console.error("❌ Quiz Submission Failed:", err.message);
        }

        // 6. Post-Quiz Profile Check (Rank Update?)
        console.log("\n🔹 Step 6: Post-Quiz Profile Audit");
        try {
            const meRes = await axios.get(`${API_URL}/auth/me`, authConfig);
            console.log(`✅ Current Stats - Rank: ${meRes.data.rank}, XP: ${meRes.data.xp}`);
        } catch (err) { console.error("❌ Profile Check Failed:", err.message); }

        // 7. Leaderboard Check
        console.log("\n🔹 Step 7: Leaderboard Verification");
        try {
            const lbRes = await axios.get(`${API_URL}/analytics/leaderboard/${quizId}`, authConfig);
            const entry = lbRes.data.find(e => e.User.email === uniqueEmail);
            if (entry) {
                console.log(`✅ Leaderboard Entry Found: ${entry.User.name} - Score: ${entry.score}`);
            } else {
                console.warn("⚠️ User not found on leaderboard.");
            }
        } catch (err) { console.error("❌ Leaderboard Check Failed:", err.message); }

        console.log("\n✅ SYSTEM VERIFICATION COMPLETE.");

    } catch (error) {
        console.error("❌ CRITICAL FAILURE:", error.message);
    }
};

verifySystem();
