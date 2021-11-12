class userFish {
    // define fish properties
    constructor(_x = width / 2, _y = height / 2, _socketID) {
        this.x = _x; // x location
        this.y = _y; // y location
        this.dir = 1; // fish direction
        this.w = 110; // fish width
        this.h = 75; // fish height
        this.v = 2;
        this.bodyCol = color(r, g, b); // fish body color
        this.tailCol = color(r, g, b); // fish tail color
        this.glow = color(255, 247, 5, 90); // fish glow
        this.socketID = _socketID;
    }

    // draw fish
    display() {
        // tail
        noStroke();
        fill(this.tailCol);

        // display tail on left side of body if direction is postive
        if (this.dir == 1) {
            strokeWeight(6);
            stroke(this.glow);
            triangle(
                this.x - this.w / 2.2,
                this.y,
                this.x - this.w / 1.5,
                this.y - this.h / 3,
                this.x - this.w / 1.5,
                this.y + this.h / 3
            );
        }

        // display tail on right side of body if direction is postive
        if (this.dir == -1) {
            strokeWeight(6);
            stroke(this.glow);
            triangle(
                this.x + this.w / 2.2,
                this.y,
                this.x + this.w / 1.5,
                this.y - this.h / 3,
                this.x + this.w / 1.5,
                this.y + this.h / 3
            );
        }

        // body
        fill(this.bodyCol);
        ellipse(this.x, this.y, this.w, this.h);

        // eye
        strokeWeight(3);
        stroke(0);
        fill(255);

        // display eye on right side of body if direction is postive
        if (this.dir == 1) {
            circle(this.x + this.w / 3, this.y - this.h / 15, 6);
        }

        // display eye on left side of body if direction is negative
        if (this.dir == -1) {
            circle(this.x - this.w / 3, this.y - this.h / 15, 6);
        }
    }

    swimLeft() {
        this.dir = -1;
        this.x -= leftButtonCount * 4;
    }

    swimRight() {
        this.dir = 1;
        this.x += rightButtonCount * 4;
    }

    swimDown() {
        this.y += downButtonCount * 4;
    }

    swimUp() {
        this.y -= upButtonCount * 4;
    }


}
