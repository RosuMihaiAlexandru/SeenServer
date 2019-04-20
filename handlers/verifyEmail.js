
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {

    var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
    return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
        if (err) {
            Logger.logErrorAndWarning(loggedInUserId, err);
            reply(err);
        }

        if (settingsAndPreferences) {
            settingsAndPreferences.emailSettings.emailVerificationStatus = 'VerifiedEmail';
        }

        settingsAndPreferences.save(function (err) {
            if (err) {
                Logger.logErrorAndWarning(loggedInUserId, err);
                //reply(Boom.notFound("Error updating the SettingsAndPreferences"));
            }
            else {
                reply({ "status": "success" });
            }
        });
    })
};
