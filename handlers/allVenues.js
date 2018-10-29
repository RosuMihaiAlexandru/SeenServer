const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = function (request, reply) {
     Venues.find(function (error, venues) {
        if (error) {
            console.error(error);
        }
        reply(venues);
    });
};
