const createOrUpdateMatch=require('../createOrUpdateMatch');
const NotificationsProcessor = require("../../notifications/NotificationsProcessor")
const PushMessage = require("../../models/PushMessage")

module.exports = async function (request, reply) {
    const match = await createOrUpdateMatch(request, reply);
    if (match.user1Liked && match.user2Liked) {
        var member1ExpoPushTokens = request.payload.member1ExpoPushTokens;
        var member2ExpoPushTokens = request.payload.member2ExpoPushTokens;
        var member1Name = request.payload.member1Name;
        var member2Name = request.payload.member2Name;

        for (var i = 0, len = member1ExpoPushTokens.length; i < len; i++) {
            NotificationsProcessor.process(new PushMessage({
                to: member1ExpoPushTokens[i],
                sound: 'default',
                body: member2Name + ' likes you too!',
                data: { withSome: 'data' },
            }));
          }

          for (var i = 0, len = member2ExpoPushTokens.length; i < len; i++) {
            NotificationsProcessor.process(new PushMessage({
                to: member2ExpoPushTokens[i],
                sound: 'default',
                body: member1Name + ' likes you too!',
                data: { withSome: 'data' },
            }));
          }
    }
    reply(match);
}