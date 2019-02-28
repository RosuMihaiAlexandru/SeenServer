
const Boom = require('boom');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var isReceiveNewMessages = request.payload.isReceiveNewMessages;
    var isReceiveNewLikes = request.payload.isReceiveNewLikes;
    var isReceiveNewMatches = request.payload.isReceiveNewMatches;

    return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
        if (err) {
            reply(err);
        }

        if (settingsAndPreferences) {
            settingsAndPreferences.pushNotificationsSettings.isReceiveNewMessages = isReceiveNewMessages;
            settingsAndPreferences.pushNotificationsSettings.isReceiveNewLikes = isReceiveNewLikes;
            settingsAndPreferences.pushNotificationsSettings.isReceiveNewMatches = isReceiveNewMatches;

            settingsAndPreferences.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the SettingsAndPreferences"));
                }
                else {
                    reply({ "status": "success" });
                }
            });

        } else {
            var newSettingsAndPreferences = {
                isShowMen: true,
                memberId: loggedInUserId,
                isShowWomen: true,
                ageRange: [16, 50],
                locationRange: [100],
                pushNotificationsSettings: {
                    isReceiveNewMessages: isReceiveNewMessages,
                    isReceiveNewLikes: isReceiveNewLikes,
                    isReceiveNewMatches: isReceiveNewMatches
                }
            };
            SettingsAndPreferences.create(newSettingsAndPreferences);
        }
    }
    );
};