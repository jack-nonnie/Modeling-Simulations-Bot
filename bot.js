"use strict";

require("dotenv").config();

const https = require("https");

class Bot {
    static messageCounter(message, usersCount) {
        for (var i in usersCount) {
            if (usersCount[i][0] === message.user_id) {
                usersCount[i][1] = message.name;
                usersCount[i][2]++;
                return usersCount;
            }
        }

        usersCount.push([message.user_id, message.name, 1]);
        return usersCount;
    }
    static userMessageStats(message, userCount) {
        const messageText = message.text;
        const botRegex = /^\/count/;
        var ret = "The message count stats are as follows: \n";
        if (messageText && botRegex.test(messageText)) {
            for (var i in userCount) {
                ret += userCount[i][1] + ": " + userCount[i][2] + "\n";
            }
            return ret;
        }
        return null;
    }

    static messageStats(message) {
        return [message.name, message.text.length];
    }
    static welcome(message) {
        const userName = message.name;
        if (userName === "GroupMe") {
            var txt = message.text.split(" ");
            for (var i = 0; i < txt.length; i++) {
                if (txt[i] === "added") {
                    console.log(txt[i]);
                    var name = "";
                    for (var g = i + 1; g < txt.length; g++) {
                        if (txt[g] != "to") {
                            name += txt[g] + " ";
                        } else {
                            return (
                                "Hello, " +
                                name +
                                "I am Botman. I would like to welcome you to the group. I will be the group monitor."
                            );
                        }
                    }
                }
            }
        }
        return null;
    }

    static statusMessage(message) {
        const messageText = message.text;
        const botRegex = /^\/status/;

        if (messageText && botRegex.test(messageText)) {
            return (
                "Hello I am Botman. I will be the monitor for this group chat. My job is to make sure everyone stays on topic and to keep track of everyones contributions. I hope you enjoy the group " +
                message.name
            );
        }

        return null;
    }
    static curseWordsResponse(message) {
        const messageText = message.text;
        var Filter = require("bad-words");
        var filter = new Filter();
        if (messageText && filter.isProfane(messageText)) {
            return "I am sorry but that kind of language is not permitted in this chat";
        }
        return null;
    }

    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: "api.groupme.com",
            path: "/v3/bots/post",
            method: "POST",
        };

        const body = {
            bot_id: botId,
            text: messageText,
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function (response) {
            if (response.statusCode !== 202) {
                console.log("Rejecting bad status code " + response.statusCode);
            }
        });

        // On error
        botRequest.on("error", function (error) {
            console.log("Error posting message " + JSON.stringify(error));
        });

        // On timeout
        botRequest.on("timeout", function (error) {
            console.log("Timeout posting message " + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    }
}

module.exports = Bot;
