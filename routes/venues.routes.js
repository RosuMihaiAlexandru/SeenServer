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
        path: "/venuesInArea/{long}&{lat}&{page}&{isGoldMember}&{filterTag}&{searchKeyword}",
        handler: handlers.venuesInArea,
        config: {
            auth: false //'jwt'
        }
    },
    {
        //get venues from logged in user area range(ex: 10 km range)
        method: "GET",
        path: "/venuesInArea/{long}&{lat}&{page}&{isGoldMember}&{filterTag}",
        handler: handlers.venuesInArea,
        config: {
            auth: false //'jwt'
        }
    },
    {
        //get venues from logged in user area range(ex: 10 km range)
        method: "GET",
        path: "/venuesInArea/{long}&{lat}&{page}&{isGoldMember}",
        handler: handlers.venuesInArea,
        config: {
            auth: false //'jwt'
        }
    },
    {
        //imports venues from csv file
        method: "POST",
        path: "/importVenues",
        handler: handlers.importVenues,
        config: {
            auth: false //'jwt'
        }
    },  
];
