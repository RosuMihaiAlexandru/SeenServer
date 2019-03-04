
const LogInfo = require("../models/LogInfo");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId;

    return LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
        if (err) {
            reply(err);
        }

        if (logInfo) {
            reply({
                settingsAndPreferences: logInfo,
                status: "Success"
            });
        } else {
        
            var logInfo = 
            reply({
                status: "NotFound"
            });
        }
    }
    )
};
