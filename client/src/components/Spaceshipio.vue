<template>
    <div>
        <canvas
            ref="game"
            width="1000"
            height="500"
            style="border: 1px solid black"
        >
        </canvas>
        <p>
            <input v-on:keyup.enter="move('up')" />
            <input v-on:keydown.enter="move('down')" />
            <input v-on:keyleft.enter="move('left')" />
            <input v-on:keyright.enter="move('right')" />
        </p>
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
            this.socket = io("http://localhost:3000");
        },
        mounted() {
            this.context = this.$refs.game.getContext("2d");
            this.socket.on("position", (data) => {
                this.position = data;
                this.context.clearRect(
                    0,
                    0,
                    this.$refs.game.width,
                    this.$refs.game.height
                );
                this.context.fillRect(this.position.x, this.position.y, 20, 20);
            });
        },
        methods: {
            move(direction) {
                this.socket.emit("move", direction);
            },
        },
    };
</script>

<style scoped></style>
