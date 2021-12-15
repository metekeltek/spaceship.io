const Express = require("express")();
const Http = require("http").Server(Express);

const Socketio = require("socket.io")(Http, {
    cors: {
        origin: "*", //TODO: WHEN PROD THEN MAKE MORE SECURE
    },
});

var position = {
    x: 200,
    y: 200,
    id: 0,
};
Socketio.on("connection", (socket) => {
    position.id = socket.id;
    socket.emit("position", position);
    socket.on("move", (data) => {
        switch (data) {
            case "right":
                position.x += 5;
                socket.emit("position", position);
                break;
            case "left":
                position.x -= 5;
                socket.emit("position", position);
                break;
            case "up":
                position.y -= 5;
                socket.emit("position", position);
                break;
            case "down":
                position.y += 5;
                socket.emit("position", position);
                break;
        }
    });
});

Http.listen(3000, () => {
    console.log("Listening at: 3000...");
});
