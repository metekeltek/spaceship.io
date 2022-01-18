const Spaceship = require("./Spaceship.js");
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
    socket.on("newPlayer", () => {
        players[socket.id] = new Spaceship();
    });
    socket.on("disconnect", function () {
        delete players[socket.id];
    });
    socket.on("move", (data) => {
        players[data.id].engineOn = data.moveDirection["w"];
        players[data.id].rotatingLeft = data.moveDirection["a"];
        players[data.id].rotatingRight = data.moveDirection["d"];
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
    for (let id in players) {
        players[id].moveSpaceShip();
    }
    io.emit("updatePlayers", players);
}
