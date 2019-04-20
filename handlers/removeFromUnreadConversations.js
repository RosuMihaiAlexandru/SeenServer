const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = (senderId, receiverId) => {
    return User.findOne({ _id: senderId }, function(error, user) {
        if (error) {
            Logger.logErrorAndWarning(senderId, error);
        }
        
        if (user && user.unreadConversations.includes(receiverId)) {
            user.unreadConversations.splice(user.unreadConversations.indexOf(receiverId), 1);
            user.save();
            return true;
        }
        return false;
    });
}