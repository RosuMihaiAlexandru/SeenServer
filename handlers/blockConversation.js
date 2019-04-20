const Boom = require("boom");
const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var _id = request.payload.conversationId;
    var member1 = request.payload.member1;
    var member2 = request.payload.member2;
    var userBlocked = request.payload.userBlocked;

    return await Match.findOne({ _id: _id },
        function(error, match){
            if(error) {
                Logger.logErrorAndWarning(member1, error);
                reply({status: 'failure'});
            }

            if (match) {
                if (match.members[0]._id.toString() === member1) {
                    match.user1Blocked = userBlocked;
                } else if (match.members[1]._id.toString() === member1) {
                    match.user2Blocked = userBlocked;
                }
    
                match.save(function (err) {
                    if (err) {
                        Logger.logErrorAndWarning(member1, err);
                        reply({status: 'failure'});
                    }
                    else
                    reply({status: 'confirmed'})
                });
            }
        }
    );
};
