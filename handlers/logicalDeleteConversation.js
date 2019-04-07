const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    const conversationId = request.payload.conversationId;
    const loggedInUserId = request.payload.loggedInUserId;

    await Match.findOne({_id: conversationId}, function(err, conversation) {
        if (err) {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
        } else if (conversation) {
            if (conversation.members[0]._id.toString() == loggedInUserId) {
                conversation.user1DeleteDate = Date.now();               
            } else {
                conversation.user2DeleteDate = Date.now();
            }

            conversation.save(function(err) {
                if (err) {
                    Logger.logErrorAndWarning(err);
                    reply({ status: "failure" });
                }
            })

            reply({status: "success"})
        }
    })
}