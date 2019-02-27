var EmailSender = require('../helpers/EmailSender');
const mongoose = require('mongoose');
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const User = require('../models/User');

module.exports = async function (request, reply) {
  var body = 'Hello from Mihai';
  var sendTo = request.payload.sendTo;
  var loggedInUserId = request.payload.loggedInUserId;
  var subject = "Verify Your Email";
  var html = '<!DOCTYPE html>' +
    '<html><head><title>Please verify your email to secure your acount</title>' +
    '</head><body>' + '<div style="padding-bottom:37px;border-bottom:2px solid #e5e5e5"><div style="color:#085078;font-family: montserrat,arial,sans-serif;font-size:34px;line-height:48px;text-align:center;font-weight:bold;background-color:white">' +

    '<span style="color:#085078;text-decoration:none;">Verify Your Email</span></div></div>' +

    '<div style="margin-top:37px; border-radius:30px;padding:15px 30px;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-size:14px;line-height:18px;text-align:center;letter-spacing:2px;text-transform:uppercase; background-color:#085078"> <a href="https://theseenapp.com/confirm-email/"' + Date.now() + ' rel="noopener noreferrer" style="color:#ffffff;text-decoration:none" target="_blank"><span style="color:#ffffff;text-decoration:none">CONFIRM NOW</span></a> </div>' +

    '<div style="padding:30px 0;color:#7c7c7c;font-family:Montserrat,Arial,sans-serif;font-size:11px;line-height:20px;text-align:center"> This email was sent by Seen.<br> 54 Springleaze, Bristol, United Kingdom, BS4 2TT<br> ©2018 Seen Corp LTD. | <a href="https://theseenapp.com" style="color:#7c7c7c;text-decoration:none" target="_blank"><span style="color:#7c7c7c;text-decoration:none">Privacy Policy</span></a> <br> </div></body></html>'
  var sent = await EmailSender.submitWithHtml(body, html, subject, sendTo);
  if (sent.status === 'success') {

    return User.findOne({ _id: loggedInUserId }, function (err, user) {
      if (err) {
        reply(err);
      }

      if (user) {
        user.email = sendTo;
      }

      user.save(function (err) {
        if (err) {
          //reply(Boom.notFound("Error updating the SettingsAndPreferences"));
        }
        else {
          SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
            if (err) {
              reply(err);
            }

            if (settingsAndPreferences) {
              settingsAndPreferences.emailSettings.emailVerificationStatus = 'EmailVerificationSent';
            }

            settingsAndPreferences.save(function (err) {
              if (err) {
                reply({ "status": "fail" });
              }
              else {
                reply({ "status": "success" });
              }
            });
          })
        }
      });
    });
  }
  reply(sent);
};
