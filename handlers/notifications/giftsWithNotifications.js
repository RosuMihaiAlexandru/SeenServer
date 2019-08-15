const createOrUpdateMatch = require("../createOrUpdateMatch");
const NotificationsProcessor = require("../../notifications/NotificationsProcessor");

module.exports = async function (request, reply) {
    const match = await createOrUpdateMatch(request, reply);
    var member1PlayerIds = request.payload.member1PlayerIds;
    var member2PlayerIds = request.payload.member2PlayerIds;
    var member1Name = request.payload.member1Name;
    var member2Name = request.payload.member2Name;
    var member1Id = request.payload.member1;
    var member2Id = request.payload.member2;
    var giftKey = request.payload.giftKey;


    var giftMessage = {
        app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
        contents: { en: member1Name + " sent you a gift!" },
        data: {
            notificationType: "ar-gift",
            senderId: member1Id,
            giftKey: giftKey
        },
        include_player_ids: member2PlayerIds
    };

    NotificationsProcessor.process(giftMessage);
    reply(match);
};
