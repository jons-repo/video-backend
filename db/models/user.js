const crypto = require('crypto'); //will be used for encrypting (salting+hashing)
const {Model, DataTypes} = require('sequelize');
const db = require("../db");


//defining the class
class User extends Model {
    static async generateSalt(){
        return crypto.randomBytes(16).toString('base64'); //create a salt
    }

    static async encryptPassword(password, salt){
        //create hash, update it with password and with salt, and spit everything out using hex value
        return crypto
        .createHash('RSA-SHA256') //will use RSA-SHA256 algorithm to hash
        .update(password)
        .update(salt)
        .digest("hex");
    }

    //instances method to check password
    async correctPassword(passwordAttempt){
        //encrypt the password in same way and check if its the correct password (same as encryptes password in db)
        return User.encryptPassword(passwordAttempt, this.salt) === this.password;
    }
}

//Define user model
User.init(
    {
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        salt: { //salt is needed to run the encryption again, each user will have unique salt
            type: DataTypes.STRING
        },
        googleId: { //for OAuth
            type: DataTypes.STRING,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        messageLanguage:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'EN',
        },
        siteLanguage:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'EN',
        },
        streamLanguage:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'EN',
        }
    },

    //options object next
    {
        sequelize: db,
        modelName: "User",
        hooks: {//hook into lifecycle events
            beforeSave: async(user)=> {
                if(user.changed('password')){
                    //if user changed password, salt will be changed too
                    user.salt = await User.generateSalt();
                    user.password = await User.encryptPassword(user.password, user.salt);
                }
            },
            //for bulk seeds/create
            beforeBulkCreate: async (users) => {
                users.forEach( async (user) => {
                    if(user.changed("password")){
                        user.salt = await User.generateSalt();
                        user.password = await User.encryptPassword(user.password, user.salt);
                    }
                })
            },
        },
    }
);

module.exports = User;