const Express = require("express")();
const Http = require("http").Server(Express);

const io = require("socket.io")(Http, {
    cors: {
        origin: "*", //TODO: WHEN PROD THEN MAKE MORE SECURE
    },
});

let players = {};

io.on("connection", connection);

Http.listen(3000, () => {
    console.log("Listening at: 3000...");
});

function connection(socket) {
    socket.on("newPlayer", (data) => {
        players[socket.id] = data;
        updatePlayers();
    });
    socket.on("disconnect", function () {
        delete players[socket.id];
        updatePlayers();
    });
    socket.on("move", (data) => {
        switch (data.moveDirection) {
            case "right":
                players[data.id].x += 5;
                break;
            case "left":
                players[data.id].x -= 5;
                break;
            case "up":
                players[data.id].y -= 5;
                break;
            case "down":
                players[data.id].y += 5;
                break;
        }
    });
}

function loop() {
    update();
}
function update() {
    updatePlayers();
}

setInterval(loop, 1000 / 60);

function updatePlayers() {
    io.emit("updatePlayers", players);
}
