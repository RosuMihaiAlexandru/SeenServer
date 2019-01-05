const Conversation = require("../models/MembersChat");
const Message = require("../models/Message");
const MembersChat = require("../models/MembersChat");
const addUnreadConversation = require("./addUnreadConversation");

const fs = require("fs");

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

  Conversation.findOne({ members: { $all: [senderId, receiverId] } }).then(
    conversation => {
      if (msgType === "image") {
        var base64PhotoString = messageRequest.message.base64String;
        var imageBuffer = new Buffer(base64PhotoString, "base64");
        var conversationDirectory =
          "../../../mnt/seenblockstorage/" + conversation._id;
        if (!fs.existsSync(conversationDirectory)) {
          fs.mkdirSync(conversationDirectory);
        }
        var fileName = getFormattedDate() + ".jpg";
        fs.writeFileSync(conversationDirectory + "/" + fileName, imageBuffer);
        textMessage.mediaPath =
          "http://167.99.200.101/seenblockstorage/" +
          conversation._id +
          "/" +
          fileName;
      }
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
    }
  );

  if (!messageRequest.receiverIsOnChat) {
    return addUnreadConversation(receiverId, senderId);
  }
};

function getFormattedDate() {
  var date = new Date();
  var nowDate =
    date.getFullYear() +
    "" +
    (date.getMonth() + 1) +
    date.getDate() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds();
  return nowDate;
}