const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');

const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
  var loggedInUserId = request.payload.loggedInUserId;
  var isShowMen = request.payload.isShowMen;
  var isShowWomen = request.payload.isShowWomen;
  var ageRange = request.payload.isShowMen;
  var locationRange = request.payload.locationRange;

  return SettingsAndPreferences.findOne({ memberId: { loggedInUserId } }).then(settingsAndPreferences => {

    if (settingsAndPreferences) {
      settingsAndPreferences.isShowMen = isShowMen;
      settingsAndPreferences.isShowWomen = isShowWomen;
      settingsAndPreferences.ageRange = ageRange;
      settingsAndPreferences.locationRange = locationRange;

      settingsAndPreferences.save(function (err) {
        if (err) {
          reply(Boom.notFound("Error updating the SettingsAndPreferences"));
        }
      });

    } else {
      var newSettingsAndPreferences = {
        isShowMen: isShowMen,
        isShowWomen: isShowWomen,
        ageRange: ageRange,
        locationRange: locationRange
      };
      SettingsAndPreferences.create(newSettingsAndPreferences);
    }
  }
  );
};