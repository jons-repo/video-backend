const { DataTypes } = require('sequelize');
const db = require('../db');

const Chat = db.define('chat', {
    message: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
})

module.exports = Chat;