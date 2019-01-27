const User = require("../models/User");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user.unreadConversations !== undefined) {
            reply({
                idList: user.unreadConversations,
                count: user.unreadConversations.length
            });
        } else {
            reply({
                idList: undefined,
                count: undefined
            });
        }
    });
};