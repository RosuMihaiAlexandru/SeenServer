const bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const fs = require("fs");


const User = require('../models/User');
const config = require('../config');
const sanitizeUser = require('../helpers/sanitizeUser');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const userSubscriptionTypes = require("../constants/userSubscriptionTypes");
const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = (password) => {
  var saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports = async function (request, reply) {
  let newUser, newSettingsAndPreferences;
  await User.findOne({ email: request.payload.email },async function (err, user) {
    if (!user) {
      const email = request.payload.email;
      var profileImageUrl = "";

      if (request.payload.facebookImageUrl) {
        profileImageUrl = request.payload.facebookImageUrl;
      } else {
      var base64PhotoString = request.payload.base64PhotoString;
      var imageBuffer = new Buffer(base64PhotoString, "base64");
      var userDirectory = "../../../mnt/seenblockstorage/" + email;
      //for local tests
      //var userDirectory = "./" + email;
      if (!fs.existsSync(userDirectory)) {
        await fs.mkdir(userDirectory, (err) => {
          if (err) Logger.logErrorAndWarning("", err);
        });
      }

      var fileName = getFormattedDate() + ".jpg";
      await fs.writeFile(userDirectory + "/" + fileName, imageBuffer, (err) => {
        if (err) Logger.logErrorAndWarning("", err);
      });

      profileImageUrl =
        "http://167.99.200.101/seenblockstorage/" +
        email +
        "/" +
        fileName;
      }

        const hashedPassword = getHashedPassword(request.payload.password);
        newUser = new User({
          location: {
            type: 'Point',
            coordinates: [
              request.payload.location.longitude !== undefined ? request.payload.location.longitude : -0.102699,
              request.payload.location.latitude !== undefined ? request.payload.location.latitude : 51.5194657,
            ]
          },
          unreadConversations: [],
          playerIds: [],
          favouriteLocation: '',
          userName: request.payload.userName,
          email: request.payload.email,
          userPassword: hashedPassword,
          accountIsHidden: false,
          userSubscriptionType: userSubscriptionTypes.basic,
          paymentInfo: {
            purchases: []
          },
          matchingData:{
            lastDateAnswered: Date.now(),
            questions: request.payload.questions,
            bigFiveResult:{}
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
            media: profileImageUrl
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

        newUser.save((err) => {
          if (!err) {
            newSettingsAndPreferences = new SettingsAndPreferences({
              isShowMen: request.payload.sexPreference.isMenPreference,
              memberId: newUser._id,
              isShowWomen: request.payload.sexPreference.isWomenPreference,
              ageRange: [18, 70],
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
            newSettingsAndPreferences.save((err) => {
              if (err) {
                Logger.logErrorAndWarning(err);
                reply({ status: "failure" });
              }
              else {
                const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
                return reply({ token, user: newUser, appSettings: newSettingsAndPreferences });
              }
            })
          }
          else {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
          }

        });
      }
      else if (user) {
        reply(Boom.conflict('User already exists'));
      }
    }
  )
}

function getFormattedDate() {
  var date = new Date();
  var nowDate =
    date.getFullYear() +
    "" +
    (date.getMonth() + 1) +
    date.getDate() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds();
  return nowDate;
}