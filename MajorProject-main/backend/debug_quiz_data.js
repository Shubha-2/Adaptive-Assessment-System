
const { sequelize } = require('./config/db');
const { Quiz } = require('./models');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const quizzes = await Quiz.findAll();
        console.log(`Found ${quizzes.length} quizzes.`);

        quizzes.forEach(q => {
            console.log(`Quiz ID: ${q.id}, Title: ${q.title}`);
            console.log(`mcqIds Type: ${typeof q.mcqIds}`);
            console.log(`mcqIds Value:`, q.mcqIds);
            console.log(`Is Array? ${Array.isArray(q.mcqIds)}`);
            console.log('-----------------------------------');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
