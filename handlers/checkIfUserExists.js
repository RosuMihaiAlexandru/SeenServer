const User = require('../models/User');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const JWT = require('jsonwebtoken');;
const config = require('../config');
const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports = async function (request, reply) {
    const email = request.query.email;

    await User.findOne({ email: email }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(user._id, err);
            reply({status: 'failure', exists: false});
            return;
        }

        if (user) {
            SettingsAndPreferences.findOne({ memberId: user._id }, function (err, settingsAndPreferences) {
                if (!err) {
                  const token = JWT.sign({ email: user.email }, secret, { expiresIn });
                  reply({ status: 'success', exists: true, token, user: user, appSettings: settingsAndPreferences });
                }
                else {
                  Logger.logErrorAndWarning(user._id, err);
                  reply({ status: "failure", exists: false });
                }
            })           
        } else {
            reply({status: 'success', exists: false});
        }
    });
}