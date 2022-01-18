class Spaceship {
    constructor() {
        this.color = "white";
        this.size = { width: 20, height: 30 };
        this.position = {
            x: 40 + Math.random() * 1000,
            y: 40 + Math.random() * 400,
        };
        this.angle = 0;
        this.engineOn = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.velocity = {
            x: 0,
            y: 0,
        };
    }

    moveSpaceShip(THRUST) {
        // Angle has to be in radians
        const degToRad = Math.PI / 180;
        // Change the position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Move spaceship to other side when leaving screen
        this.position.x = (1000 + this.position.x) % 1000;
        this.position.y = (500 + this.position.y) % 500;
        // Turning
        const turningSpeed = 7;
        if (this.rotatingLeft) this.angle -= degToRad * turningSpeed;
        if (this.rotatingRight) this.angle += degToRad * turningSpeed;
        // Acceleration
        if (this.engineOn) {
            this.velocity.x += (THRUST / 100) * Math.sin(this.angle);
            this.velocity.y -= (THRUST / 100) * Math.cos(this.angle);
        }
    }
}

module.exports = Spaceship;
