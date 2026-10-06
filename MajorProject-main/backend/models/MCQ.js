const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MCQ = sequelize.define('MCQ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON, // Stores array of strings ["Opt1", "Opt2", ...]
        allowNull: false
    },
    correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    explanation: {
        type: DataTypes.TEXT
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = MCQ;
