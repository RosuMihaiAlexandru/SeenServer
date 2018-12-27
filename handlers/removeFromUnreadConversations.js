const User = require("../models/User");

module.exports = (senderId, receiverId) => {
    User.findOne({ _id: senderId}).then(
        (user) => {
            if(user && user.unreadConversations.includes(receiverId)){
                user.unreadConversations.splice(user.unreadConversations.indexOf(receiverId), 1);
                user.save();
            }
        }
    )
}