const createMessage=require('../createMessage');
const NotificationsProcessor = require("../../notifications/NotificationsProcessor")
const PushMessage = require("../../models/PushMessage")

module.exports = async function (messageRequest, reply) {
    const newMessage = await createMessage(messageRequest);
        var senderExpoPushTokens = messageRequest.senderExpoPushTokens;
        var receiverExpoPushTokens = messageRequest.receiverExpoPushTokens;;
        var senderName = messageRequest.message.user.name;
        var receiverName = messageRequest.receiverName;
        var messageBody = messageRequest.message.text;

        for (var i = 0, len = receiverExpoPushTokens.length; i < len; i++) {
            NotificationsProcessor.process(new PushMessage({
                to: receiverExpoPushTokens[i],
                sound: 'default',
                title: senderName,
                body:  messageBody,
                data: messageRequest.message,
            }));
          }

}