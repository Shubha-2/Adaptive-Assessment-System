const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'teacher'),
        defaultValue: 'student'
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rank: {
        type: DataTypes.STRING,
        defaultValue: 'Cadet'
    }
}, {
    timestamps: true
});

module.exports = User;
