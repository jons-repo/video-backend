//dotenv at top -> 
require("dotenv").config();

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const db = require('./db');
const app = express();
const pg = require("pg");



//will create a session store and pass in our database
// const sessionStore = new SequelizeStore({ db });

//Setting up Middleware
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors({
        //production front end url
        origin: process.env.FRONTEND_URL || "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        allowedHeaders:
        "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      preflightContinue: true,
    }));

    app.enable("trust proxy");

//Mounting on routes
    app.use('/api', require('./api'));

    app.get("/", (req, res, next) => {
        res.send("Hitting backend success!")
    })

    // 404 Handling - This route should be at the end to handle unknown routes
    app.use((req, res, next) => {
        const error = new Error('404 Not Found');
        error.status = 404;
        next(error);
    });

//start server and sync db
const syncDB = async () => {
    await db.sync();
    // await db.sync( {force: true });
    // app.listen(port, () => {
    //     console.log(`listening on port: ${port}`)
    // });
}

// Configuring all functions in one major function
syncDB();

module.exports = app;