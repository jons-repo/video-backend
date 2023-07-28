const { Sequelize } = require('sequelize');
const {name} = require('../package.json');

// const db = new Sequelize(`postgres://localhost:5432/${name}`, {
const db = new Sequelize(`postgres://postgres:roman123@localhost:5432/${name}`, {
    logging: false,
    //IMPORTANT SEE WHETHER NEED THE FOLLOWING//
    // dialectOptions: {
    //     ssl: true,
    //     native: true,
    // }
});

module.exports = db;