// routes.js
const MembersChat = require('../models/MembersChat');
const handlers=require('../handlers/modules');

module.exports = [
  {
      //get all conversations from db
      method: 'GET',
      path: '/membersChats',
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
      path: '/conversation',
      handler: handlers.loadConversation,
      config:{
          auth: false,
      }
  },
    {
        //get a conversation by members array
        method: 'GET',
        path: '/loadMoreMessages',
        handler: handlers.loadMoreMessages,
        config: {
            auth: false,
        }
    },
  {
    //updates or create a match between 2 users
    method: 'PUT',
    path: '/createOrUpdateMatch',
    handler: handlers.matchWithNotifications,
    config:{
        auth: false,
    }
 },
 {
    //updates or create a match between 2 users
    method: 'PUT',
    path: '/giftsWithNotifications',
    handler: handlers.giftsWithNotifications,
    config:{
        auth: false,
    }
 },
 {
    //get conversations with matches
    method: 'GET',
    path: '/conversations/{loggedInUserId}',
    handler: handlers.loadConversations,
    config:{
        auth: false,
    }
 },
 {
    //updates or create a match between 2 users
    method: 'PUT',
    path: '/blockConversation',
    handler: handlers.blockConversation,
    config:{
        auth: false,
    }
 },
 {
    //get media images for conversation
    method: 'GET',
    path: '/getChatMedia/{conversationId}',
    handler: handlers.getChatMedia,
    config: {
        auth: false,
    }
 },
 {
    //updates userDeleteDate
    method: 'PUT',
    path: '/logicalDeleteConversation',
    handler: handlers.logicalDeleteConversation,
    config:{
        auth: false,
    }
 },
 {
    //get media images count for conversation
    method: 'GET',
    path: '/getChatMediaCount/{conversationId}',
    handler: handlers.getChatMediaCount,
    config: {
        auth: false,
    }
 },
 {
    //updates userDeleteDate
    method: 'POST',
    path: '/deleteAllMatches',
    handler: handlers.deleteAllMatches,
    config:{
        auth: false,
    }
 },
];

