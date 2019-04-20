const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var newQuestions = JSON.parse(request.payload.questions);

    return User.findOne({ _id: loggedInUserId }, function(error, user) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }

        if (user) {
            try {
                user.matchingData.questions = newQuestions;
                user.matchingData.lastDateAnswered = Date.now();
                user.save(function (err) {
                    if (err) {
                        Logger.logErrorAndWarning(loggedInUserId, err);
                        reply(Boom.notFound("Error updating the User")).code(500);
                    }
                });
            } catch (error) {
                Logger.logErrorAndWarning(loggedInUserId, error);
                reply({ status: "failure",  error: error });
                return;
            }

            reply({ status: "success", matchingData: user.matchingData });
        }
    });
}
