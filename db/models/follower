const { Model, DataTypes } = require('sequelize');
const db = require("../db");

class Follow extends Model { }

Follow.init(
    {
        follower: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        following: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "Follow",
    }
);

module.exports = Follow;