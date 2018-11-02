const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var expoPushToken = request.payload.expoPushToken;

    await User.findOne({ _id: loggedInUserId}).then(user => {
        if (user) {
            user.expoPushToken = expoPushToken;
            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({
                expoPushToken: user.expoPushToken
            }).code(200);
        }
    });
};
