// Setup config
const config = require("../config/config");
config.isClient = true;

const GameClient = require("./GameClient");

// Create game
const game = new GameClient();

// Start connection
function start() {
    if (config.isProd) {
        // Find lobby
        let rivet = require("@rivet-gg/game");
        const clientApi = new rivet.ClientApi({
            basePath: process.env.RIVET_GAME_API_URL ?? 'https://api-game.rivet.gg/v1',
        });

        let res = clientApi.findLobby({
            gameModes: ["default"],
        })
            .then(res => {
                console.log("Found lobby", res);
                if (!res.lobby) throw "Missing lobby";
                let port = res.lobby.ports["default"];
                game.connectSocket(port.hostname, port.port, port.isTls, 0, res.lobby.player.token);
            })
            .catch(err => {
                console.error("Failed to find lobby: ", err);
                alert("Failed to find lobby: " + JSON.stringify(err));
                return;
            });
    } else {
        // Create dev socket
        game.connectSocket("127.0.0.1", 8008, false, 0);
    }
}

window.addEventListener("load", start);
