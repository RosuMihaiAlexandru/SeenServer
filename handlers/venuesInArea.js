const Boom = require("boom");
const Venues = require("../models/Venues");
const mongoose = require("mongoose");

module.exports = function(request, reply) {
  var latitude = parseFloat(request.params.lat);
  var longitude = parseFloat(request.params.long);
  var page = parseInt(request.params.page);
  var isGoldMember = request.params.isGoldMember;
  var maxDistance = isGoldMember ? 5000 : 1000;
  Venues.aggregate(
    [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "dist",
          maxDistance: maxDistance,
          spherical: true,
          "limit":  page * 10 + page
        }
      },
      { $skip : page * 10 - 10 }
    ],
    function(err, venues) {
      reply(venues);
    }
  );
};
