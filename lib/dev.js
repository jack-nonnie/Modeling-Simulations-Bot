"use strict";

const localtunnel = require("localtunnel");
const promptly = require("promptly");

class Dev {
    /**
     * Expose the app on localhost with the given port. Used in development.
     *
     * @static
     * @param {number} port The port on localhost to expose
     * @return {undefined}
     */
    static dev(port, subdomain) {
        const options = {
            subdomain: subdomain,
        };
    }
}

module.exports = Dev;
