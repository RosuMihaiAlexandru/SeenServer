const Boom = require("boom");
const User = require("../models/User");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user.unreadConversations !== undefined) {
            reply({
                count: user.unreadConversations.length
            });
        } else {
            reply({
                count: undefined
            });
        }
    });
};