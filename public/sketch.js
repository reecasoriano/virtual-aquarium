/********** [ SOCKET CONNECTION ] **********/

// establish client-side socket connection
let socket = io();

// ask user for their name
let username = window.prompt('Enter name: ');

socket.on('connect', () => {
    console.log("Client connected:", socket.id);

    // ping server with new-user event on connection
    socket.emit('new-user', { name: username });

    socket.on('allSockets', (socketsData) => {
        // populate array with all existing users
        for (let i = 0; i < socketsData.ids.length - 1; i++) {
            let pastUser = new userFish(windowWidth / 2, windowHeight / 2, socketsData.ids[i], socketsData.names[i]);
            allOtherUsers.push(pastUser);
        }
    });
});


/*********** [ P5 SKETCH ] **********/

let aquarium, seaweed, bubblePop;
let fromColor, toColor;
let user; // main fish controlled by user
let xPos, yPos, dir; // fish properties
let allOtherUsers = []; // array for all user fish
let school = []; // array for automated fish
let bubbleSize = 0;

/* ---------- PRELOAD ASSETS ---------- */
function preload() {
    aquarium = loadSound('assets/aquarium.m4a');
    aquarium.setVolume(0.1);
    seaweed = loadImage('assets/seaweed.png');
    bubblePop = loadSound('assets/pop.mp3');
    bubblePop.setVolume(0.5);
}

/* ---------- SETUP ---------- */
function setup() {
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent("canvas-container"); // assign to div

    // set colors for top to bottom gradient
    fromColor = color(212, 240, 250); // top color
    toColor = color(79, 178, 214); // bottom color

    // set default x and y positions
    xPos = windowWidth / 2;
    yPos = windowHeight / 2;
    dir = 1; // set direction that fish is facing

    // create fish controlled by user
    user = new userFish(xPos, yPos, 'me', username); // temp id

    socket.on('new-user', (data) => {
        // create new fish when new user joins
        let otherUser = new userFish(windowWidth / 2, windowHeight / 2, data.id, data.name);
        allOtherUsers.push(otherUser);
    });

    // update positions & move other users
    socket.on('userPositionServer', (data) => {
        moveOthers(data);
    });

    socket.on('user-left', (socketsData) => {
        let userIndex;
        // search for socket id of user that just disconnected
        for (let i = 0; i < allOtherUsers.length; i++) {
            if (allOtherUsers[i].id == socketsData.ids[socketsData.index]) {
                userIndex = i;
            }
        }
        // remove disconnected user from array on client
        if (userIndex > -1) {
            allOtherUsers.splice(userIndex, 1);
        }
    });

}

function draw() {

    /* ---------- AQUARIUM ---------- */
    // create gradient background
    for (let y = 0; y < windowHeight; y++) {
        inter = map(y, 0, windowHeight, 0, 1);
        let c = lerpColor(fromColor, toColor, inter);
        stroke(c);
        line(0, y, windowWidth, y);
    }

    // add seaweed images
    image(seaweed, 0, height / 2);
    image(seaweed, width / 1.1, height / 2);
    image(seaweed, width / 2, height / 2);
    image(seaweed, width / 3, height / 1.5);

    /* ---------- SOCKETS ---------- */
    // display and move users
    allOtherUsers.forEach(user => user.display());
    allOtherUsers.forEach(user => user.updatePosition(user.x, user.y));
    allOtherUsers.forEach(user => user.addName());

    // display & move current user
    user.display();
    user.updatePosition(xPos, yPos);
    user.addName();

    // move user fish
    arrowKeys();

    /* ---------- AUTOMATED FISH - SKETCH ---------- */
    // populate school array with fish
    for (let i = 0; i < school.length; i++) {
        school[i].display();
        school[i].swim();
    }

    /* ---------- BUBBLE - SKETCH ---------- */
    // draw bubble at center of canvas, size starting at 0
    bubble();

    // make bubble grow when you press & hold 'b'
    if (keyIsPressed && keyCode === 66) { // 'b' key code
        bubbleSize += 6;
    }

    // once bubble fills up the screen
    if (bubbleSize > width * 1.3 && bubbleSize > height * 1.3) {
        school = []; // empty school array (clear fish)
        bubbleSize = 0; // set size back to 0 (pop bubble)
        bubblePop.play(); // playing pop sound when bubble pops
    }
}


/* ---------- USER FISH MOVEMENT ---------- */
function arrowKeys() {
    // move left if left arrow is pressed
    if (keyIsDown(LEFT_ARROW)) {
        if (xPos > 50) { // constrain to canvas
            user.dir = -1;
            xPos -= 3;
        }
    }
    // move right if right arrow is pressed
    if (keyIsDown(RIGHT_ARROW)) {
        if (xPos < width - 50) { // constrain to canvas
            user.dir = 1;
            xPos += 3;
        }
    }
    // move down if down arrow is pressed
    if (keyIsDown(DOWN_ARROW)) {
        if (yPos < height - 50) { // constrain to canvas
            yPos += 3;
        }
    }
    // move up if up arrow is pressed
    if (keyIsDown(UP_ARROW)) {
        if (yPos > 50) { // constrain to canvas
            yPos -= 3;
        }
    }
    // update and send user position to server while user moves
    if (keyIsPressed && (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
        let userPos = {
            x: user.x,
            y: user.y,
            dir: user.dir
        };
        socket.emit('userPosition', userPos);
    }
}

/* ---------- UPDATE OTHER FISH MOVEMENT ---------- */
function moveOthers(data) {
    for (let i = 0; i < allOtherUsers.length; i++) {
        if (allOtherUsers[i].id == data.id) {
            allOtherUsers[i].x = data.x;
            allOtherUsers[i].y = data.y;
            allOtherUsers[i].dir = data.dir;
        }
    }
}

/* ---------- AUTOMATED FISH FUNCTION ---------- */
// add a fish at mouse location when mouse is pressed
function mousePressed() {
    // only add fish if you're NOT clicking on instructions button (location estimates: x: 10-140, y: 10-65)
    if (mouseX < 10 || mouseX > 140 || mouseY < 10 || mouseY > 65) {
        school.push(new automatedFish(mouseX, mouseY));
    }
}

/* ---------- BUBBLE FUNCTION ---------- */
// create a bubble
function bubble() {
    strokeWeight(0.5);
    stroke(color(107, 222, 237));
    fill(color(201, 235, 240, 150));
    ellipse(width / 2, height / 2, bubbleSize, bubbleSize);
}

/* ---------- KEYBOARD FUNCTIONS ---------- */
function keyPressed() {
    // delete last fish in school array
    if (keyCode === BACKSPACE) {
        school.pop();
    }

    // clear all fish
    if (keyCode === 27) { // escape key code
        school = [];
    }

    // delete (or "pop") bubble
    if (keyCode === 80) { // 'p' key code
        bubbleSize = 0;
        bubblePop.play();
    }

    // play/pause aquarium noise with spacebar
    if (keyCode === 32) { // spacebar key code
        if (aquarium.isPlaying() == true) {
            aquarium.pause();
        } else {
            aquarium.loop();
        }
    }
}