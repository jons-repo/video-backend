const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const db = require('./db');
const app = express();


const http = require('http');
const {Server } = require("socket.io");
// app.use(cors());

const server = http.createServer(app);
// const io = new Server (server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     }
// });
const io = new Server(server);

let connectedUsers = [];
let livestreamRooms = [];

io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    // socket.on("join_room", (data) => {
    //     socket.join(data);
    //     console.log(`user with id ${socket.id} joined room: ${data}`);
    // })

    socket.on("host-new-livestream", (data) => {
        socket.join(data.livestreamCode);
        console.log(`user with id ${socket.id} and name ${data.fullName} created room: ${data.livestreamCode}`);

        const newUser = {
            name: data.fullName,
            socketId: socket.id,
            livestreamCode: data.livestreamCode,
        }

        connectedUsers = [...connectedUsers, newUser];

        const newLivestreamRoom = {
            livestreamCode: data.livestreamCode,
            connectedUsers: [newUser],
        }

        livestreamRooms = [...livestreamRooms, newLivestreamRoom];

        socket.emit('update-livestream', {participantsInLivestream: newLivestreamRoom.connectedUsers});
        // socket.join(data.livestreamCode);
    });

    socket.on("join-livestream", (data) => {
        socket.join(data.livestreamCode);
        console.log(`user with id ${socket.id} and name ${data.fullName} joined room: ${data.livestreamCode}`);

        const newUser = {
            name: data.fullName,
            socketId: socket.id,
            livestreamCode: data.livestreamCode,
        }

        connectedUsers = [...connectedUsers, newUser];

        const livestreamRoom = livestreamRooms.find((room) => room.livestreamCode === data.livestreamCode);
        livestreamRoom.connectedUsers = [...livestreamRoom.connectedUsers, newUser];

        io.to(data.livestreamCode).emit('update-livestream', {participantsInLivestream: livestreamRoom.connectedUsers});

    })

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    })
})


server.listen(3001, () => {
    console.log("server running on port 3001");
})

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
    // app.listen(port, () => {
    //     console.log(`listening on port: ${port}`)
    // });
    return app;
}

// Configuring all functions in one major function
const configureApp = async(port) => {
    setupPassport();
    setupMiddleware(app);
    await sessionStore.sync();
    setupRoutes(app);
    return startServer(app, port);
};

module.exports = configureApp(3001);
