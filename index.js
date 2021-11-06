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

    // listen for user fish position data from client (SOCKET STEP 4)
    socket.on('data', (data) => {
        console.log(data); // prints user fish position to server console

        // send user fish position to all clients, including myself (SOCKET STEP 5)
        io.sockets.emit('fish-data', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected: ' + socket.id);
    });
});