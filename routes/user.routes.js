// routes.js
const User = require('../models/User');
const handlers = require('../handlers/modules');
const Joi = require('joi');

module.exports = [
  {
    //get all users from db
    method: 'GET',
    path: '/api/users',
    handler: function (request, reply) {
      User.find(function (error, user) {
        if (error) {
          console.error(error);
        }
        reply(user);
      });
    },
    config: {
      auth: false,//'jwt'
    }
  },
  {
    //get all users from db
    method: 'GET',
    path: '/api/users/{long}&{lat}',
    handler: function (request, reply) {

      var lat = request.params.lat;
      var long = request.params.long;

      var latitude = parseFloat(request.params.lat);
    var longitude = parseFloat(request.params.long);
    User.aggregate(
        [
            { "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "distanceField": "dist",
                "maxDistance": 20,
                "spherical": true
            }}
        ],
        function(err,results) {
          reply(results);
        }
    );
    },
    config: {
      auth: false,//'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/register',
    handler: handlers.createUser,
    config: {
      auth: false,
      validate: {
        payload: {
          userName: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          gender: Joi.string().required(),
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: handlers.login,
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required(),
        },
      },
    },
  }
];