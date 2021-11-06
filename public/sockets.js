/********** [ SOCKET CONNECTION ] **********/

// establish client-side socket connection (SOCKET STEP 2)
let socket = io();

socket.on('connect', () => {
  console.log('Connected');
});

/* [ATTEMPT 1 - trying to place code outside of draw function] */
// listen to data from the server (SOCKET STEP 6)
socket.on('fish-data', (data) => {
    // console.log(data);
    drawFish(data);
});

function drawFish(pos) {
    let newUser = new userFish(pos.x, pos.y);
    newUser.display();
}


/*** SOCKET STEPS 
 *  [x] 1. Initialize Socket.io (index.js:15)
 *  [x] 2. Establish client-side socket connection (sockets.js:4)
 *  [x] 3. Emit user data from client to server (sketch.js:109)
 *  [x] 4. Listen for user data from client (index.js:23)
 *  [?] 5. Send data from server to all clients (index.js:27)
 *  [?] 6. Listen to data from server (sockets.js:12 OR sketch.js:113???)
 * ***/
