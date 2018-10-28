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
  },

  {
    //get all users from db
    method: 'GET',
    path: '/api/venues/{long}&{lat}',
    handler: function (request, reply) {
      
      var lat = request.params.lat;
      var long = request.params.long;

      var latitude = parseFloat(request.params.lat);
    var longitude = parseFloat(request.params.long);
    Venues.aggregate(
        [
            { "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "distanceField": "dist",
                "maxDistance": 1233,
                "spherical": true
            }}
        ],
        function(err,results) {
    
        }
    );
    },
    config: {
      auth: false,//'jwt'
    }
  },
];