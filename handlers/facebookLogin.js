const JWT = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const sanitizeUser = require('../helpers/sanitizeUser');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const userSubscriptionTypes = require("../constants/userSubscriptionTypes");
const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports = async function login({
  headers,
  payload: { email, name, profileImage, birthDate },
},
  reply) {
  User.findOne({ email }).then(
    async (user) => {
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
          userSubscriptionType: userSubscriptionTypes.basic,
          paymentInfo: {
            purchases: []
          },
          matchingData:{
            lastDateAnswered: Date.now(),
            questions: [],
            bigFiveResult:{}
          },
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
          },
          arData: {
            arGiftsLeft: 10,
            purchases: []
          }
        });
        await newUser.save(async (err) => {
          if (!err) {
            newSettingsAndPreferences = new SettingsAndPreferences({
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
            });
            await newSettingsAndPreferences.save(async (err) => {
              if (err) {
                Logger.logErrorAndWarning(err);
                reply({ status: "failure" });
              }
              else {
                const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
                return reply({ token, user: newUser, appSettings: newSettingsAndPreferences, isNewUser: true });
              }
            })
          }
          else {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
          }

        });
      } else {
        SettingsAndPreferences.findOne({ memberId: user._id }, function (err, settingsAndPreferences) {
          if (!err) {
            const token = JWT.sign({ email: user.email }, secret, { expiresIn });
            return reply({ token, user: user, appSettings: settingsAndPreferences });
          }
          else {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
          }
        })
      }
    })
}