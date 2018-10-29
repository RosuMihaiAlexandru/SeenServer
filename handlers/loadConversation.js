const Boom=require('boom');
const Conversation=require ('../models/MembersChat');

var id1='5bc25f985284a0186c6bff6b',
    id2='5bbd17cf23d76f2974697db8';

module.exports= async function (request, reply) {
  //console.log(request.params.members);
  var member1=request.query.members[0];
  var member2=request.query.members[1];
  console.log(request.query);
  await Conversation.findOne({members:{ $all: [ member2, member1 ]}}).then(
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