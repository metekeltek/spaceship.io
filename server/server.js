const Projectile = require("./Projectile.js");
const Spaceship = require("./Spaceship.js");
const Express = require("express")();
const Http = require("http").Server(Express);

const io = require("socket.io")(Http, {
    cors: {
        origin: "*", //TODO: WHEN PROD THEN MAKE MORE SECURE
    },
});

let players = {};
let projectiles = [];

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
    socket.on("shoot", (data) => {
        const playerClone = JSON.parse(JSON.stringify(players[data.id]));

        const position = playerClone.position;
        const angle = playerClone.angle;
        const origin = data.id;

        let projectile = new Projectile(position, angle, origin);
        projectiles.push(projectile);
    });
}

setInterval(gameLoop, 1000 / 60);

function gameLoop() {
    projectiles.forEach((projectile) => {
        projectile.moveProjectile();
        checkProjectileOutOfBounds(projectile);
    });
    for (let playerId in players) {
        players[playerId].moveSpaceShip();
        checkProjectileCollisions(playerId);
    }

    io.emit("updateFrontend", {
        players: players,
        projectiles: projectiles,
    });
}

function checkProjectileOutOfBounds(projectile) {
    if (
        projectile.position.x > 1000 ||
        projectile.position.x < 0 ||
        projectile.position.y < 0 ||
        projectile.position.y > 500
    ) {
        var index = projectiles.indexOf(projectile);
        if (index !== -1) {
            projectiles.splice(index, 1);
        }
    }
}

function checkProjectileCollisions(playerId) {
    projectiles.forEach((projectile) => {
        if (projectile.origin != playerId) {
            const dist = Math.hypot(
                projectile.position.x - players[playerId].position.x,
                projectile.position.y - players[playerId].position.y
            );

            if (dist < 25) {
                deleteSpaceshipAndProjectile(playerId, projectile);
            }
        }
    });
}

function deleteSpaceshipAndProjectile(playerId, projectile) {
    delete players[playerId];
    var index = projectiles.indexOf(projectile);
    if (index !== -1) {
        projectiles.splice(index, 1);
    }
}
