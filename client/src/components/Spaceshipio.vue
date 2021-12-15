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
                position: {
                    x: 0,
                    y: 0,
                },
            };
        },
        created() {
            console.log("CREATING.START");
            this.socket = io("http://localhost:3000");
            console.log("CREATING.FINISH");
        },
        mounted() {
            console.log("MOUNNTED.START");
            let startX = 40 + Math.random() * 560;
            let startY = 40 + Math.random() * 400;
            this.socket.emit("newPlayer", { x: startX, y: startY });
            console.log("1");
            this.context = this.$refs.game.getContext("2d");
            // this.socket.on("position", (data) => {
            //     this.position = data;
            // });
            console.log("2");

            this.socket.on("updatePlayers", (players) => {
                this.context.clearRect(
                    0,
                    0,
                    this.$refs.game.width,
                    this.$refs.game.height
                );
                for (let id in players) {
                    this.context.fillRect(players[id].x, players[id].y, 20, 20);
                }
            });
            console.log("3");
            var that = this;
            document.addEventListener("keyup", function (eventData) {
                if (eventData.key == "ArrowUp") {
                    that.move("up");
                }
                if (eventData.key == "ArrowDown") {
                    that.move("down");
                }
                if (eventData.key == "ArrowLeft") {
                    that.move("left");
                }
                if (eventData.key == "ArrowRight") {
                    that.move("right");
                }
                if (eventData.key == "w") {
                    that.move("up");
                }
                if (eventData.key == "s") {
                    that.move("down");
                }
                if (eventData.key == "a") {
                    that.move("left");
                }
                if (eventData.key == "d") {
                    that.move("right");
                }
            });
            console.log("4");
        },
        methods: {
            move(direction) {
                let obj = {
                    moveDirection: direction,
                    id: this.socket.id,
                };
                this.socket.emit("move", obj);
            },
        },
    };
</script>

<style scoped></style>
