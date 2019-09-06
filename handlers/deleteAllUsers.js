
const User = require("../models/User");
const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {
    await User.deleteMany({ }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(loggedInUserId, err);
            reply(err);
        }

    });

    //remove userId from unreadConversations array for all users
    await Match.deleteMany({},
        function (err) {
            if(err){
                Logger.logErrorAndWarning("", err);
                reply({ status: "failure" });
            }
        }
    )

        //remove userId from unreadConversations array for all users
        await SettingsAndPreferences.deleteMany({},
            function (err) {
                if(err){
                    Logger.logErrorAndWarning("", err);
                    reply({ status: "failure" });
                }
            }
        )

};
