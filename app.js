"use strict";

const director = require("director");
const Server = require("./lib/server");

const router = new director.http.Router({
    "/": {
        post: Server.postResponse,
        get: Server.getResponse,
    },
});

const devMode = process.argv[2] === "--dev";

const server = new Server(router, devMode);
server.serve();
