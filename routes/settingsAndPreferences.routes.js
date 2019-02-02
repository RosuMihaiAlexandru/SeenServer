// routes.js
const User = require("../models/User");
const handlers = require("../handlers/modules");
const Joi = require("joi");

module.exports = [
    {
      //get all users from area(ex: 10 km range)
      method: "POST",
      path: "/saveAppSettings",
      handler: handlers.createOrUpdateAppSettings,
      config: {
        auth: false //'jwt'
      }
    }
]