const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var photoIndex = parseInt(request.payload.photoIndex);
    var updateType = request.payload.updateType;

    await User.findOne({ _id: loggedInUserId}, function(error, user) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }

        if (user) {
            if(updateType === "profile"){
                user.profileImage.media = user.userImages[photoIndex].media;               
            }

            if(updateType === "cover"){
                user.coverImage.media = user.userImages[photoIndex].media;       
            }

            user.save(function (err) {
                if (err) {
                    Logger.logErrorAndWarning(loggedInUserId, err);
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({
                profileImage: user.profileImage.media
            }).code(200);
        }
    });
};
