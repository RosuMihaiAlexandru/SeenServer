const Conversation = require("../models/MembersChat");
const Message = require("../models/Message");
const MembersChat = require("../models/MembersChat");
const addUnreadConversation = require("./addUnreadConversation");

module.exports = messageRequest => {
  const senderId = messageRequest.message.fromUser.userId;
  const receiverId = messageRequest.receiverId;
  const senderName = messageRequest.message.fromUser.displayName;
  const msgType = messageRequest.message.msgType;

  const textMessage = new Message({
    text: messageRequest.message.text ? messageRequest.message.text : "",
    msgType: messageRequest.message.msgType
      ? messageRequest.message.msgType
      : "",
    mediaPath: messageRequest.message.mediaPath
      ? messageRequest.message.mediaPath
      : "",
    duration: messageRequest.message.duration
      ? messageRequest.message.duration
      : "",
    user: {
      _id: senderId,
      name: senderName
    }
  });

  return Conversation.findOne({ members: { $all: [senderId, receiverId] } }).then(
    conversation => {
      if (!conversation) {
        const newConversation = new MembersChat({
          members: [senderId, receiverId],
          matchDate: null,
          user1LastSeenDate: null,
          user2LastSeenDate: null,
          user1Liked: false,
          user2Liked: false
        });
        newConversation.messages.push(textMessage);
        newConversation.save();
      } else {
        conversation.messages.push(textMessage);
        conversation.save();
      }
      if (messageRequest.receiverIsOnChat)
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      return addUnreadConversation(receiverId, senderId);
    }
  );
};

