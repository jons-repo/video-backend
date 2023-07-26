const { DataTypes } = require('sequelize');
const db = require('../db');

//define takes in name of model, and then an object for each column of table
const Videochat = db.define('videochat', {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "new videochat",
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Videochat;