const Venues = require('../models/Venues');

module.exports = [
  {
      method: 'GET',
      path: '/api/venues',
      handler: function (request, reply) {
        Venues.find(function(error, venues) {
            console.log('This is the right path brother');
              if (error) {
                  console.error(error);
              }
              reply(venues);
          });
      }
  }
];