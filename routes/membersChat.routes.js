// routes.js
const MembersChat = require('../models/MembersChat');
const handlers=require('../handlers/modules');
const Joi=require('joi');

//handler for getting a conversation by username
//TODO
var getByUserName= async function(request, reply){
    await Conversation.findById(request.params.membersChatId).then(
        (conversation) => {
          if (conversation) {
            reply({
                 id: conversation._id,
                 members: conversation.members,
                 messages: conversation.messages,
                 matchDate: conversation.matchDate,
                 user1LastSeenDate: conversation.user1LastSeenDate,
                 user2LastSeenDate: conversation.user2LastSeenDate
                });
          } else {
            reply(Boom.notFound('Cannot find conversations'));
          }
        },
      );
}

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
      //get a conversation by id
      method: 'GET',
      path: '/api/conversation/{membersChatId}',
      handler: handlers.loadConversation,
      config:{
          //auth: 'jwt',
      }
  },
  {
      //get a conversation by userName
      method: 'GET',
      path: '/api/conversationBy/{userName}',
      handler: getByUserName
  },
//   {
//       method: 'POST',
//       path: '/api/newConversation',
//       handler: handlers.createConversation,
//       config: {
//           auth: 'jwt',
//           validate: {
//               payload: {
//               secondUserId: Joi.string().required(),
//         },
//       },
//     },
//   }
];

