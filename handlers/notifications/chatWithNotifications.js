const createMessage = require("../createMessage");
const NotificationsProcessor = require("../../notifications/NotificationsProcessor");
const PushMessage = require("../../models/PushMessage");

module.exports = async function (messageRequest, reply) {
  var shouldIncrementBadge = false;
  return await createMessage(messageRequest).then(result => {
    if (result) {
      shouldIncrementBadge = true;
    }

    var receiverPlayerIds = messageRequest.receiverPlayerIds;
    var senderName = messageRequest.message.fromUser.displayName;
    var receiverName = messageRequest.receiverName;
    var messageBody = messageRequest.message.text ? messageRequest.message.text : 'Sent you an image';
    var senderAvatar = messageRequest.senderAvatar;

    var message = {
      app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
      headings: { en: senderName },
      contents: { en: messageBody },
      data: {
        notificationType: "message",
        senderId: messageRequest.message.fromUser.userId,
        shouldIncrementBadge: shouldIncrementBadge,
        senderName: senderName,
        senderAvatar: senderAvatar,
        messageBody: messageBody
      },
      include_player_ids: receiverPlayerIds,
      large_icon: senderAvatar
    };

    return NotificationsProcessor.process(message);
  });

};
