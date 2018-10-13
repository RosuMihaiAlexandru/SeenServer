// routes.js
const User = require('../models/User');
const handlers=require('../handlers/modules');
const Joi=require('joi');

module.exports = [
  {
      //get all users from db
      method: 'GET',
      path: '/api/users',
      handler: function (request, reply) {
        User.find(function(error, user) {
              if (error) {
                  console.error(error);
              }
              reply(user);
          });
      }
  },
  {
    method: 'POST',
    path: '/api/register',
    handler: handlers.createUser,
    config:{
        auth: false,
        validate:{
            payload:{
            userName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
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