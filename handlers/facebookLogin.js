const JWT = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const sanitizeUser = require('../helpers/sanitizeUser');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports = function login({
  headers,
  payload: { email, name, profileImage, birthDate },
},
  reply) {
  User.findOne({ email }).then(
    (user) => {
      let newSettingsAndPreferences;
      if (!user) {
        let newUser = new User({
          location: {
            type: 'Point',
            coordinates: [
              51.5194657,
              -0.102699
            ]
          },
          unreadConversations: [],
          playerIds: [],
          favouriteLocation: '',
          userName: name,
          email: email,
          accountIsHidden: false,
          userPassword: '',
          gender: '',
          birthDate: birthDate,
          city: '',
          height: '',
          ethnicity: '',
          religion: '',
          occupation: '',
          education: '',
          about: '',
          weakness: '',
          enjoys: '',
          userImages: [],
          profileImage: {
            contentType: 'image/jpg',
            media: profileImage
          },
          coverImage: {
            contentType: 'image/jpg',
            media: ''
          }
        });
        newUser.save((err) => {
          if (!err) {
            newSettingsAndPreferences = {
              isShowMen: true,
              memberId: newUser._id,
              isShowWomen: true,
              ageRange: [16, 70],
              locationRange: [100],
              emailSettings: {
                isReceiveNewMessages: true,
                isReceiveNewLikes: true,
                isReceiveNewMatches: true,
                isReceiveSeenPromotions: true,
                emailVerificationStatus: 'NotVerified'
              },
              pushNotificationsSettings: {
                isReceiveNewMessages: true,
                isReceiveNewLikes: true,
                isReceiveNewMatches: true
              }
            };
            SettingsAndPreferences.create(newSettingsAndPreferences);
          }
          else {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
          }

        });
        const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
        return reply({ token, user: newUser, appSettings: newSettingsAndPreferences });
      } else {
        const token = JWT.sign({ email: user.email }, secret, { expiresIn });
        return reply({ token, user: user, appSettings: newSettingsAndPreferences });
      }
    });
}