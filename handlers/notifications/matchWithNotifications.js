const createOrUpdateMatch=require('../createOrUpdateMatch');
const ExpoNotificationsProcessor = require("../../notifications/ExpoNotificationsProcessor")
const PushMessage = require("../../models/PushMessage")

module.exports = async function (request, reply) {
    const match = await createOrUpdateMatch(request, reply);
    if (match.user1Liked && match.user2Liked) {
        var member1ExpoPushToken = request.payload.member1ExpoPushToken;
        var member2ExpoPushToken = request.payload.member2ExpoPushToken;
        var member1Name = request.payload.member1Name;
        var member2Name = request.payload.member2Name;

        ExpoNotificationsProcessor.process(new PushMessage({
            to: member1ExpoPushToken,
            sound: 'default',
            body: member2Name + ' likes you too!',
            data: { withSome: 'data' },
        }));

        ExpoNotificationsProcessor.process(new PushMessage({
            to: member2ExpoPushToken,
            sound: 'default',
            body: member1Name + ' likes you too!',
            data: { withSome: 'data' },
        }));
    }
    reply(match);
}