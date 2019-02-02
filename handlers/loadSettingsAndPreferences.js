const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
    var loggedInUserId = mongoose.Types.ObjectId(request.params.loggedInUserId.toString());

    return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
        if (err) {
            reply(err);
        }

        if (settingsAndPreferences) {
            reply({
                settingsAndPreferences: settingsAndPreferences,
                status: "Success"
            });
        } else {
            reply({
                status: "NotFound"
            });
        }
    }
    )
};
