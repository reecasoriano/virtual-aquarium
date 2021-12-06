class automatedFish {
    // define fish properties
    constructor(_x, _y) {
        this.x = _x; // x location
        this.y = _y; // y location
        this.w = int(random(50, 120)); // fish width
        this.h = int(random(this.w / 1.5, this.w / 2.5)); // fish height

        // body color options
        let colors = [
            color(227, 157, 36), // orange (0)
            color(235, 205, 59), // yellow (1)
            color(32, 117, 245), // blue (2)
            color(39, 110, 52), // green (3)
            color(155, 88, 209), // purple (4)
            color(209, 40, 40), // red (5)
        ];

        // select random colors
        let randomCol1 = int(random(0, 6));
        let randomCol2 = int(random(0, 6));

        this.bodyCol = colors[randomCol1]; // fish body color
        this.tailCol = colors[randomCol2]; // fish tail color

        this.v = int(random(1, 3)); // fish speed

        let direction = [-1, 1, -1, 1, 1, -1];
        this.dir = direction[int(random((0, 6)))]; // random fish direction
    }

    // draw fish
    display() {
        // tail
        noStroke();
        fill(this.tailCol);

        // display tail on left side of body if direction is postive
        if (this.dir == 1) {
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

    // move fish
    swim() {
        // update x location by speed & direction
        this.x += this.v * this.dir;

        // change direction after fish leaves the canvas
        if (this.x < 0 - this.w * 2 || this.x > windowWidth + this.w * 2) {
            this.dir = -this.dir;
            this.x += this.v * this.dir;
        }

        // swim up and down
        this.y = this.y + sin(radians(frameCount * this.v));
    }
}
