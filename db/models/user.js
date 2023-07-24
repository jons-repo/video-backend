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
        firstName: {
            type: DataTypes.STRING,
            defaultValue: 'Jenny',
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            defaultValue: 'Craig',
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            defaultValue: 'Jenny Craig',
            allowNull: false,
        },
        imgUrl: {
            type: DataTypes.STRING(1000),
            defaultValue: "https://i0.wp.com/cfe.umich.edu/wp-content/uploads/2015/09/blank-profile.jpg?fit=4016%2C2677&ssl=1",
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
        language:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'EN',
        },
        bio: {
            type: DataTypes.STRING(100),
            defaultValue:'I love tennis, movies, music, and more! Let\'s connect!'
        },
        isDeactivated: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        emailNotifications:{
            type: DataTypes.BOOLEAN,
            defaultValue:true
        },
        mobileNotifications:{
            type: DataTypes.BOOLEAN,
            defaultValue:true
        },
        country:{
            type: DataTypes.STRING(100),
            defaultValue: 'US'
        },
        city:{
            type: DataTypes.STRING(100),
            defaultValue: 'Denver'
        },
        state:{
            type: DataTypes.STRING(100),
            defaultValue: 'CO'
        },
    },

    /**
 * Profile: username, bio, topics, location(city,state,zip)
 * Account: first name, last name, email, phone number, deactivate
 * Preferences: language, notifications (phone/email), make private
 * 
 */

    // const googleId = profile.id;
    //             const email = profile.emails[0].value;
    //             const imgUrl = profile.photos[0].value;
    //             const firstName = profile.name.givenName;
    //             const lastName = profile.name.familyName;
    //             const fullName = profile.displayName;
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