const Venues = require("../models/Venues");

module.exports = function(request, reply) {
  var state = request.payload.state;
  return Venues.deleteMany({ state: state }, function(err) {
    if (!err) {
      reply({ status: "success" });
    }
  });
};
