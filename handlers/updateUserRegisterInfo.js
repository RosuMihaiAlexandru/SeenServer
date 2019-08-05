const Boom = require("boom");
const User = require("../models/User");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");
const fs = require("fs");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var questions = JSON.parse(request.payload.questions);
    var sexPreference = JSON.parse(request.payload.sexPreference);
    var isFacebookLogin = request.payload.isFacebookLogin;
    var gender = request.payload.gender;

    return User.findOne({ _id: loggedInUserId }).then(async user => {
        var uploadedImage = {};
        if (user) {
            try {
                if(!isFacebookLogin){ 
                var base64PhotoString = request.payload.base64PhotoString;          
                var imageBuffer = new Buffer(base64PhotoString, "base64");
                var userDirectory = "../../../mnt/seenblockstorage/" + user.email;
                if (!fs.existsSync(userDirectory)) {
                    fs.mkdirSync(userDirectory);
                }

                var fileName = getFormattedDate() + ".jpg";
                fs.writeFileSync(userDirectory + "/" + fileName, imageBuffer);

                user.profileImage.media =
                    "http://167.99.200.101/seenblockstorage/" +
                    user.email +
                    "/" +
                    fileName;
                uploadedImage = user.profileImage;
            }
                Array.prototype.push.apply(user.matchingData.questions, questions);
                user.matchingData.lastDateAnswered = Date.now();
                user.matchingData.bigFiveResult = {};
                user.gender = gender;
                user.save(function (err) {
                    if (err) {
                        Logger.logErrorAndWarning(loggedInUserId, err);
                        reply(Boom.notFound("Error updating the User")).code(500);
                    }
                });

                await SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
                    if (err) {
                        Logger.logErrorAndWarning(loggedInUserId, err);
                        reply(err);
                    }

                    if (settingsAndPreferences) {
                        settingsAndPreferences.isShowMen = sexPreference.isShowMen;
                        settingsAndPreferences.isShowWomen = sexPreference.isShowWomen;
                    }

                    settingsAndPreferences.save(function (err) {
                        if (err) {
                            Logger.logErrorAndWarning(loggedInUserId, err);
                            reply(Boom.notFound("Error updating the SettingsAndPreferences"));
                        }
                    });
                })


            } catch (error) {
                Logger.logErrorAndWarning(loggedInUserId, error);
                reply({ error: error });
                return;
            }

            reply({ matchingData: user.matchingData, uploadedImageUrl: uploadedImage, status: "success" });
        }
    }).catch(error => {
        Logger.logErrorAndWarning(loggedInUserId, error);
    })
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