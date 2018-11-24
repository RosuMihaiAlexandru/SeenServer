const createMessage=require('../createMessage');
const NotificationsProcessor = require("../../notifications/NotificationsProcessor")
const PushMessage = require("../../models/PushMessage")

module.exports = async function (messageRequest, reply) {
        await createMessage(messageRequest);
        var receiverPlayerIds = messageRequest.receiverPlayerIds;
        var senderName = messageRequest.message.user.name;
        var receiverName = messageRequest.receiverName;
        var messageBody = messageRequest.message.text;

        var message = { 
            app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
            contents: {"en": senderName + ' sent you a message!' },
            "data":{
                "foo": "bar",
                "your": "custom metadata"
              },
            include_player_ids: receiverPlayerIds
          };
          NotificationsProcessor.process(message);
}