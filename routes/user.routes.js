// routes.js
const User = require("../models/User");
const handlers = require("../handlers/modules");
const Joi = require("joi");

module.exports = [
  {
    //get all users from area(ex: 10 km range)
    method: "GET",
    path: "/users/{loggedInUserId}&{long}&{lat}",
    handler: handlers.allUsers,
    config: {
      auth: false //'jwt'
    }
  },
  {
    //get the sender required for opening a message notification
    method: "GET",
    path: "/userSenderWithChat/{userSenderId}&{userReceiverId}",
    handler: handlers.userSenderWithChat,
    config: {
      auth: false //'jwt'
    }
  },
  {
    //get all users from area(ex: 10 km range)
    method: "GET",
    path: "/userMatchesWithChats/{loggedInUserId}",
    handler: handlers.userMatchesWithChats,
    config: {
      auth: false //'jwt'
    }
  },
  {
    //get users in specific locations
    method: "GET",
    path: "/usersInLocation/{loggedInUserId}&{long}&{lat}",
    handler: handlers.usersInLocation,
    config: {
      auth: false //'jwt'
    }
  },
  {
    //get users in specific locations
    method: "PUT",
    path: "/savePlayerId",
    handler: handlers.savePlayerId,
    config: {
      auth: false //'jwt'
    }
  },
  {
    //get users in specific locations
    method: "GET",
    path: "/loadPlayerIds/{loggedInUserId}",
    handler: handlers.loadPlayerIds,
    config: {
      auth: false //'jwt'
    }
  },
  {
    method: "POST",
    path: "/register",
    handler: handlers.createUser,
    config: {
      auth: false,
      validate: {
        payload: {
          userName: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          gender: Joi.string().required()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/login",
    handler: handlers.login,
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/facebookLogin",
    handler: handlers.facebookLogin,
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().required(),
          name: Joi.string().required(),
          profileImage: Joi.string().required()
        }
      }
    }
  }
];
