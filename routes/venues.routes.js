const Venues = require('../models/Venues');

module.exports = [
  {
      method: 'GET',
      path: '/api/venues',
      handler: function (request, reply) {
        Venues.find(function(error, venues) {
              if (error) {
                  console.error(error);
              }
              reply(venues);
          });
      },
      config:{
          auth: false,
       }
  }
];