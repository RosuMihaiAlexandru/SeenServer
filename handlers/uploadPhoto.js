const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");
const fs = require("fs");
const userSubscriptionType = require('../constants/userSubscriptionTypes');

module.exports = async function(request, reply) {
  var loggedInUserId = request.payload.loggedInUserId;
  var base64PhotoString = request.payload.base64PhotoString;
  var type = request.payload.type;

  await User.findOne({ _id: loggedInUserId }, async function(error, user) {
    if(error) {
      Logger.logErrorAndWarning(loggedInUserId, error);
    }

    if (user) {
      var objToReturn = {};
      
      try {
        var imageBuffer = new Buffer(base64PhotoString, "base64");
        var userDirectory = "../../../mnt/seenblockstorage/" + user.email;
        if (!fs.existsSync(userDirectory)) {
          await fs.mkdir(userDirectory, (err) => {
            if (err) Logger.logErrorAndWarning(loggedInUserId, err);
          });
        }

        if (type === "profile") {
          var fileName = getFormattedDate() + ".jpg";
          await fs.writeFile(userDirectory + "/" + fileName, imageBuffer, (err) => {
            if (err) Logger.logErrorAndWarning(loggedInUserId, err);
          });

          user.profileImage.media =
            "http://167.99.200.101/seenblockstorage/" +
            user.email +
            "/" +
            fileName;
          objToReturn = user.profileImage;
        } else if (type === "normal") {
          //allow to upload more than 6 photos only if the user upgraded from basic
          if (user.userSubscriptionType === userSubscriptionType.basic && user.userImages.length >= 6) {
            throw 'photoLimitExceeded';
          } else {
            var fileName = getFormattedDate() + ".jpg";
            await fs.writeFile(userDirectory + "/" + fileName, imageBuffer, (err) => {
              if (err) Logger.logErrorAndWarning(loggedInUserId, err);
            });
            user.userImages.push({
              contentType: "image/jpg",
              media:
                "http://167.99.200.101/seenblockstorage/" +
                user.email +
                "/" +
                fileName
            });
          
          objToReturn = user.userImages[user.userImages.length - 1];
          }
        } else if (type === "cover") {
          var fileName = getFormattedDate() + ".jpg";
          await fs.writeFile(userDirectory + "/" + fileName, imageBuffer, (err) => {
            if (err) Logger.logErrorAndWarning(loggedInUserId, err);
          });
          
          user.coverImage.media =
            "http://167.99.200.101/seenblockstorage/" +
            user.email +
            "/" +
            fileName;
          objToReturn = user.coverImage;
        }
      } catch (error) {
        Logger.logErrorAndWarning(loggedInUserId, error);
        reply({ error: error });
        return;
      }

      user.save(function(err) {
        if (err) {
          Logger.logErrorAndWarning(loggedInUserId, err);
          reply(Boom.notFound("Error updating the User")).code(500);
        }
      });

      reply({ objToReturn: objToReturn });
    }
  });
};

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

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}
