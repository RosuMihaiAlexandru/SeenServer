// routes.js
const Venues = require('../models/MembersChat');
module.exports = [
  {
      method: 'GET',
      path: '/api/membersChats',
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