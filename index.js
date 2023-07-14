const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const db = require('./db');

require("dotenv").config();

//will create a session store and pass in our database
const sessionStore = new SequelizeStore({ db });

//helper functions (from passport js)
const serializeUser = (user, done) => done(null, user.id);
const deserializeUser = async(id, done) => {
    try{
        const user = await db.models.user.findByPk(id);
        done(null, user);
    } catch(error){
        done(error);
    }
}

//configs
const configSession = () => ({
    secret: "ttp2023summer",
    store: sessionStore,
    resave: false, //for how many times we send it to the frontend (refresh, should save)
    saveUninitialized: false,
    cookie: {maxAge: 8 * 60 * 60 * 1000}, // 8 hours
    httpOnly: true,
})

//Setting up Middleware
const setupMiddleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    }));
    app.use(session(configSession()));
    app.use(passport.initialize());
    app.use(passport.session());
    return app;
}

//passport setup
const setupPassport = () => {
    passport.serializeUser(serializeUser); //adds user to session (initialize session with specific user)
    passport.deserializeUser(deserializeUser); //remove user from session (remove user in session)
}

//Mounting on routes
const setupRoutes = (app) => {
    app.use('/api', require('./api'));
    app.use('/auth', require('./auth'));
};

//start server and sync db
const startServer = async (app, port) => {
    await db.sync();
    //if want to drop table rows:
    // await db.sync( {force: true });
    app.listen(port, () => {
        console.log(`listening on port: ${port}`)
    });
    return app;
}

// Configuring all functions in one major function
const configureApp = async(port) => {
    const app = express();
    setupPassport();
    setupMiddleware(app);
    await sessionStore.sync();
    setupRoutes(app);
    return startServer(app, port);
};

module.exports = configureApp(8080);
