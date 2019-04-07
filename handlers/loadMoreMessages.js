const Boom = require('boom');
const Conversation = require('../models/MembersChat');

module.exports = async function (request, reply) {
    var member1=request.query.members[0];
    var member2=request.query.members[1];
    var loadMoreCounter = 20 * request.query.members[2];
    var msgSentWhileMountedCounter = request.query.members[3];
    await Conversation.findOne({ members: { $all: [member2, member1] } }).then(
        (conversation) => {
            if (conversation) {
                var count = conversation.messages.length;
                var messages = [];    
                var idx = 0;
                var startIndex = count - loadMoreCounter - 20 > 0 ? count - loadMoreCounter - 20 : 0;
                var isFirstMember = conversation._id == member1;
                for(var i = startIndex - msgSentWhileMountedCounter; i< count - loadMoreCounter - msgSentWhileMountedCounter; i++){
                    if(conversation.messages[i].createdAt > (isFirstMember ? conversation.user1DeleteDate : conversation.user2DeleteDate)) {
                        messages[idx++] = conversation.messages[i];
                    }
                }
                reply(messages);
            } else {
                reply(Boom.notFound('Cannot find conversations'));
            }
        },
    );
}