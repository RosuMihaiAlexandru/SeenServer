const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');


const User = require('../models/User');
const config = require('../config');
const sanitizeUser = require('../helpers/sanitizeUser');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = (password) => {
  var saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports = async function (request, reply) {
  let newUser, newSettingsAndPreferences;
  await User.findOne({ email: request.payload.email }, function (err, user) {
    (user) => {
      if (!user) {
        const hashedPassword = getHashedPassword(request.payload.password);
        newUser = new User({
          location: {
            type: 'Point',
            coordinates: [
              request.payload.location.latitude,
              request.payload.location.longitude
            ]
          },
          unreadConversations: [],
          playerIds: [],
          favouriteLocation: '',
          userName: request.payload.userName,
          email: request.payload.email,
          userPassword: hashedPassword,
          accountIsHidden: false,
          isGoldMember: false,
          paymentInfo: {
            receipts: []
          },
          gender: request.payload.gender,
          birthDate: request.payload.birthDate,
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
            media: ''
          },
          coverImage: {
            contentType: 'image/jpg',
            media: ''
          }
        });

        newUser.save((err, user) => {
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
            reply({status: "failure"});
          }
        });


        const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
        reply({ token, user: newUser, appSettings: newSettingsAndPreferences });
      }
      else if (user) {
        reply(Boom.conflict('User already exists'));
      }
    }
  })
}