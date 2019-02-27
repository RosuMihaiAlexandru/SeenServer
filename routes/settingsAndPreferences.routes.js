// routes.js
const User = require("../models/User");
const handlers = require("../handlers/modules");
const Joi = require("joi");

module.exports = [
    {
      //get all users from area(ex: 10 km range)
      method: "POST",
      path: "/createOrUpdateAppSettings",
      handler: handlers.createOrUpdateAppSettings,
      config: {
        auth: false //'jwt'
      }
    },
    {
      //get all users from area(ex: 10 km range)
      method: "POST",
      path: "/createOrUpdateEmailSettings",
      handler: handlers.createOrUpdateEmailSettings,
      config: {
        auth: false //'jwt'
      }
    },
    {
        //get all users from area(ex: 10 km range)
        method: "GET",
        path: "/loadSettingsAndPreferences/{loggedInUserId}",
        handler: handlers.loadSettingsAndPreferences,
        config: {
          auth: false //'jwt'
        }
      },
      {
        //get all users from area(ex: 10 km range)
        method: "POST",
        path: "/sendVerificationEmail",
        handler: handlers.sendVerificationEmail,
        config: {
          auth: false //'jwt'
        }
      },
      {
        //get all users from area(ex: 10 km range)
        method: "POST",
        path: "/verifyEmail",
        handler: handlers.verifyEmail,
        config: {
          auth: false //'jwt'
        }
      }
]