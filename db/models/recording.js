const { DataTypes } = require('sequelize');
const db = require('../db');

//define takes in name of model, and then an object for each column of table
const Recording = db.define('recording', {
    blob: {
        type: DataTypes.BLOB,
        allowNull: false,
    }
})

module.exports = Recording;