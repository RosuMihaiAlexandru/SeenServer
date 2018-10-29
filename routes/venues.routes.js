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
        //get venues from logged in user area range(ex: 10 km range)
        method: "GET",
        path: "/venuesInArea/{long}&{lat}",
        handler: handlers.venuesInArea,
        config: {
            auth: false //'jwt'
        }
    }
];
