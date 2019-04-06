const Boom = require("boom");
const User = require("../models/User");
const Match = require("../models/MembersChat");
const fs = require('fs');
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var deleteReasonList = JSON.parse(request.payload.deleteReasonList);

    await User.findOne({ _id: loggedInUserId }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(err);
            reply(err);
        }

        if (user) {
            user.userImages.forEach(function(userImage){

                var filePath = '';

                var imageToBeDeleted = userImage.media;

                var match = imageToBeDeleted.substring(21, imageToBeDeleted.length);
                if (match.length > 1) {
                    filePath = "../../../mnt" + match;
                }
                else {
                    // Not found
                }


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
            })
        }
    });

    //remove userId from unreadConversations array for all users
    await User.find({unreadConversations: loggedInUserId},
        function (err, users) {
            if(err){
                Logger.logErrorAndWarning(err);
                reply({ status: "failure" });
            } else if (users){
                users.forEach(function(user){
                    user.unreadConversations.splice(user.unreadConversations.indexOf(loggedInUserId), 1);
                    user.save(function(err){
                        if(err){
                            Logger.logErrorAndWarning(err);
                        }
                    });
                })
            }
        }
    )

    return await User.deleteOne({ _id: loggedInUserId }, function (err) {
        
        Match.deleteMany({ members: loggedInUserId }, function (err) {
            if (err) {
                Logger.logErrorAndWarning(err);
                reply({ status: "failure" });
            }
        })

        SettingsAndPreferences.deleteMany({ memberId: loggedInUserId }, function (err) {
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
