// routes.js
const MembersChat = require('../models/MembersChat');
const handlers=require('../handlers/modules');
const Joi=require('joi');

module.exports = [
  {
      //get all conversations from db
      method: 'GET',
      path: '/api/membersChats',
      handler: function (request, reply) {
        MembersChat.find(function(error, chats) {
              if (error) {
                  console.error(error);
              }
              reply(chats);
          });
      }
  },
  {
      //get a conversation by members array
      method: 'GET',
      path: '/api/conversation',
      handler: handlers.loadConversation,
      config:{
          auth: false,
      }
  },
  {
    //updates or create a match between 2 users
    method: 'GET',
    path: '/api/createOrUpdateMatch',
    handler: handlers.createOrUpdateMatch,
    config:{
        auth: false,
    }
},
];

