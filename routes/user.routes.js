// routes.js
const Venues = require('../models/User');
module.exports = [
  {
      method: 'GET',
      path: '/api/users',
      handler: function (request, reply) {
        Venues.find(function(error, venues) {
              if (error) {
                  console.error(error);
              }
              reply(venues);
          });
      }
  }
];