const app = require ("./app");
const http = require('http');
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001

const server = http.createServer(app);
const io = new Server (server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders:
        "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      preflightContinue: true,
    }
});
// const io = new Server(server);

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
        console.log(`user with id ${socket.id} and name ${data.username} created room: ${data.livestreamCode}`);

        const newUser = {
            name: data.username,
            socketId: socket.id,
            livestreamCode: data.livestreamCode,
            onlyAudio: data.onlyAudio,
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
        console.log(`user with id ${socket.id} and name ${data.username} joined room: ${data.livestreamCode}`);

        const newUser = {
            name: data.username,
            socketId: socket.id,
            livestreamCode: data.livestreamCode,
            onlyAudio: data.onlyAudio,
        }

        connectedUsers = [...connectedUsers, newUser];

        const livestreamRoom = livestreamRooms.find((room) => room.livestreamCode === data.livestreamCode);
        livestreamRoom.connectedUsers = [...livestreamRoom.connectedUsers, newUser];

        //emit to all users which are already in this room to prepare peer connection
        livestreamRoom.connectedUsers.forEach((user) => {
            //do not want to send message to self
            if(user.socketId !== socket.id){
                const data = {
                    connectedUserSocketId: socket.id,
                };

            //user which just joined room needs to inform the other already connected users to prepare for peer connection    
            io.to(user.socketId).emit('prepare-connection', data);
        }
    })

        io.to(data.livestreamCode).emit('update-livestream', {participantsInLivestream: livestreamRoom.connectedUsers});

    })

    socket.on('connection-signal', (data) => {
        const { connectedUserSocketId, signal } = data;

        //changing the connected user socket id from the sender,
        const signalingData = {signal, connectedUserSocketId: socket.id}

        io.to(connectedUserSocketId).emit("connection-signal", signalingData);
    })


    socket.on("initialize-connection", (data) => {
        const{connectedUserSocketId} = data;
        //init data now contains the socket id of the already existing users (swapped)
        const initData = {connectedUserSocketId: socket.id};
        io.to(connectedUserSocketId).emit('initialize-connection', initData);
    })


    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        const disconnectedUser = connectedUsers.find((user) => user.socketId === socket.id);

        if(disconnectedUser){
            const livestreamRoom = livestreamRooms.find((room) => room.livestreamCode === disconnectedUser.livestreamCode);

            livestreamRoom.connectedUsers = livestreamRoom.connectedUsers.filter((user) => user.socketId !== socket.id);

            //leave socket io room
            socket.leave(disconnectedUser.livestreamCode);

            if(livestreamRoom.connectedUsers.length > 0) {

                //emit event to all users still in room that user disconnected
                io.to(livestreamRoom.livestreamCode).emit('user-disconnected', {socketId: socket.id});

                //update list of participants in livestream
                io.to(livestreamRoom.livestreamCode).emit('update-livestream', {
                    participantsInLivestream: livestreamRoom.connectedUsers
                });
            }
            else { //else if no users are left in room, close the room
                livestreamRooms = livestreamRooms.filter((room) => room.livestreamCode !== room.livestreamCode);
            }

        }

        console.log("user disconnected", socket.id);
    });

})

server.listen(PORT, () => {
    console.log("server running on port 3001");
})
