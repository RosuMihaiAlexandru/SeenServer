const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.findOne({ _id: loggedInUserId },
        function(error, user){
            if (error) {
                Logger.logErrorAndWarning(loggedInUserId, error);
            }

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
        }
    );
};