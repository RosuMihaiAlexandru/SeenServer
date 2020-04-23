
const User = require("../models/User");
const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function (request, reply) {

    //remove userId from unreadConversations array for all users
    await Match.deleteMany({},
        function (err) {
            if(err){
                Logger.logErrorAndWarning("", err);
                reply({ status: "failure" });
            }
            else{
                reply({ status: "success" });
            }
        }
    )
};
