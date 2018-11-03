const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var expoPushToken = request.payload.expoPushToken;

    await User.findOne({ _id: loggedInUserId}).then(user => {
        if (user) {
            user.expoPushTokens.push(expoPushToken);
            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({
                expoPushTokens: user.expoPushTokens
            }).code(200);
        }
    });
};
