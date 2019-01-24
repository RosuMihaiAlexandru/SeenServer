const User = require("../models/User");

module.exports = (receiverId, senderId) => {
   return User.findOne({ _id: receiverId}).then(
        (user) => {
            if(user && !user.unreadConversations.includes(senderId)){
                user.unreadConversations.push(senderId);
                user.save();
                return true;
            }
            return false;
        }
    )
}