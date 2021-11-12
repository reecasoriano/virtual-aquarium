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

// initialize socket.io and create new server (SOCKET STEP 1)
let io = require('socket.io');
io = new io.Server(server);

// establish socket connection
io.sockets.on('connection', (socket) => {
    console.log("We have a new client: " + socket.id);
    // emit new fish on connection
    io.emit('new-fish', socket.id);

    // listen for user fish data from client (SOCKET STEP 4)
    socket.on('user-data', (data) => {
        // console.log(data); // prints user fish data to server console
        // data.id = socket.id;

        // send user fish position to all clients, including myself (SOCKET STEP 5)
        //io.sockets.emit('new-fish-data', data);
    });

    /* let new client know how many users already exist */
    // grab all of the sockets
    let allSockets = io.sockets.sockets;
    // create an empty array to store all of the socket ids
    let socketIDs = [];
    // use the forEach method to loop through the sockets 'map'
    allSockets.forEach((value, key) => {
        socketIDs.push(value.id);
    });
    console.log(socketIDs);

    // send an .emit() just to the new user who joined
    // share all of the existing socketIDs
    // note this will include the id for this user as well 
    let socketsData = {ids : socketIDs};
    socket.emit('allSockets', socketsData);


    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    });
});