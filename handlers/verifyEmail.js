
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {

    var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
    return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
        if (err) {
            reply(err);
        }

        if (settingsAndPreferences) {
            settingsAndPreferences.emailSettings.emailVerificationStatus = 'EmailVerificationSent';
        }

        settingsAndPreferences.save(function (err) {
            if (err) {
                //reply(Boom.notFound("Error updating the SettingsAndPreferences"));
            }
            else {
                reply({ "status": "Success" });
            }
        });
    })
};
