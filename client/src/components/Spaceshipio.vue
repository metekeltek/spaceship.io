<template>
    <div>
        <canvas
            ref="game"
            width="1000"
            height="500"
            style="border: 1px solid black"
        >
        </canvas>
    </div>
</template>

<script>
    import io from "socket.io-client";
    export default {
        name: "Spaceshipio",
        created() {
            this.socket = io("http://localhost:3000");
        },
        mounted() {
            this.context = this.$refs.game.getContext("2d");
            const global = this;
            var keys = {};

            this.socket.emit("newPlayer");

            this.socket.on("updateFrontend", (data) => {
                global.render(data.players, data.projectiles);
            });

            document.addEventListener("keydown", function (eventData) {
                keys[eventData.key] = true;
                global.move(keys);
                if (eventData.keyCode == 32) {
                    global.shoot();
                }
            });
            document.addEventListener("keyup", function (eventData) {
                keys[eventData.key] = false;
                global.move(keys);
            });
        },
        methods: {
            //60 times per second
            move(keys) {
                this.socket.emit("move", {
                    moveDirection: keys,
                    id: this.socket.id,
                });
            },
            shoot() {
                this.socket.emit("shoot", {
                    id: this.socket.id,
                });
            },
            //60 times per second: clears canvas and draws canvas again
            render(players, projectiles) {
                this.context.fillStyle = "#111";
                this.context.fillRect(
                    0,
                    0,
                    this.$refs.game.width,
                    this.$refs.game.height
                );
                for (let id in players) {
                    this.drawPlayer(players[id]);
                }
                projectiles.forEach((projectile) => {
                    this.drawProjectile(projectile);
                });
            },
            drawPlayer(spaceship) {
                this.context.save();

                const triangleCenterX =
                    spaceship.position.x + 0.5 * spaceship.size.width;
                const triangleCenterY =
                    spaceship.position.y + 0.5 * spaceship.size.height;

                this.context.translate(triangleCenterX, triangleCenterY);
                this.context.rotate(spaceship.angle);
                this.context.lineWidth = 1;
                this.context.beginPath();
                // Triangle
                this.context.moveTo(0, -spaceship.size.height / 2);
                this.context.lineTo(
                    -spaceship.size.width / 2,
                    spaceship.size.height / 2
                );
                this.context.lineTo(
                    spaceship.size.width / 2,
                    spaceship.size.height / 2
                );
                this.context.closePath();

                this.context.strokeStyle = spaceship.color;
                this.context.stroke();

                // Flame for engine
                if (spaceship.engineOn) {
                    const fireYPos = spaceship.size.height / 2 + 5;
                    const fireXPos = spaceship.size.width * 0.25;
                    this.context.beginPath();
                    this.context.moveTo(-fireXPos, fireYPos);
                    this.context.lineTo(fireXPos, fireYPos);
                    this.context.lineTo(0, fireYPos + Math.random() * 50);
                    this.context.lineTo(-fireXPos, fireYPos);
                    this.context.closePath();
                    this.context.fillStyle = "orange";
                    this.context.fill();
                }
                this.context.restore();
            },
            drawProjectile(projectile) {
                this.context.beginPath();
                this.context.arc(
                    projectile.position.x + 0.5 * 20,
                    projectile.position.y + 0.5 * 30,
                    projectile.radius,
                    0,
                    2 * Math.PI
                );
                this.context.strokeStyle = projectile.color;
                this.context.closePath();
                this.context.stroke();
            },
        },
    };
</script>

<style scoped></style>
