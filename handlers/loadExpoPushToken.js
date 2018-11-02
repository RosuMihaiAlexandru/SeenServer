const Boom = require("boom");
const User = require("../models/User");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user.expoPushToken !== undefined) {
            reply({
                expoPushToken: user.expoPushToken
            }).code(200);
        } else {
            reply('NotFound').code(404);
        }
    });
};
