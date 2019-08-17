const createOrUpdateMatch = require("../createOrUpdateMatch");
const NotificationsProcessor = require("../../notifications/NotificationsProcessor");
const Logger = require("../../helpers/Logger");
const User = require("../../models/User");

module.exports = async function (request, reply) {
    const match = await createOrUpdateMatch(request, reply);

    var member1PlayerIds = request.payload.member1PlayerIds;
    var member2PlayerIds = request.payload.member2PlayerIds;
    var member1Name = request.payload.member1Name;
    var member2Name = request.payload.member2Name;
    var member1Id = request.payload.member1;
    var member2Id = request.payload.member2;
    var giftKey = request.payload.giftKey;
    var messageText = request.payload.messageText;
    var senderAvatar = request.payload.senderAvatar;

    await User.findOne({ _id: member1Id }, function(err, user) {
        if (err) {
          Logger.logErrorAndWarning(member1Id, err);
        }
    
        if (user) {
          user.arGiftsLeft = user.arGiftsLeft - 1;
          // user.paymentInfo.receipts.push(receipt);
          user.save(function(err) {
            if (err) {
              Logger.logErrorAndWarning(member1Id, err);
            }
          });
        }
      });

    var giftMessage = {
        app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
        contents: { en: member1Name + " sent you a special AR gift!" },
        data: {
            notificationType: "ar-gift",
            senderId: member1Id,
            giftKey: giftKey,
            messageText: messageText,
            senderName: member1Name,
            senderAvatar: senderAvatar
        },
        include_player_ids: member2PlayerIds
    };

    NotificationsProcessor.process(giftMessage);
    reply(match);
};
