
const { sequelize } = require('./config/db');
const { MCQ } = require('./models');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const mcqs = await MCQ.findAll();
        console.log(`Found ${mcqs.length} MCQs.`);

        mcqs.forEach(m => {
            console.log(`MCQ ID: ${m.id}, Question: ${m.question.substring(0, 50)}...`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
