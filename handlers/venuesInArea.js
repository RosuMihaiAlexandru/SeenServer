const Boom = require("boom");
const Venues = require("../models/Venues");
const mongoose = require("mongoose");

module.exports = function(request, reply) {
  var latitude = parseFloat(request.params.lat);
  var longitude = parseFloat(request.params.long);
  Venues.aggregate(
    [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "dist",
          maxDistance: 1233,
          spherical: true
        }
      }
    ],
    function(err, venues) {
      reply(venues);
    }
  );
};
