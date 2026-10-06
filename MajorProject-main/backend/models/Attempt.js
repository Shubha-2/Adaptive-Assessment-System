const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Quiz = require('./Quiz');

const Attempt = sequelize.define('Attempt', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Quiz,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    answers: {
        type: DataTypes.JSON, // Array of { questionId, selectedOption, isCorrect }
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeTaken: {
        type: DataTypes.INTEGER, // in seconds
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = Attempt;
