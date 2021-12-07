class userFish {
    // define fish properties
    constructor(x, y, id, name) {
        this.x = x; // x location
        this.y = y; // y location
        this.id = id; // socket id
        this.name = String(name); // username
        this.dir = 1; // fish direction
        this.w = 110; // fish width
        this.h = 75; // fish height
        this.bodyCol = color(255, 135, 161); // fish body color
        this.tailCol = color(255, 135, 161); // fish tail color
        this.glow = color(255, 247, 5, 90); // fish glow
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

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    addName() {
        // this.name = String(username);
        textAlign(CENTER);
        textStyle(BOLD);
        text(this.name, this.x, this.y - 50);
    }
}