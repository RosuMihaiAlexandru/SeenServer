const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var playerId = request.payload.playerId;

    await User.findOne({ _id: loggedInUserId}).then(user => {
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
