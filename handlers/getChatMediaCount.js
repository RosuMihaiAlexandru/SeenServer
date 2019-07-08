const Boom=require('boom');
const Conversation=require ('../models/MembersChat');

module.exports= async function (request, reply) {
  const conversationId = request.params.conversationId.toString();

  await Conversation.findById(conversationId ).select('messages').lean().then(
    (doc) => {
      if (doc && doc.messages) {
          let imgCount = 0;
          for(let i = 0; i < doc.messages.length; i++) {
            if(doc.messages[i].msgType == 'image')
               imgCount++;
            }
        reply({count: imgCount});
      } else {
        reply(Boom.notFound('Cannot find conversations'));
      }
    },
  );
}