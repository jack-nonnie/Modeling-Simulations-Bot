"use strict";

const http = require("http");
const Bot = require("./bot");
var counter = 0;
var lastMessUser = "";
var userCountLst = [];

class Server {
    constructor(router, devMode, port) {
        this.server = http.createServer(function (req, res) {
            req.chunks = [];

            req.on("data", function (chunk) {
                req.chunks.push(chunk.toString());
            });

            router.dispatch(req, res, function (error) {
                res.writeHead(error.status, { "Content-Type": "text/plain" });
                res.end(error.message);
            });
        });

        this.devMode = devMode;

        this.port = Number(port || 80);
    }

    serve() {
        this.server.listen(this.port);

        console.log("Running on port " + this.port);
        if (this.devMode) {
            require("./dev").dev(this.port, process.env.LT_SUBDOMAIN);
        }
    }

    static getResponse() {
        this.res.end("Bot is responding to a GET request... hey there!");
    }

    static postResponse() {
        const requestMessage = JSON.parse(this.req.chunks[0]);

        this.res.writeHead(200);
        this.res.end();

        const messageResponse = Bot.statusMessage(requestMessage);

        if (messageResponse) {
            Bot.sendMessage(messageResponse);
        }
        const curseResponse = Bot.curseWordsResponse(requestMessage);
        if (curseResponse) {
            Bot.sendMessage(curseResponse);
        }
        const welcome = Bot.welcome(requestMessage);
        if (welcome) {
            Bot.sendMessage(welcome);
        }
        const stat = Bot.messageStats(requestMessage);
        if (stat[0] != lastMessUser) {
            counter = 0;
            lastMessUser = stat[0];
        }
        if (stat[1] <= 8) {
            counter += 1;
        }
        if (counter > 0 && counter % 5 === 0) {
            Bot.sendMessage(
                lastMessUser +
                    " please stop spamming the chat if you continue to do so you will be removed from the chat"
            );
        }
        userCountLst = Bot.messageCounter(requestMessage, userCountLst);
        const messUserCounter = Bot.userMessageStats(
            requestMessage,
            userCountLst
        );
        if (messUserCounter) {
            Bot.sendMessage(messUserCounter);
        }
    }
}

module.exports = Server;
