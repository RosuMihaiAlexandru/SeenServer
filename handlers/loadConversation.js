const Boom=require('boom');
const Conversation=require ('../models/MembersChat');

module.exports= async function (request, reply) {
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