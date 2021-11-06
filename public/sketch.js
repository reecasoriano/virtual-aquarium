/*********** [ P5 SKETCH ] **********/

let aquarium, seaweed, bubblePop;
let fromColor, toColor;
let user; // main fish controlled by user
let school = []; // array for automated fish
let bubbleSize = 0;
let leftButtonCount = 0;
let rightButtonCount = 0;
let downButtonCount = 0;
let upButtonCount = 0;
let r, g, b;

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

    // set random colors for user fish
    r = random(255);
    g = random(255);
    b = random(255);

    // create fish controlled by user
    user = new userFish(); 
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

    /* ---------- USER FISH ---------- */
    // display main fish
    user.display();

    // move user fish left if left arrow is pressed
    if (keyIsDown(LEFT_ARROW)) {
        if (user.x > 50) { // constrain fish to canvas
            leftButtonCount++;
            user.swimLeft();
        }
    }

    // move user fish right if right arrow is pressed
    if (keyIsDown(RIGHT_ARROW)) {
        if (user.x < width - 50) { // constrain fish to canvas
            rightButtonCount++;
            user.swimRight();
        }
    }

    // move user fish down if down arrow is pressed
    if (keyIsDown(DOWN_ARROW)) {
        if (user.y < height - 50) { // constrain fish to canvas
            downButtonCount++;
            user.swimDown();
        }
    }

    // move user fish up if up arrow is pressed
    if (keyIsDown(UP_ARROW)) {
        if (user.y > 50) { // constrain fish to canvas
            upButtonCount++;
            user.swimUp();
        }
    }

    // reset button counts so speed doesn't keep increasing
    leftButtonCount = 0;
    rightButtonCount = 0;
    downButtonCount = 0;
    upButtonCount = 0;

    /* ---------- SOCKETS ---------- */
    // create data object for sockets
    let userPos = {
        x: user.x,
        y: user.y
    }
    // console.log(userPos);
    
    // emit user fish position data to server (SOCKET STEP 3)
    socket.emit('data', userPos);

    /* [ATTEMPT 2 - trying to place code within draw function]
    // listen for user fish position from the server (SOCKET STEP 6)
    socket.on('fish-data', (data) => {
        // console.log(data);
        let newUser = new userFish(data.x, data.y);
        newUser.display();
    });
    */


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
    if (keyIsPressed && keyCode == 66) { // 'b' key code
        bubbleSize += 6;
    }

    // once bubble fills up the screen
    if (bubbleSize > width * 1.3 && bubbleSize > height * 1.3) {
        school = []; // empty school array (clear fish)
        bubbleSize = 0; // set size back to 0 (pop bubble)
        bubblePop.play(); // playing pop sound when bubble pops
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
    if (keyCode == BACKSPACE) {
        school.pop();
    }

    // clear all fish
    if (keyCode == 27) { // escape key code
        school = [];
    }

    // delete (or "pop") bubble
    if (keyCode == 80) { // 'p' key code
        bubbleSize = 0;
        bubblePop.play();
    }

    // play/pause aquarium noise with spacebar
    if (keyCode == 32) { // spacebar key code
        if (aquarium.isPlaying() == true) {
            aquarium.pause();
        } else {
            aquarium.play();
        }
    }


}

