const { DataTypes } = require('sequelize');
const db = require('../db');

const Message = db.define('message', {
    content: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
})

module.exports = Message;