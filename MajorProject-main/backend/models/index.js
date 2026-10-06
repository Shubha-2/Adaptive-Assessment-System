const User = require('./User');
const MCQ = require('./MCQ');
const Quiz = require('./Quiz');
const Attempt = require('./Attempt');

// User - Quiz Relation
User.hasMany(Quiz, { foreignKey: 'createdBy' });
Quiz.belongsTo(User, { foreignKey: 'createdBy' });

// Quiz - MCQ Relation
// Since we are using JSON array for mcqIds in Quiz for simplicity in this migration
// We might not use standard association for fetching MCQs automatically via include
// But we can still define it if we were using a join table.
// For now, we will handle fetching MCQs manually in the controller using the ID array.

// User - Attempt Relation
User.hasMany(Attempt, { foreignKey: 'userId' });
Attempt.belongsTo(User, { foreignKey: 'userId' });

// Quiz - Attempt Relation
Quiz.hasMany(Attempt, { foreignKey: 'quizId', onDelete: 'CASCADE' });
Attempt.belongsTo(Quiz, { foreignKey: 'quizId', onDelete: 'CASCADE' });

module.exports = {
    User,
    MCQ,
    Quiz,
    Attempt
};
