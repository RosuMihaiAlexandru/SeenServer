const createMessage = require("../createMessage");
const NotificationsProcessor = require("../../notifications/NotificationsProcessor");
const getMessageSenderWithChat = require("../../handlers/getMessageSenderWithChat");
const PushMessage = require("../../models/PushMessage");

module.exports = async function(messageRequest, reply) {
  var shouldIncrementBadge = false;
  await createMessage(messageRequest).then(result => {
    if (result) {
      shouldIncrementBadge = true;
    }
  });
  var sender = await getMessageSenderWithChat(
    messageRequest.message.fromUser.userId,
    messageRequest.receiverId
  );
  var receiverPlayerIds = messageRequest.receiverPlayerIds;
  var senderName = messageRequest.message.fromUser.displayName;
  var receiverName = messageRequest.receiverName;
  var messageBody = messageRequest.message.text;
  var senderAvatar = messageRequest.senderAvatar;

  var message = {
    app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
    headings: { en: senderName },
    contents: { en: messageBody },
    data: {
      notificationType: "message",
      senderId: sender._id,
      shouldIncrementBadge: shouldIncrementBadge
    },
    include_player_ids: receiverPlayerIds,
    large_icon: senderAvatar
  };
  NotificationsProcessor.process(message);
};
