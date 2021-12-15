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
        console.log("New client connected, with id: " + socket.id);
        players[socket.id] = data;
        console.log(
            "Starting position: " +
                players[socket.id].x +
                " - " +
                players[socket.id].y
        );
        console.log(
            "Current number of players: " + Object.keys(players).length
        );
        console.log("players dictionary: ", players);
        io.emit("updatePlayers", players);
    });
    socket.on("disconnect", function () {
        delete players[socket.id];
        console.log("Goodbye client with id " + socket.id);
        console.log(
            "Current number of players: " + Object.keys(players).length
        );
        io.emit("updatePlayers", players);
    });
    socket.on("move", (data) => {
        switch (data.moveDirection) {
            case "right":
                players[data.id].x += 5;
                io.emit("updatePlayers", players);
                break;
            case "left":
                players[data.id].x -= 5;
                io.emit("updatePlayers", players);
                break;
            case "up":
                players[data.id].y -= 5;
                io.emit("updatePlayers", players);
                break;
            case "down":
                players[data.id].y += 5;
                io.emit("updatePlayers", players);
                break;
        }
    });
}
