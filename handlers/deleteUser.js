const Boom = require("boom");
const User = require("../models/User");
const Match = require("../models/MembersChat");
const fs = require('fs');
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var deleteReasonList = JSON.parse(request.payload.deleteReasonList);

    await User.findOne({ _id: loggedInUserId }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(err);
            reply(err);
        }

        if (user) {

            for (var photoIndex = 0; photoIndex < user.userImages.length; ++photoIndex) {
                var filePath = '';

                var imageToBeDeleted = user.userImages[photoIndex].media;

                var match = imageToBeDeleted.substring(21, imageToBeDeleted.length);
                if (match.length > 1) {
                    filePath = "../../../mnt" + match;
                }
                else {
                    // Not found
                }

                // user.userImages.splice(photoIndex, 1);


                fs.access(filePath, error => {
                    if (!error) {
                        fs.unlink(filePath, function (error) {
                            if (error) {
                                Logger.logErrorAndWarning(error);
                                reply({ error: error, status: "failure" });
                            }

                        });
                    } else {
                        Logger.logErrorAndWarning(error);
                        reply({ error: error, status: "failure" });
                    }
                });
            }
        }
    });

    return await User.deleteOne({ _id: loggedInUserId }, function (err) {

        Match.deleteMany({ memberId: loggedInUserId }, function (err) {
            if (err) {
                Logger.logErrorAndWarning(err);
                reply({ status: "failure" });
            }
        })

        if (err) {
            Logger.logErrorAndWarning(err);
            reply({ status: "failure" });
        }
        else {
            Logger.logDeleteReason(loggedInUserId, deleteReasonList);
            reply({ status: "success" });
        }
    })

};
