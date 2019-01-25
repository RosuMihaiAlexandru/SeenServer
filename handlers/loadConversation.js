const Boom=require('boom');
const Conversation=require ('../models/MembersChat');

var id1='5bc25f985284a0186c6bff6b',
    id2='5bbd17cf23d76f2974697db8';

module.exports= async function (request, reply) {
  var member1=request.query.members[0];
  var member2=request.query.members[1];
  console.log(request.query);
  await Conversation.findOne({members:{ $all: [ member2, member1 ]}}).then(
    (conversation) => {
      if (conversation) {
        var messages = conversation.messages;
        if(messages.length > 20){
          messages.splice(0, messages.length - 20);
        }
        reply({
             id: conversation._id,
             members: conversation.members,
             messages: messages,
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