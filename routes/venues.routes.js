const Venues = require("../models/Venues");
const handlers = require("../handlers/modules");

module.exports = [
    {
        method: "GET",
        path: "/venues",
        handler: handlers.allVenues,
        config: {
            auth: false
        }
    },
    {
        //get all users from db
        method: "GET",
        path: "/venuesInArea/{long}&{lat}",
        handler: handlers.venuesInArea,
        config: {
            auth: false //'jwt'
        }
    }
];
