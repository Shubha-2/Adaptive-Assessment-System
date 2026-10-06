
const { sequelize } = require('./config/db');
const { Attempt, User } = require('./models');
const analyticsController = require('./controllers/analytics.controller');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Mock Req/Res
        const req = {
            params: { quizId: 1 }, // Valid ID
            user: { id: 1 } // Mock user
        };

        const res = {
            json: (data) => console.log('Response JSON:', JSON.stringify(data, null, 2)),
            status: (code) => {
                console.log('Response Status:', code);
                return {
                    send: (msg) => console.log('Response Send:', msg),
                    json: (msg) => console.log('Response JSON (Error):', msg)
                };
            }
        };

        console.log('Testing getLeaderboard with quizId=1...');
        await analyticsController.getLeaderboard(req, res);

        console.log('Testing getLeaderboard with quizId="abc"...');
        req.params.quizId = "abc";
        await analyticsController.getLeaderboard(req, res);

    } catch (error) {
        console.error('Script Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
