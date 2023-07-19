const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {User} = require ("../db/models");
// require("dotenv").config();

const dotenv = require("dotenv").config().parsed;

// /auth/google

//Passport Google OAuth Strategy (Strategy is way for setting up and implementing oauth)
passport.use(
    new GoogleStrategy(
        {
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // callbackURL: process.env.GOOGLE_CALLBACK_URL,
            clientID: dotenv.GOOGLE_ID,
            clientSecret: dotenv.GOOGLE_CLIENT_SECRET,
            callbackURL: dotenv.GOOGLE_CALLBACK_URL,
            passReqToCallback :true
        },
        
        async(req, accessToken, refreshToken, profile, done) => {
            try{
                console.log(profile);
                const googleId = profile.id;
                const email = profile.emails[0].value;
                const imgUrl = profile.photos[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;
                const fullName = profile.displayName;

                //Try to find user in db, if not present create ne user
                const [user] = await User.findOrCreate({
                    where: {googleId},
                    defaults: {email, imgUrl, firstName, lastName, fullName}, //dont need password, google handles authentication
                });
                console.log('done');
                done(null, user)
            }
            catch(error){
                done(error);
            }
        }
    )
)

//mounted on /auth/google

//trigger google oauth
router.get(
    "/", 
    passport.authenticate("google", {scope: ["profile", "email"]})
);
//above we are authenticating using the passport strategy and then pulling out the persons profile and email

//auth/google/callback
//google oauth callback
router.get(
    "/callback", 
    passport.authenticate("google", {
        failureRedirect: "http://localhost:3001/login", 
        // successRedirect: "/", --> passing in req, res function instead
    }),
    (req, res) => {
        //successfull authentication, redirect home
        // res.redirect("http://localhost:3000/home");
        res.redirect("http://localhost:3000/");
    }
);

module.exports = router;