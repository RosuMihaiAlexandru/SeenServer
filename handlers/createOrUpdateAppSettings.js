const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const User = require("../models/User");

module.exports = async function (request, reply) {
  var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
  var isShowMen = request.payload.isShowMen;
  var isShowWomen = request.payload.isShowWomen;
  var ageRangeStart = parseInt(request.payload.ageRangeStart);
  var ageRangeStop = parseInt(request.payload.ageRangeStop);
  var locationRangeStop = parseInt(request.payload.locationRangeStop);
  var hideAccount = request.payload.hideAccount;

  if (hideAccount != null || hideAccount != undefined) {
    await User.findOne({ _id: loggedInUserId }).then(user => {
      if (user) {
        user.accountIsHidden = hideAccount;
        user.save(function (err) {
          // if (err) {
          //     reply(Boom.notFound("Error updating the User")).code(500);
          // }
        });

        // reply({
        //     status: "success"
        // }).code(200);
      }
    });
  }

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

    }
  }
  );
};