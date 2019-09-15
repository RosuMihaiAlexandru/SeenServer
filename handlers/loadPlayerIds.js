const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = mongoose.Types.ObjectId(request.params.loggedInUserId.toString());

    return User.findOne({ _id: loggedInUserId },
        function(error, user) {
            if (error) {
                Logger.logErrorAndWarning(loggedInUserId, error);
            }

            if (user.playerIds !== undefined) {
                reply({
                    playerIds: user.playerIds
                });
            } else {
                reply({
                    playerIds: 'NotFound'
                });
            }
        }
    );
};
