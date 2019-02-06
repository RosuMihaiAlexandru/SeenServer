const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
  var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
  var isShowMen = request.payload.isShowMen;
  var isShowWomen = request.payload.isShowWomen;
  var ageRangeStart = parseInt(request.payload.ageRangeStart);
  var ageRangeStop = parseInt(request.payload.ageRangeStop);
  var locationRangeStop = parseInt(request.payload.locationRangeStop);

  return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
    if (err) {
      reply(err);
    }

    if (settingsAndPreferences) {
      settingsAndPreferences.isShowMen = isShowMen;
      settingsAndPreferences.isShowWomen = isShowWomen;
      settingsAndPreferences.ageRange = [ageRangeStart, ageRangeStop];
      settingsAndPreferences.locationRange = [locationRangeStop];

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
        isShowMen: isShowMen,
        memberId: loggedInUserId,
        isShowWomen: isShowWomen,
        ageRange: [ageRangeStart, ageRangeStop],
        locationRange: [locationRangeStop],
        emailSettings:{
          isReceiveNewMessages: true,
          isReceiveNewLikes: true,
          isReceiveNewMatches: true,
          isReceiveSeenPromotions: true,
          isVerifiedEmail: false
      }
      };
      SettingsAndPreferences.create(newSettingsAndPreferences);
    }
  }
  );
};