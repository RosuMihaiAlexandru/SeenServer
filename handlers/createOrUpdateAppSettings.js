const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
  var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
  var isShowMen = request.payload.isShowMen;
  var isShowWomen = request.payload.isShowWomen;
  var ageRangeStart = parseInt(request.payload.ageRangeStart);
  var ageRangeStop = parseInt(request.payload.ageRangeStop);
  var locationRangeStop = parseInt(request.payload.locationRangeStop);
  var accountIsHidden = request.payload.accountIsHidden;

  if (accountIsHidden != null || accountIsHidden != undefined) {
    await User.findOne({ _id: loggedInUserId }).then(user => {
      if (user) {
        user.accountIsHidden = accountIsHidden;
        user.save(function (err) {
          if (err) {
              Logger.logErrorAndWarning(loggedInUserId, err);
          }
        });

      }
    });
  }

  return SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
    if (err) {
      Logger.logErrorAndWarning(loggedInUserId, err);
      reply(err);
    }

    if (settingsAndPreferences) {
      settingsAndPreferences.isShowMen = isShowMen;
      settingsAndPreferences.isShowWomen = isShowWomen;
      settingsAndPreferences.ageRange = [ageRangeStart, ageRangeStop];
      settingsAndPreferences.locationRange = [locationRangeStop];

      settingsAndPreferences.save(function (err) {
        if (err) {
          Logger.logErrorAndWarning(loggedInUserId, err);
          reply(Boom.notFound("Error updating the SettingsAndPreferences"));
        }
        else {
          reply({ "status": "Success" });
        }
      });

    }
  }
  );
};