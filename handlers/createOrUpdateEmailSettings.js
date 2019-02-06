
const Boom = require('boom');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
  var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
  var isReceiveNewMessages = request.payload.isReceiveNewMessages;
  var isReceiveNewLikes = request.payload.isReceiveNewLikes;
  var isReceiveNewMatches = request.payload.isReceiveNewMatches;
  var isReceiveSeenPromotions = request.payload.isReceiveSeenPromotions;

  return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
    if (err) {
      reply(err);
    }

    if (settingsAndPreferences) {
      settingsAndPreferences.emailSettings.isReceiveNewMessages = isReceiveNewMessages;
      settingsAndPreferences.emailSettings.isReceiveNewLikes = isReceiveNewLikes;
      settingsAndPreferences.emailSettings.isReceiveNewMatches = isReceiveNewMatches;
      settingsAndPreferences.emailSettings.isReceiveSeenPromotions = isReceiveSeenPromotions;

      settingsAndPreferences.save(function (err) {
        if (err) {
          reply(Boom.notFound("Error updating the SettingsAndPreferences"));
        }
        else {
          reply({ "status": "Success" });
        }
      });

    } else {
      var newSettingsAndPreferences = {
        isShowMen: true,
        memberId: loggedInUserId,
        isShowWomen: true,
        ageRange: [16, 50],
        locationRange: [100],
        emailSettings:{
            isReceiveNewMessages: isReceiveNewMessages,
            isReceiveNewLikes: isReceiveNewLikes,
            isReceiveNewMatches: isReceiveNewMatches,
            isReceiveSeenPromotions: isReceiveSeenPromotions,
            isVerifiedEmail: false
        }
      };
      SettingsAndPreferences.create(newSettingsAndPreferences);
    }
  }
  );
};