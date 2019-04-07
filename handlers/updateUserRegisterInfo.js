const Boom = require("boom");
const User = require("../models/User");

const fs = require("fs");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var base64PhotoString = request.payload.base64PhotoString;
    var questions = JSON.parse(request.payload.questions);
    var sexPreference = JSON.parse(request.payload.sexPreference);

    return User.findOne({ _id: loggedInUserId }).then(user => {
        var uploadedImage = '';
        if (user) {
            try {
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

                user.questions = questions;
                user.save(function (err) {
                    if (err) {
                        reply(Boom.notFound("Error updating the User")).code(500);
                    }
                });

                SettingsAndPreferences.findOne({ memberId: loggedInUserId }, function (err, settingsAndPreferences) {
                    if (err) {
                        reply(err);
                    }

                    if (settingsAndPreferences) {
                        settingsAndPreferences.isShowMen = sexPreference.isShowMen;
                        settingsAndPreferences.isShowWomen = sexPreference.isShowWomen;
                    }
                })


            } catch (error) {
                reply({ error: error });
                return;
            }

            reply({ uploadedImageUrl: uploadedImage });
        }
    })
}