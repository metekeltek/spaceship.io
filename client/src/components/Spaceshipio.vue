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
        data() {
            return {
                socket: {},
                context: {},
            };
        },
        props: {
            width: {
                type: String,
                required: true,
            },
            height: {
                type: String,
                required: true,
            },
        },
        created() {
            this.socket = io("http://localhost:3000");
        },
        mounted() {
            this.context = this.$refs.game.getContext("2d");
            var global = this;
            var keys = [];

            let startX = 40 + Math.random() * 560;
            let startY = 40 + Math.random() * 400;
            this.socket.emit("newPlayer", { x: startX, y: startY });

            this.socket.on("updatePlayers", (players) => {
                global.render(players);
                global.move(keys);
            });

            document.addEventListener("keydown", function (eventData) {
                keys[eventData.key] = true;
            });
            document.addEventListener("keyup", function (eventData) {
                keys[eventData.key] = false;
            });
        },
        methods: {
            //60 times per second
            move(keys) {
                if (keys["w"] == true) {
                    this.socket.emit("move", {
                        moveDirection: "up",
                        id: this.socket.id,
                    });
                }
                if (keys["s"] == true) {
                    this.socket.emit("move", {
                        moveDirection: "down",
                        id: this.socket.id,
                    });
                }
                if (keys["a"] == true) {
                    this.socket.emit("move", {
                        moveDirection: "left",
                        id: this.socket.id,
                    });
                }
                if (keys["d"] == true) {
                    this.socket.emit("move", {
                        moveDirection: "right",
                        id: this.socket.id,
                    });
                }
            },
            //60 times per second
            render(players) {
                this.context.clearRect(
                    0,
                    0,
                    this.$refs.game.width,
                    this.$refs.game.height
                );
                for (let id in players) {
                    this.context.fillRect(players[id].x, players[id].y, 20, 20);
                }
            },
        },
    };
</script>

<style scoped></style>
