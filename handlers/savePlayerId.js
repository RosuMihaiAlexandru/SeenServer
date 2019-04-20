const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var playerId = request.payload.playerId;

    await User.findOne({ _id: loggedInUserId}, function(error, user) {
        if(error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }
        
        if (user) {
            user.playerIds.push(playerId);
            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({
                playerIds: user.playerIds
            }).code(200);
        }
    });
};
