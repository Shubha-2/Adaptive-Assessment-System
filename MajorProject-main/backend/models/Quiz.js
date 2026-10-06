const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('local', 'global'),
        defaultValue: 'local'
    },
    // We will handle mcqs via associations or a JSON array if simple. 
    // JSON array is easier for simple porting from Mongoose Ref array.
    mcqIds: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    timePerQuestion: {
        type: DataTypes.INTEGER,
        defaultValue: 60 // seconds
    },
    totalTime: {
        type: DataTypes.INTEGER,
        defaultValue: 30 // minutes
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Quiz;
