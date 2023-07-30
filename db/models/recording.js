const { DataTypes } = require('sequelize');
const db = require('../db');

//define takes in name of model, and then an object for each column of table
const Recording = db.define('recording', {
    blobUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    downloadUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Recording;