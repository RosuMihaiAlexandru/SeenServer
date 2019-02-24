var EmailSender = require('../helpers/EmailSender');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
    var body = 'Hello from Mihai';
    var sendTo = request.payload.sendTo;
    var loggedInUserId = mongoose.Types.ObjectId(request.payload.loggedInUserId.toString());
    var subject = "Verify Your Email";
    var html = '<!DOCTYPE html>'+
    '<html><head><title>Please verify your email to secure your acount</title>'+
    '</head><body><div>'+
    '<a href="https://theseenapp.com/confirm-email/"' + Date.now() + '>Confirm email</a>'+
    '</div></body></html>'
    var sent = await EmailSender.submitWithHtml(body, html, subject, sendTo);
    if(sent.status === 'success'){
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
                  //reply({ "status": "Success" });
                }
              });
        })
    }
    reply(sent);
};
