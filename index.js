// require express
let express = require('express');
let app = express();
app.use('/', express.static('public'));

// initialize server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server is listening at port: " + port);
});

let socketIDs, userProperties;
let socketNames = [];

// initialize socket.io and create new server
let io = require('socket.io');
io = new io.Server(server);

// establish socket connection
io.sockets.on('connection', (socket) => {
    console.log("New client connected:", socket.id);

    // broadcast new user's socket id and name to other clients
    socket.on('new-user', (data) => {
        userProperties = { id: socket.id, name: data.name };
        socketNames.push(userProperties.name); // store name in array
        socket.broadcast.emit('new-user', userProperties);
    });

    /* let new client know how many users already exist */
    // grab all of the sockets
    let allSockets = io.sockets.sockets;
    // create an empty array to store all of the socket ids
    socketIDs = [];

    // use the forEach method to loop through the sockets 'map'
    allSockets.forEach((value, key) => {
        socketIDs.push(value.id);
    });

    // share all of the existing socketIDs and socketNames to the new user who joined
    let socketsData = { ids: socketIDs, names: socketNames };
    socket.emit('allSockets', socketsData);

    // on receiving 'userPosition', emit position to other clients
    socket.on('userPosition', (data) => {
        data.id = socket.id;
        io.sockets.emit('userPositionServer', data);
    });

    socket.on('disconnect', () => {
        console.log('Client left:', socket.id);

        // find index of socket that just disconnected
        let index = socketIDs.indexOf(socket.id);
        socketsData = { ids: socketIDs, index: index };

        io.sockets.emit('user-left', socketsData);

        // remove socket from array in server
        if (index > -1) {
            socketIDs.splice(index, 1);
        }

    });
});