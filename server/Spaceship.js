class Spaceship {
    constructor() {
        this.color = "white";
        this.size = { width: 20, height: 30 };
        this.position = {
            x: 40 + Math.random() * 1000,
            y: 40 + Math.random() * 400,
        };
        this.turningSpeed = 7;
        this.thrust = 10;
        this.maxspeed = 10;
        this.angle = 0;
        this.engineOn = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.velocity = {
            x: 0,
            y: 0,
        };
    }

    moveSpaceShip() {
        // Angle has to be in radians
        const degToRad = Math.PI / 180;
        // Change the position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Move spaceship to other side when leaving screen
        this.position.x = (1000 + this.position.x) % 1000;
        this.position.y = (500 + this.position.y) % 500;
        // Turning
        if (this.rotatingLeft) this.angle -= degToRad * this.turningSpeed;
        if (this.rotatingRight) this.angle += degToRad * this.turningSpeed;
        // Acceleration
        if (this.engineOn) {
            this.velocity.x += (this.thrust / 100) * Math.sin(this.angle);
            this.velocity.y -= (this.thrust / 100) * Math.cos(this.angle);

            if (this.velocity.x > this.maxspeed) {
                this.velocity.x = this.maxspeed;
            }
            if (this.velocity.y > this.maxspeed) {
                this.velocity.y = this.maxspeed;
            }
            if (this.velocity.x < -this.maxspeed) {
                this.velocity.x = -this.maxspeed;
            }
            if (this.velocity.y < -this.maxspeed) {
                this.velocity.y = -this.maxspeed;
            }
        }
    }
}

module.exports = Spaceship;
