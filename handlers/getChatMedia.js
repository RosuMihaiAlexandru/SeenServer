const Boom=require('boom');
const Conversation=require ('../models/MembersChat');

module.exports= async function (request, reply) {
  var conversationId = request.params.conversationId.toString();

  await Conversation.findById(conversationId ).select('messages').lean().then(
    (doc) => {
      if (doc && doc.messages) {
          var imgArray = [];
          for(var i = 0; i < doc.messages.length; i++) {
            if(doc.messages[i].msgType == 'image')
               imgArray.push(doc.messages[i].mediaPath)
            }
        reply(imgArray);
      } else {
        reply(Boom.notFound('Cannot find conversations'));
      }
    },
  );
}