class Projectile {
    constructor(position, angle, playerId) {
        this.color = "white";
        this.radius = 5;
        this.position = position;
        this.angle = angle;
        this.bulltespeed = 3;
        this.origin = playerId;
        this.maxspeed = 10;
        this.velocity = {
            x: 0,
            y: 0,
        };
    }

    moveProjectile() {
        this.velocity.x += this.bulltespeed * Math.sin(this.angle);
        this.velocity.y -= this.bulltespeed * Math.cos(this.angle);
        // Change the position based on velocity

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

module.exports = Projectile;
